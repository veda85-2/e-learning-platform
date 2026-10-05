import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Loading from "./pages/loading";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard";
import StudyMaterial from "./pages/study_material";
import CourseRecommendations from "./pages/CourseRecommendations";
import Courses from "./pages/Courses";
import ProtectedRoute from "./pages/ProtectedRoute";
import Quiz from "./quizzes";
import Profile from "./pages/profile";

import CoursePlayer from "./pages/courseplayer";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loading />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/courses" element={<Courses />} />

          <Route
            path="/course-recommendations"
            element={<CourseRecommendations />}
          />

          <Route
            path="/study-material"
            element={<StudyMaterial />}
          />

          <Route
            path="/quiz/:courseId"
            element={<Quiz />}
          />
          <Route
            path="/profile"
            element={<Profile />}
          />
       <Route
  path="/course/:courseId"
  element={<CoursePlayer />}
/>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}