
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

import loginImage from "../assets/login_illustration_transparent.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

 
const handleLogin = async (e) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const { data } = await API.post("/auth/signin", {
      email: email.trim().toLowerCase(),
      password,
    });

    console.log("LOGIN RESPONSE:", data);

    if (!data?.success) {
      throw new Error(data?.message || "Login failed. Please try again.");
    }

    // Support both possible backend response formats
    const token =
      data?.token ||
      data?.data?.token ||
      data?.user?.token;

    const user =
      data?.user ||
      data?.data?.user ||
      {};

    if (!token) {
      console.error("Token missing from login response:", data);
      throw new Error(
        "Login successful, but the server did not return a token."
      );
    }

   
    localStorage.setItem("token", token);
    
    localStorage.setItem("user", JSON.stringify(user));

    console.log("TOKEN SAVED:", token);
    console.log("REDIRECTING TO DASHBOARD...");

  
    navigate("/dashboard", { replace: true });

  } catch (err) {
    console.error("Login error:", err);

    setError(
      err.response?.data?.message ||
      err.message ||
      "Unable to connect to the server. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-screen w-full overflow-hidden bg-white flex">

   
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
          src={loginImage}
          alt="Healthcare"
          className="h-[65%] max-w-200 object-contain"
        />
      </div>

  
      <div
        className="
          flex
          h-screen
          w-full
          items-center
          justify-center
          overflow-hidden
          bg-white
          px-4
          sm:px-6
          md:w-1/2
        "
      >

    
        <div
          className="
            w-full
            max-w-md
            rounded-[30px]
            bg-[#08BFAF]
            px-6
            py-6
            shadow-[0_8px_35px_rgba(0,0,0,0.10)]
            sm:px-8
            sm:py-7
            md:px-9
          "
        >

     
          <h1 className="text-center text-2xl font-bold text-black sm:text-3xl">
            Login
          </h1>

      
          <form
            onSubmit={handleLogin}
            className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4"
          >

            {/* EMAIL */}
            <div className="relative">

              <Mail
                size={17}
                strokeWidth={1.8}
                className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="
                  h-12
                  w-full
                  rounded-full
                  border
                  border-gray-200
                  bg-white
                  pl-12
                  pr-5
                  text-sm
                  outline-none
                  shadow-[0_3px_8px_rgba(0,0,0,0.12)]
                  focus:border-[#08BFAF]
                  focus:ring-2
                  focus:ring-[#08BFAF]/20
                  sm:h-13
                "
              />

            </div>

          
            <div className="relative">

              <Lock
                size={17}
                strokeWidth={1.8}
                className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="
                  h-12
                  w-full
                  rounded-full
                  border
                  border-gray-200
                  bg-white
                  pl-12
                  pr-12
                  text-sm
                  outline-none
                  shadow-[0_3px_8px_rgba(0,0,0,0.12)]
                  focus:border-[#08BFAF]
                  focus:ring-2
                  focus:ring-[#08BFAF]/20
                  sm:h-13
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-5
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  transition
                  hover:text-[#08BFAF]
                "
              >
                {showPassword ? (
                  <EyeOff size={17} strokeWidth={1.8} />
                ) : (
                  <Eye size={17} strokeWidth={1.8} />
                )}
              </button>

            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">

              <button
                type="button"
                onClick={() => setError("Password reset is not included in the current backend API contract. Please use your account password or ask the backend team to expose a reset endpoint.")}
                className="
                  text-xs
                  text-gray-700
                  hover:text-[#1c2827]
                  sm:text-sm
                "
              >
                Forgot Password?
              </button>

            </div>
            
{error && (
  <p
    role="alert"
    className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
  >
    {error}
  </p>
)}

            {/* LOGIN BUTTON */}
            <button
              disabled={loading}
              type="submit"
              className="
                mt-1
                h-12
                w-full
                
                rounded-full
                bg-black!
                text-sm
                font-semibold
                text-white
                shadow-[0_4px_8px_rgba(0,0,0,0.15)]
                transition
                hover:bg-[#484a4a]
                active:scale-[0.98]
                sm:h-13
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="my-5 flex items-center gap-3 sm:my-6">

            <div className="h-px flex-1 bg-gray-300" />

            <span className="text-xs text-gray-500 sm:text-sm">
              or
            </span>

            <div className="h-px flex-1 bg-gray-300" />

          </div>

          <button
            type="button"
            onClick={() => setError("Google sign-in is not configured by the supplied backend API.")}
            className="
              flex h-12 w-full items-center justify-center gap-3 rounded-full
              bg-[#eef1f9]! text-xs font-medium text-gray-900 transition hover:bg-gray-200
              sm:h-13 sm:text-sm
            "
          >

            <span className="text-base font-bold text-[#4285F4]">
              G
            </span>

            Continue with Google

          </button>

         
          <button
            type="button"
            onClick={() => setError("Apple sign-in is not configured by the supplied backend API.")}
            className="
              mt-2 flex h-12 w-full items-center justify-center gap-3 rounded-full
              bg-[#eef1f9]! text-xs font-medium text-gray-900 transition hover:bg-gray-200
              sm:h-13 sm:text-sm
            "
          >

            <span className="text-lg text-black">
              
            </span>

            Continue with Apple

          </button>

          <button
            type="button"
            onClick={() => setError("Guest access is not available because the dashboard API requires authentication.")}
            className="
              mt-2 flex h-12 w-full items-center justify-center gap-3 rounded-full
              bg-[#eef1f9]! text-xs font-medium text-gray-900 transition hover:bg-gray-200
              sm:h-13 sm:text-sm
            "
          >

            <UserRound
              size={17}
              strokeWidth={1.8}
            />

            Continue as Guest

          </button>

      
          <p className="mt-4 text-center text-xs text-gray-600 sm:mt-5 sm:text-sm">

            Don't have an account?{" "}

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="
                font-bold!
                text-[#0b0b0b]
                hover:text-[#141818]
                
              "
            >
              Sign Up
            </button>

          </p>

        </div>
      </div>

    </div>
  );
}

export default Login;

