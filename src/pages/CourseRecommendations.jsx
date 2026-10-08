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
  getCourseTitle,
  normalizeCourseName,
} from "./services/CoursePredictionApi";

import "./recommendations.css";


export default function CourseRecommendations() {

  const navigate = useNavigate();


  /* =====================================================
     SIDEBAR
  ===================================================== */

  const [sidebarOpen, setSidebarOpen] =
    useState(false);


  /* =====================================================
     ENROLLED COURSES
  ===================================================== */

  const [enrolled, setEnrolled] =
    useState([]);


  /* =====================================================
     CURRENT COURSE
  ===================================================== */

  const [currentCourse, setCurrentCourse] =
    useState("");


  /* =====================================================
     RECOMMENDATIONS
  ===================================================== */

  const [recommendations, setRecommendations] =
    useState([]);


  /* =====================================================
     LOADING
  ===================================================== */

  const [loadingCourses, setLoadingCourses] =
    useState(true);

  const [loadingRecommendations, setLoadingRecommendations] =
    useState(false);


  /* =====================================================
     ERROR
  ===================================================== */

  const [error, setError] =
    useState("");


  /* =====================================================
     LOAD USER'S ENROLLED COURSES
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


        console.log(
          "✅ MY COURSES API RESPONSE:",
          response.data
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


        /*
        ---------------------------------------------------
        SET FIRST ENROLLED COURSE
        ---------------------------------------------------
        */

        if (list.length > 0) {

          const firstCourse =
            getCourseTitle(
              list[0]
            );


          setCurrentCourse(
            firstCourse
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

  async function getRecommendations(event) {

    event?.preventDefault();


    /*
    -------------------------------------------------------
    CHECK CURRENT COURSE
    -------------------------------------------------------
    */

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
        "================================="
      );

      console.log(
        "🤖 STARTING AI RECOMMENDATION"
      );

      console.log(
        "📚 CURRENT COURSE:",
        currentCourse
      );

      console.log(
        "================================="
      );


      /*
      =====================================================
      CALL BACKEND ML PROXY
      =====================================================

      IMPORTANT:

      We DO NOT call /dashboard here.

      We DO NOT calculate ML analytics here.

      Backend will get:

      - mean_score
      - assessment_count
      - course_score
      - total_clicks
      - active_days
      - learning_resources

      from MongoDB.

      React only sends:

      {
        current_course: "HTML & CSS"
      }

      =====================================================
      */


      const results =
        await getCourseRecommendations({
          currentCourse,
        });


      console.log(
        "🤖 RAW ML RESULTS:",
        results
      );


      /*
      =====================================================
      FILTER RESULTS
      =====================================================
      */

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


      const currentCourseName =
        normalizeCourseName(
          currentCourse
        ).toLowerCase();


      /*
      -----------------------------------------------------
      GET AVAILABLE LMS COURSES
      -----------------------------------------------------
      */

      const availableCoursesMap =
        new Map();


      courses.forEach(
        (course) => {

          const title =
            getCourseTitle(course);


          if (!title) return;


          availableCoursesMap.set(
            normalizeCourseName(
              title
            ).toLowerCase(),
            title
          );

        }
      );


      /*
      -----------------------------------------------------
      FILTER ML RESULTS
      -----------------------------------------------------
      */

      const filtered =
        results
          .filter((item) => {

            const recommendationName =
              normalizeCourseName(
                item?.course
              ).toLowerCase();


            /*
            No course name
            */

            if (!recommendationName) {
              return false;
            }


            /*
            Don't recommend
            current course
            */

            if (
              recommendationName ===
              currentCourseName
            ) {
              return false;
            }


            /*
            Don't recommend
            already enrolled course
            */

            if (
              enrolledNames.has(
                recommendationName
              )
            ) {
              return false;
            }


            /*
            Course must actually
            exist in LMS
            */

            if (
              !availableCoursesMap.has(
                recommendationName
              )
            ) {
              console.warn(
                "⚠️ ML recommended course not found in LMS:",
                item?.course
              );

              return false;
            }


            return true;

          })

          .map((item) => {

            const normalized =
              normalizeCourseName(
                item.course
              ).toLowerCase();


            return {

              course:
                availableCoursesMap.get(
                  normalized
                ),

              probability:
                Number(
                  item?.probability || 0
                ),

              source:
                item?.source ||
                "ml",

            };

          })

          /*
          Highest probability first
          */

          .sort(
            (a, b) =>
              b.probability -
              a.probability
          )

          /*
          Maximum 5 recommendations
          */

          .slice(0, 5);


      console.log(
        "✅ FINAL ML RECOMMENDATIONS:",
        filtered
      );


      /*
      =====================================================
      SET RESULTS
      =====================================================
      */

      setRecommendations(
        filtered
      );


      /*
      -----------------------------------------------------
      NO VALID RESULTS
      -----------------------------------------------------
      */

      if (filtered.length === 0) {

        setError(
          "The AI service did not return another eligible course."
        );

      }


    } catch (err) {

      console.error(
        "❌ RECOMMENDATION ERROR:",
        err
      );


      /*
      -----------------------------------------------------
      SHOW ERROR
      -----------------------------------------------------
      */

      setRecommendations([]);


      setError(
        err?.message ||
        "Unable to get AI course recommendations."
      );


    } finally {

      setLoadingRecommendations(
        false
      );

    }

  }


  /* =====================================================
     AUTOMATICALLY LOAD RECOMMENDATIONS
     WHEN COURSE IS AVAILABLE
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
     MENU ITEMS
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


  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="recommendation-layout">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="recommendation-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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


        {/* CLOSE MOBILE SIDEBAR */}

        <button
          className="recommendation-mobile-menu"
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-label="Close menu"
        >
          <X size={22} />
        </button>


        {/* BRAND */}

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


        {/* NAVIGATION */}

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


        {/* PREMIUM */}

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


        {/* LOGOUT */}

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


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="recommendation-header">

          <div className="recommendation-header-left">


            {/* MOBILE MENU */}

            <button
              className="recommendation-mobile-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>


            {/* BACK */}

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


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="recommendation-content">


          {/* TITLE */}

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
              FORM
          ================================================= */}

          <form
            className="recommendation-form"
            onSubmit={
              getRecommendations
            }
          >


            {/* COURSE SELECT */}

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


            {/* BUTTON */}

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


            {/* LOADING */}

            {loadingRecommendations && (

              <div className="recommendation-empty">

                <Sparkles size={28} />

                <span>
                  AI is analyzing your
                  learning progress...
                </span>

              </div>

            )}


            {/* EMPTY */}

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


            {/* RESULTS */}

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

                      <Sparkles
                        size={24}
                      />


                      <h2>
                        {item.course}
                      </h2>


                      <p>
                        AI probability:{" "}

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