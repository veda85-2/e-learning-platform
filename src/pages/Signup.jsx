
import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "./api/api";

import signupImage from "../assets/signup_illustration_transparent.png";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
  e.preventDefault();
  setError("");

  // Validation
  if (!name.trim()) {
    setError("Please enter your full name.");
    return;
  }

  if (!email.trim()) {
    setError("Please enter your email.");
    return;
  }

  if (password.length < 8) {
    setError("Password must be at least 8 characters long.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const response = await API.post("/auth/signup", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    console.log("SIGNUP RESPONSE:", response.data);

    // Signup successful
    // No token required here if your backend only creates the account.
    setLoading(false);

    // Go to login page
    navigate("/login", {
      replace: true,
      state: {
        message: "Account created successfully. Please login.",
        email: email.trim().toLowerCase(),
      },
    });

  } catch (err) {
    console.error("Signup error:", err);

    setError(
      err.response?.data?.message ||
      err.message ||
      "Unable to connect to the server. Please check your connection."
    );

    setLoading(false);
  }
};
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">

      {/* ================= LEFT IMAGE ================= */}
      <div
        className="
          hidden
          h-screen
          w-1/2
          items-center
          justify-center
          overflow-hidden
          md:flex
        "
      >
        <img
          src={signupImage}
          alt="Signup illustration"
          className="h-[40%] max-w-150 object-contain"
        />
      </div>

      <div
        className="
          flex
          h-screen
          w-full
          items-center
          justify-center
          overflow-auto
          bg-white
          px-4
         py-8
          sm:px-8
          md:w-1/2
        "
      >

        {/* ================= SIGNUP CARD ================= */}
        <div
          className="
            my-auto
            w-full
            h-3/4
            max-w-md
            rounded-[30px]
            bg-[#08BFAF]
            px-6
            py-12!
            shadow-[0_8px_35px_rgba(0,0,0,0.10)]
            sm:px-8
            sm:py-7
            md:px-9
          "
        >

          {/* HEADING */}
          <h1 className="text-center text-2xl font-bold text-black sm:text-3xl">
            Sign Up
          </h1>

          <p className="mt-1 text-center text-xs text-gray-900 sm:text-sm">
            Create your account and start learning.
          </p>

          {/* ================= FORM ================= */}
          <form
            onSubmit={handleSignup}
            className="mt-5 flex flex-col gap-3 sm:mt-6 sm:gap-3.5"
          >

            {/* FULL NAME */}
            <div className="relative">
              <UserRound
                size={17}
                strokeWidth={1.8}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                autoComplete="name"
                required
                className="
                  h-12 w-full rounded-full border border-gray-200
                  bg-white pl-12 pr-5 text-sm outline-none
                  shadow-[0_3px_8px_rgba(0,0,0,0.12)]
                  focus:border-[#08BFAF] focus:ring-2
                  focus:ring-[#08BFAF]/20 sm:h-13
                "
              />
            </div>

            {/* EMAIL */}
            <div className="relative">
              <Mail
                size={17}
                strokeWidth={1.8}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                required
                className="
                  h-12 w-full rounded-full border border-gray-200
                  bg-white pl-12 pr-5 text-sm outline-none
                  shadow-[0_3px_8px_rgba(0,0,0,0.12)]
                  focus:border-[#08BFAF] focus:ring-2
                  focus:ring-[#08BFAF]/20 sm:h-13
                "
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock
                size={17}
                strokeWidth={1.8}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="new-password"
                minLength={8}
                required
                className="
                  h-12 w-full rounded-full border border-gray-200
                  bg-white pl-12 pr-12 text-sm outline-none
                  shadow-[0_3px_8px_rgba(0,0,0,0.12)]
                  focus:border-[#08BFAF] focus:ring-2
                  focus:ring-[#08BFAF]/20 sm:h-13
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#08BFAF]"
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>

          
            <div className="relative">
              <Lock
                size={17}
                strokeWidth={1.8}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                autoComplete="new-password"
                minLength={8}
                required
                className="
                  h-12 w-full rounded-full border border-gray-200
                  bg-white pl-12 pr-12 text-sm outline-none
                  shadow-[0_3px_8px_rgba(0,0,0,0.12)]
                  focus:border-[#08BFAF] focus:ring-2
                  focus:ring-[#08BFAF]/20 sm:h-13
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#08BFAF]"
              >
                {showConfirmPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>

            {/* TERMS */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-0.5 h-4 w-4 accent-[#08BFAF]"
              />

              <label
                htmlFor="terms"
                className="text-xs text-gray-700 sm:text-sm"
              >
                I agree to the{" "}
                <span className="font-semibold text-black">
                  Terms & Conditions
                </span>
              </label>
            </div>

            {/* API ERROR */}
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {/* SIGNUP BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                mt-1 h-12 w-full rounded-full bg-black!
                text-sm font-semibold text-white
                shadow-[0_4px_8px_rgba(0,0,0,0.15)]
                transition hover:bg-[#06aa9b] active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-60
                sm:h-13
              "
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>

          </form>

          {/* LOGIN */}
          <p className="mt-4 text-center text-xs text-gray-700 sm:mt-5 sm:text-sm">
            Already have an account?{" "}

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-bold! mt-2.5 text-[#131414] hover:text-[#131515]"
            >
              Login
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Signup;