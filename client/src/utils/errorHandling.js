export const handleFirebaseError = (error) => {
  console.error(error);

  switch (error.code) {
    case "permission-denied":
      return "You don't have permission to perform this action.";
    case "not-found":
      return "The requested resource was not found.";
    case "already-exists":
      return "This resource already exists.";
    case "resource-exhausted":
      return "Quota exceeded or rate limit reached.";
    case "failed-precondition":
      return "The operation was rejected because the system is not in a state required for the operation's execution.";
    case "storage/unauthorized":
      return "You don't have permission to access this file.";
    case "storage/quota-exceeded":
      return "Storage quota exceeded.";
    default:
      return "An unexpected error occurred. Please try again later.";
  }
};
