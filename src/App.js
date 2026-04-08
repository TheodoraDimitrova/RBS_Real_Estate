import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Explore from "./pages/Explore";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import NotFound from "./pages/NotFound";
import AdPage from "./pages/AdPage";
import Contact from "./pages/Contact";
import EditAd from "./pages/EditAd";
import Feedback from "./pages/Feedback";
import { FeedbackProvider } from "./context/FeedbackContext";
import { AdvertisementsProvider } from "./context/AdvertisementsContext";
import { useEffect, useState } from "react";
import { useAuthStatus } from "./hooks/useAuthStatus";
import AuthNoticeModal from "./components/AuthNoticeModal";

function App() {
  const location = useLocation();
  const { loggedIn, checkingStatus } = useAuthStatus();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalDismissed, setAuthModalDismissed] = useState(() => {
    return localStorage.getItem("authNoticeDismissed") === "true";
  });

  const isPrivatePath = (pathname) =>
    pathname === "/profile" ||
    pathname === "/create-ad" ||
    pathname.startsWith("/edit-ad/") ||
    /^\/category\/[^/]+\/[^/]+$/.test(pathname);

  useEffect(() => {
    if (
      checkingStatus ||
      loggedIn ||
      authModalDismissed ||
      isPrivatePath(location.pathname)
    ) {
      setShowAuthModal(false);
      return;
    }

    setShowAuthModal(true);
  }, [checkingStatus, loggedIn, authModalDismissed, location.pathname]);

  const handleCloseAuthModal = () => {
    localStorage.setItem("authNoticeDismissed", "true");
    setAuthModalDismissed(true);
    setShowAuthModal(false);
  };

  return (
    <>
      <FeedbackProvider>
        <AdvertisementsProvider>
          <AuthNoticeModal
            show={showAuthModal}
            onClose={handleCloseAuthModal}
          />
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/edit-ad/:adId" element={<PrivateRoute />}>
              <Route path="/edit-ad/:adId" element={<EditAd />} />
            </Route>
            <Route path="/create-ad" element={<PrivateRoute />}>
              <Route path="/create-ad" element={<CreateListing />} />
            </Route>
            <Route
              path="/category/:categoryName/:id"
              element={<PrivateRoute />}
            >
              <Route path="/category/:categoryName/:id" element={<AdPage />} />
            </Route>
            <Route path="/category/:categoryName" element={<Category />} />

            <Route path="/contact/:adName" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/feedback" element={<Feedback />} />

            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/forgotenPass" element={<ForgotPassword />} />

            <Route path="*" element={<NotFound />} />
          </Routes>

          <Navbar />

          <ToastContainer />
        </AdvertisementsProvider>
      </FeedbackProvider>
    </>
  );
}

export default App;
