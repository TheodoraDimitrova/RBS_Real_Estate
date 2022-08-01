import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SingIn from "./pages/SingIn";
import SingUp from "./pages/SingUp";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/singIn" element={<SingIn />} />
          <Route path="/singUp" element={<SingUp />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/forgotenPass" element={<ForgotPassword />} />
        </Routes>
        <Navbar/>
      </Router>

    

   
    </>
  );
}

export default App;
