import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";
import AuthPageHeader from "../components/shared/AuthPageHeader";

const SIGN_IN_HEADING_ID = "sign-in-heading";
const SIGN_IN_LEAD_ID = "sign-in-lead";

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate("/profile");
        toast.success("Signed in successfully.");
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("Wrong password.");
      }
      if (error.code === "auth/user-not-found") {
        toast.error("No account found for this email.");
      }
    }
  };

  return (
    <div className="pageContainer authPage">
      <div className="authCard">
        <AuthPageHeader
          headingId={SIGN_IN_HEADING_ID}
          leadId={SIGN_IN_LEAD_ID}
          title="Welcome back"
          description="Sign in to manage your listings and reach buyers and renters."
        />

        <form
          className="authForm"
          onSubmit={onSubmit}
          noValidate
          aria-labelledby={SIGN_IN_HEADING_ID}
          aria-describedby={SIGN_IN_LEAD_ID}
        >
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
            <label htmlFor="password" className="authLabel">
              Password
            </label>
            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                className="passwordInput"
                placeholder="••••••••"
                id="password"
                value={password}
                onChange={onChange}
                autoComplete="current-password"
                required
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

          <Link to="/forgotenPass" className="forgotPasswordLink">
            Forgot password?
          </Link>

          <button type="submit" className="authSubmit btn-grad">
            Sign in
          </button>
        </form>

        <div className="authDivider">
          <span>or</span>
        </div>

        <OAuth />

        <p className="authSwitch">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="authSwitchLink">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
