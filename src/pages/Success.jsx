import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthButton from "../components/AuthButton";

export default function Success() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="flex min-h-screen flex-col px-7 py-8">

        <button
          onClick={() => navigate(-1)}
          className="self-start text-xl"
        >
          ←
        </button>

        <div className="flex flex-1 flex-col items-center justify-center">

          {/* Replace with actual Figma illustration */}
          <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-2xl bg-green-100 text-6xl">
            ✓
          </div>

          <h1 className="text-xl font-bold">
            Successfully Verified
          </h1>

          <p className="mt-3 text-center text-sm text-gray-500">
            Your account has been successfully verified.
          </p>

          <div className="mt-10 w-full">
            <AuthButton onClick={() => navigate("/login")}>
              Continue to Login
            </AuthButton>
          </div>

        </div>
      </div>
    </AuthLayout>
  );
}