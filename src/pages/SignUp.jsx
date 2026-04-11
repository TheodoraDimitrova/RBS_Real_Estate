import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import AuthPageHeader from "../components/shared/AuthPageHeader";

const SIGN_UP_HEADING_ID = "sign-up-heading";
const SIGN_UP_LEAD_ID = "sign-up-lead";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const { name, email, phone, password } = formData;
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
      copyUser.phone = (copyUser.phone || "").trim();
      copyUser.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), copyUser);
      navigate("/");
      toast.success("Welcome to RBS Real Estate!");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("That email address is already in use.");
      }

      if (error.code === "auth/invalid-email") {
        toast.error("That email address is invalid.");
      }
    }
  };

  return (
    <div className="pageContainer authPage">
      <div className="authCard">
        <AuthPageHeader
          headingId={SIGN_UP_HEADING_ID}
          leadId={SIGN_UP_LEAD_ID}
          title="Create your account"
          description="List a property in minutes. Use Google for the fastest sign-up."
        />

        <form
          className="authForm"
          onSubmit={handleSubmit}
          noValidate
          aria-labelledby={SIGN_UP_HEADING_ID}
          aria-describedby={SIGN_UP_LEAD_ID}
        >
          <div className="authField">
            <label htmlFor="name" className="authLabel">
              Name
            </label>
            <input
              type="text"
              className="nameInput"
              placeholder="Your name"
              id="name"
              value={name}
              onChange={onChange}
              autoComplete="name"
              required
            />
          </div>
          <div className="authField">
            <label htmlFor="email" className="authLabel">
              Email
            </label>
            <input
              type="email"
              className="emailInput"
              placeholder="you@example.com"
              id="email"
              value={email}
              onChange={onChange}
              autoComplete="email"
              required
            />
          </div>
          <div className="authField">
            <label htmlFor="phone" className="authLabel">
              Phone <span className="authLabelOptional">(optional)</span>
            </label>
            <input
              type="tel"
              className="phoneInput"
              placeholder="Helps buyers reach you"
              id="phone"
              value={phone}
              onChange={onChange}
              autoComplete="tel"
            />
          </div>
          <div className="authField">
            <label htmlFor="password" className="authLabel">
              Password
            </label>
            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                className="passwordInput"
                placeholder="At least 6 characters"
                id="password"
                value={password}
                onChange={onChange}
                autoComplete="new-password"
                required
                minLength={6}
              />
              <button
                type="button"
                className="showPassword"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <img src={visibilityIcon} alt="" width={22} height={22} />
              </button>
            </div>
          </div>

          <button type="submit" className="authSubmit btn-grad">
            Create account
          </button>
        </form>

        <div className="authDivider">
          <span>or</span>
        </div>

        <OAuth />

        <p className="authSwitch">
          Already have an account?{" "}
          <Link to="/sign-in" className="authSwitchLink">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
