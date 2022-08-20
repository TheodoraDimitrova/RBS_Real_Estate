import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const copyUser = { ...formData };
      delete copyUser.password;
      copyUser.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), copyUser);
      navigate("/");
      //'User account created & signed in!'
      toast.success("Welcome to Reant, Bay and Sell Real Estate");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("That email address is already in use!");
      }

      if (error.code === "auth/invalid-email") {
        toast.error("That email address is invalid!");
      }
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Walcome!</p>
        </header>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="nameInput"
            placeholder="Name"
            id="name"
            value={name}
            onChange={onChange}
          />
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              className="passwordInput"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
            />
            <img
              src={visibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPassword((privState) => !privState)}
            />
          </div>
          <Link to="/forgotenPass" className="forgotPasswordLink">
            Forgot Password
          </Link>
          <div className="signInBar">
            <p className="singInText">Sign Up</p>
            <button className="signInButton" type="submit">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        <OAuth />
        <Link to="/sign-in" className="registerLink">
          Sing In Instead
        </Link>
      </div>
    </>
  );
}

export default SignUp;
