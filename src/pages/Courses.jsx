import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  FolderKanban,
  Grid2X2,
  LogOut,
  MessageCircle,
  Search,
  UserRound,
  X,
} from "lucide-react";
import './course.css';

import { useNavigate } from "react-router-dom";
import API from "./api/api";

export default function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  /* =====================================================
     LOAD COURSES
  ===================================================== */

  async function load() {
    try {
      setLoading(true);
      setError("");

      const [
        catalogRes,
        enrolledRes,
      ] = await Promise.all([
        API.get("/courses"),
        API.get("/enrollments/my-courses"),
      ]);

      setCourses(
        catalogRes.data?.data || []
      );

      setEnrolled(
        enrolledRes.data?.data || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load courses."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  /* =====================================================
     ENROLL
  ===================================================== */

  async function enroll(courseId) {
    try {
      setMessage("");

      await API.post(
        `/courses/${courseId}/enroll`
      );

      setMessage(
        "Course enrolled successfully."
      );

      await load();
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Unable to enroll in this course."
      );
    }
  }

  /* =====================================================
     LOGOUT
  ===================================================== */

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  }

  /* =====================================================
     SIDEBAR
  ===================================================== */

  const menuItems = [
    {
      icon: Grid2X2,
      label: "Dashboard",
      path: "/dashboard",
    },

    {
      icon: BookOpen,
      label: "My Courses",
      path: "/courses",
      active: true,
    },

    {
      icon: Bookmark,
      label: "Course Recommendations",
      path: "/course-recommendations",
    },

    {
      icon: MessageCircle,
      label: "Study Materials",
      path: "/study-material",
    },

  
    {
      icon: UserRound,
      label: "My Profile",
      path: "/profile",
    },
  ];

  /* =====================================================
     FILTER
  ===================================================== */

  const enrolledIds = new Set(
    enrolled.map(
      (course) => course._id
    )
  );

  const filtered = courses.filter(
    (course) =>
      `${course.title} ${
        course.description || ""
      } ${
        course.category || ""
      }`
        .toLowerCase()
        .includes(
          query.toLowerCase()
        )
  );

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="simple-page">

      {/* SIDEBAR */}

      <aside
        className={`profile-sidebar ${
          sidebarOpen
            ? "profile-sidebar-open"
            : ""
        }`}
      >

        <button
          className="profile-sidebar-close"
          onClick={() =>
            setSidebarOpen(false)
          }
        >
          <X size={21} />
        </button>

        {/* LOGO */}

        <div className="profile-brand">

          <div className="profile-brand-logo">
            ES
          </div>

          <span>
            EDU<span>sphere</span>
          </span>

        </div>

        {/* NAVIGATION */}

        <nav className="profile-navigation">

          {menuItems.map(
            ({
              icon: Icon,
              label,
              path,
              active,
            }) => (
              <button
                key={label}
                className={`profile-nav-item ${
                  active
                    ? "profile-nav-active"
                    : ""
                }`}
                onClick={() => {
                  navigate(path);

                  setSidebarOpen(
                    false
                  );
                }}
              >
                <Icon size={17} />

                <span>
                  {label}
                </span>
              </button>
            )
          )}

        </nav>

        {/* PREMIUM */}

        <button
          className="profile-premium"
          onClick={() =>
            navigate(
              "/course-recommendations"
            )
          }
        >
          <span>💎</span>

          Upgrade to Premium
        </button>

      </aside>

      {/* HEADER */}

      <header className="simple-header">

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <ArrowLeft size={18} />

          Dashboard
        </button>

        <div className="simple-brand">

          <span className="brand-logo">
            ES
          </span>

          EDU<span>sphere</span>

        </div>

        <button onClick={logout}>

          <LogOut size={18} />

          Logout

        </button>

      </header>

      {/* MAIN */}

      <main className="simple-content">

        {/* TITLE */}

        <div className="simple-title-row">

          <div>

            <p className="eyebrow">
              LEARNING LIBRARY
            </p>

            <h1>
              Courses
            </h1>

          </div>

          <div className="simple-search">

            <Search size={18} />

            <input
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
              placeholder="Search courses"
            />

          </div>

        </div>

        {/* MESSAGE */}

        {message && (
          <div className="simple-message">
            {message}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="simple-error">

            {error}

            <button
              onClick={load}
            >
              Retry
            </button>

          </div>
        )}

        {/* COURSES */}

        {loading ? (

          <div className="simple-empty">
            Loading courses…
          </div>

        ) : (

          <div className="course-grid">

            {filtered.map(
              (course) => (

                <article
                  className="course-card"
                  key={course._id}
                >

                  <div className="course-card-icon">
                    <BookOpen size={24} />
                  </div>

                  <span className="course-category">
                    {course.category ||
                      "Course"}
                  </span>

                  <h2>
                    {course.title}
                  </h2>

                  <p>
                    {course.description ||
                      "Start learning this course."}
                  </p>

                  {/* FOOTER */}

                  <div className="course-card-footer">

                    <span>
                      {course.price ===
                      0
                        ? "Free"
                        : `₹${course.price}`}
                    </span>

                    {enrolledIds.has(
                      course._id
                    ) ? (

                      <div className="course-actions">

                        <button
                          className="quiz-button"
                          onClick={() =>
                            navigate(
                              `/quiz/${course._id}`
                            )
                          }
                        >
                          Take Quiz
                        </button>

                        <button
                          className="enrolled"
                          disabled
                        >
                          Enrolled
                        </button>

                      </div>

                    ) : (

                      <button
                        className="enroll-button"
                        onClick={() =>
                          enroll(
                            course._id
                          )
                        }
                      >
                        Enroll
                      </button>

                    )}

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </main>

    </div>
  );
}