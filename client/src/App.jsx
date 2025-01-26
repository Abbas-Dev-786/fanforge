import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Navbar from "./components/shared/navbar";
import Footer from "./components/shared/footer";

const App = () => {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
