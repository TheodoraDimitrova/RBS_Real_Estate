import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthStatus = () => {
  const [loggedIn, setloggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true); //Loading

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user from AuthStatus", user);
        setloggedIn(true);
      }
      setCheckingStatus(false);
    });

    return unsub;
  }, []);

  return { loggedIn, checkingStatus };
};
