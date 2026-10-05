
// import { useState } from "react";
// import { Mail } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import loginBg from "../assets/baloon_bg.png";
// // import forgotImage from "../assets/forgot-password.png";

// function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const navigate = useNavigate();


//   const handleSubmit = (e) => {
//     e.preventDefault();

//     console.log("Reset link requested for:", email);
//   };

//   return (
//     <div
//       className="h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat flex items-center justify-end"
//       style={{ backgroundImage: `url(${loginBg})` }}
//     >
//       <div className="mr-8 md:mr-16">
//         <div className="w-100 rounded-[40px] bg-white px-10 py-10 shadow-2xl">

         
//           <h1 className="text-center text-3xl font-bold text-black">
//             Forgot Password?
//           </h1>

//           {/* Image */}
//           {/* <div className="flex justify-center my-5">
//             <img
//               src={forgotImage}
//               alt="Forgot Password"
//               className="h-32 w-32 object-contain"
//             />
//           </div> */}

        
//           <p className="text-center text-sm leading-5 text-gray-500">
//             Don't worry! Enter your email address and
//             we'll send you a link to reset your password.
//           </p>

       
//           <form
//             onSubmit={handleSubmit}
//             className="mt-7 space-y-4"
//           >
       
//             <div className="relative">
//               <Mail
//                 size={20}
//                 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
//               />

//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Email"
//                 required
//                 className="
//                   h-12 w-full rounded-full
//                   border border-gray-200
//                   bg-white
//                   pl-12 pr-5
//                   text-sm
//                   outline-none
//                   shadow-[0_3px_5px_rgba(0,0,0,0.18)]
//                   focus:border-[#08BFAF]
//                 "
//               />
//             </div>

         
//             <button
//               type="submit"
//               className="
//                 h-12 w-full
//                 rounded-full
//                 bg-[#08BFAF]
//                 font-semibold
//                 text-white
//                 shadow-[0_3px_5px_rgba(0,0,0,0.18)]
//                 transition
//                 hover:bg-[#06aa9b]
//               "
//             >
//               Send Reset Link
//             </button>
//           </form>

//           <p className="mt-6 text-center text-xs text-gray-700">
//             Remember your password?{" "}
//             <button
//             onClick={() => navigate("/login")}
//               type="button"
//               className="font-semibold text-black hover:text-[#08BFAF]"
//             >
//               Login
//             </button>
//           </p>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;

