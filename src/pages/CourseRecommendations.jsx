import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Grid2X2,
  LogOut,
  Menu,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import API from "./api/api";

import { courses } from "./data/courses";

import {
  getCourseRecommendations,
  getAnalytics,
  getCourseTitle,
  normalizeCourseName,
} from "./services/CoursePredictionApi";

import "./recommendations.css";


export default function CourseRecommendations() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [enrolled, setEnrolled] =
    useState([]);

  const [currentCourse, setCurrentCourse] =
    useState("");

  const [recommendations, setRecommendations] =
    useState([]);

  const [loadingCourses, setLoadingCourses] =
    useState(true);

  const [loadingRecommendations, setLoadingRecommendations] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =====================================================
     LOAD ENROLLED COURSES
  ===================================================== */

  useEffect(() => {
    let active = true;

    async function loadCourses() {
      try {
        setLoadingCourses(true);
        setError("");

        const response =
          await API.get(
            "/enrollments/my-courses"
          );

        const data =
          response.data?.data ??
          response.data?.courses ??
          response.data ??
          [];

        const list =
          Array.isArray(data)
            ? data
            : [];

        if (!active) return;

        setEnrolled(list);

        if (list.length > 0) {
          setCurrentCourse(
            getCourseTitle(list[0])
          );
        }
      } catch (err) {
        if (!active) return;

        console.error(
          "❌ COURSES ERROR:",
          err.response?.data ||
            err.message
        );

        setError(
          err.response?.data?.message ||
            "Unable to load your enrolled courses."
        );
      } finally {
        if (active) {
          setLoadingCourses(false);
        }
      }
    }

    loadCourses();

    return () => {
      active = false;
    };
  }, []);


  /* =====================================================
     GET AI RECOMMENDATIONS
  ===================================================== */

  async function getRecommendations(
    event
  ) {
    event?.preventDefault();

    if (!currentCourse) {
      setError(
        "Please enroll in at least one course first."
      );
      return;
    }

    try {
      setLoadingRecommendations(true);
      setError("");
      setRecommendations([]);

      console.log(
        "📚 CURRENT COURSE:",
        currentCourse
      );


      /* -----------------------------------------------
         GET STUDENT ANALYTICS
      ------------------------------------------------ */

      const dashboardResponse =
        await API.get(
          "/dashboard"
        );

      const dashboardData =
        dashboardResponse.data?.data ??
        dashboardResponse.data ??
        {};

      console.log(
        "📊 DASHBOARD DATA:",
        dashboardData
      );


      /* -----------------------------------------------
         NORMALIZE ANALYTICS

         Missing values become 0.
         We DO NOT block the ML request.
      ------------------------------------------------ */

      const analytics =
        getAnalytics(
          dashboardData
        );

      console.log(
        "📊 ML ANALYTICS:",
        analytics
      );


      /* -----------------------------------------------
         CALL ML API
      ------------------------------------------------ */

      const results =
        await getCourseRecommendations({
          currentCourse,
          analytics,
        });


      /* -----------------------------------------------
         FIND ALREADY ENROLLED COURSES
      ------------------------------------------------ */

      const enrolledNames =
        new Set(
          enrolled
            .map(
              (course) =>
                normalizeCourseName(
                  getCourseTitle(course)
                ).toLowerCase()
            )
            .filter(Boolean)
        );


      /* -----------------------------------------------
         REMOVE COURSES ALREADY ENROLLED
      ------------------------------------------------ */

      const filtered =
        results
          .filter(
            (item) =>
              !enrolledNames.has(
                normalizeCourseName(
                  item.course
                ).toLowerCase()
              )
          )
          .slice(0, 10);


      setRecommendations(
        filtered
      );


      if (
        filtered.length === 0
      ) {
        setError(
          "The AI service did not return another eligible course."
        );
      }

    } catch (err) {
      console.error(
        "❌ RECOMMENDATION ERROR:",
        err
      );

      setRecommendations([]);

      setError(
        err.message ||
          "Unable to get AI recommendations."
      );
    } finally {
      setLoadingRecommendations(
        false
      );
    }
  }


  /* =====================================================
     AUTOMATIC RECOMMENDATION
  ===================================================== */

  useEffect(() => {
    if (
      !loadingCourses &&
      currentCourse
    ) {
      getRecommendations();
    }
  }, [
    loadingCourses,
    currentCourse,
  ]);


  /* =====================================================
     OPEN RECOMMENDED COURSE
  ===================================================== */

  function openRecommendedCourse(
    courseName
  ) {
    const normalized =
      normalizeCourseName(
        courseName
      );

    const course =
      courses.find(
        (item) =>
          normalizeCourseName(
            item.title
          ).toLowerCase() ===
          normalized.toLowerCase()
      );

    if (!course) {
      setError(
        `Course "${courseName}" is not available in the LMS.`
      );
      return;
    }

    navigate(
      `/course/${course.id}`
    );
  }


  /* =====================================================
     LOGOUT
  ===================================================== */

  function logout() {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate(
      "/login",
      {
        replace: true,
      }
    );
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
    },

    {
      icon: Sparkles,
      label: "Course Recommendations",
      path: "/course-recommendations",
      active: true,
    },

    {
      icon: Bookmark,
      label: "Study Material",
      path: "/study-material",
    },

    {
      icon: UserRound,
      label: "My Profile",
      path: "/profile",
    },
  ];


  return (
    <div className="recommendation-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`recommendation-sidebar ${
          sidebarOpen
            ? "open"
            : ""
        }`}
      >

        <button
          className="recommendation-mobile-menu"
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-label="Close menu"
        >
          <X size={22} />
        </button>


        <div className="recommendation-brand">
          <div className="recommendation-brand-logo">
            ES
          </div>

          <div className="recommendation-brand-name">
            EDU
            <span>
              sphere
            </span>
          </div>
        </div>


        <nav className="recommendation-nav">

          {menuItems.map(
            ({
              icon: Icon,
              label,
              path,
              active,
            }) => (
              <button
                key={label}
                className={
                  active
                    ? "active"
                    : ""
                }
                onClick={() => {
                  navigate(path);
                  setSidebarOpen(
                    false
                  );
                }}
              >
                <Icon size={18} />
                <span>
                  {label}
                </span>
              </button>
            )
          )}

        </nav>


        <button
          className="recommendation-premium"
          onClick={() =>
            navigate(
              "/course-recommendations"
            )
          }
        >
          💎 Upgrade to Premium
        </button>


        <button
          className="recommendation-logout"
          onClick={logout}
        >
          <LogOut size={16} />
          Logout
        </button>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="recommendation-main">

        <header className="recommendation-header">

          <div className="recommendation-header-left">

            <button
              className="recommendation-mobile-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>


            <button
              className="recommendation-header-back"
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
            >
              <ArrowLeft size={18} />
              Dashboard
            </button>

          </div>


          <div className="recommendation-header-right">
            <Sparkles
              size={20}
              color="#08aaa0"
            />
          </div>

        </header>


        <section className="recommendation-content">

          {/* =================================================
              TITLE
          ================================================= */}

          <div className="recommendation-title-row">

            <p className="eyebrow">
              AI LEARNING ASSISTANT
            </p>

            <h1>
              Course Recommendations
            </h1>

            <p>
              Your enrolled course and learning
              activity are analyzed to recommend
              what you should learn next.
            </p>

          </div>


          {/* =================================================
              COURSE SELECTOR
          ================================================= */}

          <form
            className="recommendation-form"
            onSubmit={
              getRecommendations
            }
          >

            <select
              value={currentCourse}
              onChange={(event) =>
                setCurrentCourse(
                  event.target.value
                )
              }
              disabled={
                loadingCourses ||
                loadingRecommendations
              }
            >

              <option value="">
                {loadingCourses
                  ? "Loading your courses..."
                  : "Select your current course"}
              </option>

              {enrolled.map(
                (
                  course,
                  index
                ) => {

                  const title =
                    getCourseTitle(
                      course
                    );

                  if (!title)
                    return null;

                  return (
                    <option
                      key={
                        course?._id ||
                        course?.course?._id ||
                        `${title}-${index}`
                      }
                      value={title}
                    >
                      {title}
                    </option>
                  );
                }
              )}

            </select>


            <button
              type="submit"
              disabled={
                loadingCourses ||
                loadingRecommendations ||
                !currentCourse
              }
            >
              {loadingRecommendations
                ? "Analyzing..."
                : "Refresh Recommendations"}
            </button>

          </form>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="recommendation-error">
              {error}
            </div>
          )}


          {/* =================================================
              RECOMMENDATION GRID
          ================================================= */}

          <div className="recommendation-grid">

            {loadingRecommendations && (
              <div className="recommendation-empty">

                <Sparkles size={28} />

                <span>
                  AI is analyzing your
                  learning progress...
                </span>

              </div>
            )}


            {!loadingRecommendations &&
              recommendations.length === 0 &&
              !error && (
                <div className="recommendation-empty">

                  <Sparkles size={28} />

                  <span>
                    Your AI recommendations
                    will appear here.
                  </span>

                </div>
              )}


            {!loadingRecommendations &&
              recommendations.map(
                (
                  item,
                  index
                ) => {

                  const probability =
                    Number(
                      item.probability ||
                        0
                    );

                  return (
                    <article
                      className="recommendation-card"
                      key={`${item.course}-${index}`}
                    >

                      <Sparkles size={24} />

                      <h2>
                        {item.course}
                      </h2>

                      <p>
                        AI probability:

                        {" "}

                        <strong>
                          {Math.round(
                            probability *
                              100
                          )}
                          %
                        </strong>
                      </p>

                      <small>
                        This is a model probability,
                        not a guaranteed success percentage.
                      </small>


                      <button
                        type="button"
                        className="start-learning-button"
                        onClick={() =>
                          openRecommendedCourse(
                            item.course
                          )
                        }
                      >
                        Start Learning
                      </button>

                    </article>
                  );
                }
              )}

          </div>

        </section>

      </main>

    </div>
  );
}