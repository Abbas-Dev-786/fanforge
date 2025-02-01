from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import requests
from typing import Dict, Any
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_service_account_token() -> str:
    """Get Google Cloud authentication token using service account."""
    try:
        # Get the path to service account file from environment variable
        credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
        if not credentials_path:
            raise ValueError("GOOGLE_APPLICATION_CREDENTIALS environment variable not set")

        # Create credentials using service account file
        credentials = service_account.Credentials.from_service_account_file(
            credentials_path,
            scopes=['https://www.googleapis.com/auth/cloud-platform']
        )

        # If credentials are expired, refresh them
        if not credentials.valid:
            credentials.refresh(Request())

        return credentials.token

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to obtain token from service account: {str(e)}"
        )

@app.post("/api/recommendations")
async def get_recommendations(request_body: Dict[Any, Any] = None):
    """
    Endpoint to get recommendations from Google Cloud Discovery Engine.
    """
    try:
        token = get_service_account_token()
        
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        # Get API URL from environment variables
        base_url = os.getenv('DISCOVERY_ENGINE_URL')
        if not base_url:
            raise ValueError("DISCOVERY_ENGINE_URL environment variable not set")
        
        response = requests.post(base_url, headers=headers, json=request_body or {})
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Discovery Engine API error: {response.text}"
            )
            
        return response.json()
        
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)