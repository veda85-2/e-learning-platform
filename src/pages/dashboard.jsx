import {
  useEffect,
  useMemo,
  useState,
} from "react";

import API from "./api/api";

import {
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  Bookmark,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Grid2X2,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Star,
  UserCircle,
  X,
  Sparkles,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  courses as courseContent,
} from "./data/courses";

import {
  getCourseRecommendations,
  getAnalytics,
  getCourseTitle,
  getCompletionRate,
  getFallbackRecommendations,
  filterRecommendations,
} from "./services/CoursePredictionApi";

import "./dashboard.css";

/*
=========================================================
DEFAULT ANALYTICS
=========================================================
*/

const defaultAnalytics = {
  enrolledCoursesCount: 0,
  averageQuizScore: 0,
  overallCompletionRate: 0,

  mean_score: 0,
  assessment_count: 0,
  course_score: 0,
  total_clicks: 0,
  active_days: 0,
  learning_resources: 0,
};

/*
=========================================================
DASHBOARD
=========================================================
*/

function Dashboard() {
  const navigate =
    useNavigate();

  const [analytics, setAnalytics] =
    useState(
      defaultAnalytics
    );

  const [availableCourses, setAvailableCourses] =
    useState([]);

  const [enrolledCourses, setEnrolledCourses] =
    useState([]);

  const [recommendations, setRecommendations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [recommendationsLoading, setRecommendationsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  /*
  =======================================================
  USER
  =======================================================
  */

  const user = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem(
          "user"
        ) || "{}"
      );
    } catch {
      return {};
    }
  }, []);

  /*
  =======================================================
  LOAD DASHBOARD
  =======================================================
  */

  async function loadDashboard() {
    setLoading(true);
    setError("");

    /*
    -------------------------------------------------------
    DASHBOARD
    -------------------------------------------------------
    */

    try {
      const response =
        await API.get(
          "/dashboard"
        );

      console.log(
        "✅ DASHBOARD API RESPONSE:",
        response.data
      );

      const data =
        response?.data?.data ||
        response?.data ||
        {};

      setAnalytics({
        ...defaultAnalytics,
        ...data,

        enrolledCoursesCount:
          Number(
            data?.enrolledCoursesCount ??
              data?.enrolled_courses_count ??
              0
          ),

        averageQuizScore:
          Number(
            data?.averageQuizScore ??
              data?.average_quiz_score ??
              data?.mean_score ??
              0
          ),

        overallCompletionRate:
          Number(
            data?.overallCompletionRate ??
              data?.overall_completion_rate ??
              data?.completionRate ??
              data?.completion_rate ??
              data?.progress ??
              0
          ),

        mean_score:
          Number(
            data?.mean_score ??
              data?.averageQuizScore ??
              0
          ),

        assessment_count:
          Number(
            data?.assessment_count ??
              data?.assessmentCount ??
              0
          ),

        course_score:
          Number(
            data?.course_score ??
              data?.courseScore ??
              data?.averageQuizScore ??
              0
          ),

        total_clicks:
          Number(
            data?.total_clicks ??
              data?.totalClicks ??
              0
          ),

        active_days:
          Number(
            data?.active_days ??
              data?.activeDays ??
              0
          ),

        learning_resources:
          Number(
            data?.learning_resources ??
              data?.learningResources ??
              0
          ),
      });
    } catch (err) {
      console.error(
        "❌ DASHBOARD API ERROR:",
        err.response?.data ||
          err.message
      );

      setError(
        "Unable to load dashboard analytics."
      );
    }

    /*
    -------------------------------------------------------
    MY COURSES
    -------------------------------------------------------
    */

    try {
      const response =
        await API.get(
          "/enrollments/my-courses"
        );

      console.log(
        "✅ MY COURSES API RESPONSE:",
        response.data
      );

      const data =
        response?.data?.data ||
        response?.data ||
        [];

      const enrolled =
        Array.isArray(data)
          ? data
          : [];

      console.log(
        "📚 ENROLLED COURSES COUNT:",
        enrolled.length
      );

      setEnrolledCourses(
        enrolled
      );
    } catch (err) {
      console.error(
        "❌ MY COURSES API ERROR:",
        err.response?.data ||
          err.message
      );

      setEnrolledCourses([]);
    }

    /*
    -------------------------------------------------------
    ALL COURSES
    -------------------------------------------------------
    */

    try {
      const response =
        await API.get(
          "/courses"
        );

      console.log(
        "✅ COURSES API RESPONSE:",
        response.data
      );

      const data =
        response?.data?.data ||
        response?.data ||
        [];

      const courses =
        Array.isArray(data)
          ? data
          : [];

      console.log(
        "📚 AVAILABLE COURSES COUNT:",
        courses.length
      );

      setAvailableCourses(
        courses
      );
    } catch (err) {
      console.error(
        "❌ COURSES API ERROR:",
        err.response?.data ||
          err.message
      );

      setAvailableCourses([]);
    }

    setLoading(false);
  }

  /*
  =======================================================
  LOAD AI RECOMMENDATIONS
  =======================================================
  */

  async function loadRecommendations() {
    if (
      !enrolledCourses.length
    ) {
      setRecommendations([]);
      return;
    }

    const currentCourse =
      getCourseTitle(
        enrolledCourses[0]
      ) ||
      user?.currentCourse ||
      user?.current_course ||
      "";

    if (!currentCourse) {
      setRecommendations([]);
      return;
    }

    setRecommendationsLoading(
      true
    );

    try {
      console.log(
        "📚 CURRENT COURSE:",
        currentCourse
      );

      const mlAnalytics =
        getAnalytics(
          analytics
        );

      console.log(
        "📊 ML ANALYTICS:",
        mlAnalytics
      );

      /*
      -----------------------------------------------------
      CALL ML
      -----------------------------------------------------
      */

      const mlResults =
        await getCourseRecommendations({
          currentCourse,
          analytics:
            mlAnalytics,
        });

      console.log(
        "🤖 ML RESULTS:",
        mlResults
      );

      /*
      -----------------------------------------------------
      FILTER AGAINST REAL LMS COURSES
      -----------------------------------------------------
      */

      let filtered =
        filterRecommendations({
          recommendations:
            mlResults,

          availableCourses:
            availableCourses,

          enrolledCourses:
            enrolledCourses,

          currentCourse:
            currentCourse,
        });

      console.log(
        "🤖 FILTERED ML RESULTS:",
        filtered
      );

      /*
      -----------------------------------------------------
      IF MODEL RETURNS ONLY PYTHON / INVALID RESULT
      -----------------------------------------------------
      */

      const onlyPython =
        filtered.length > 0 &&
        filtered.every(
          (item) =>
            item.course
              .toLowerCase()
              .includes("python")
        );

      if (
        filtered.length === 0 ||
        onlyPython
      ) {
        console.warn(
          "⚠️ ML model returned an unhelpful recommendation. Using progression fallback."
        );

        filtered =
          getFallbackRecommendations({
            currentCourse,
            enrolledCourses,
          });

        /*
        Only display fallback courses
        that really exist in LMS.
        */

        filtered =
          filterRecommendations({
            recommendations:
              filtered,

            availableCourses:
              availableCourses,

            enrolledCourses:
              enrolledCourses,

            currentCourse:
              currentCourse,
          });
      }

      console.log(
        "✅ FINAL RECOMMENDATIONS:",
        filtered
      );

      setRecommendations(
        filtered.slice(0, 5)
      );
    } catch (err) {
      console.error(
        "❌ RECOMMENDATION API ERROR:",
        err
      );

      /*
      -----------------------------------------------------
      ML FAILED → FALLBACK
      -----------------------------------------------------
      */

      const fallback =
        getFallbackRecommendations({
          currentCourse,
          enrolledCourses,
        });

      const validFallback =
        filterRecommendations({
          recommendations:
            fallback,

          availableCourses:
            availableCourses,

          enrolledCourses:
            enrolledCourses,

          currentCourse:
            currentCourse,
        });

      setRecommendations(
        validFallback.slice(
          0,
          5
        )
      );
    } finally {
      setRecommendationsLoading(
        false
      );
    }
  }

  /*
  =======================================================
  INITIAL LOAD
  =======================================================
  */

  useEffect(() => {
    loadDashboard();
  }, []);

  /*
  =======================================================
  RECOMMENDATIONS

  Wait until all course data is available.
  =======================================================
  */

  useEffect(() => {
    if (
      !loading &&
      enrolledCourses.length > 0 &&
      availableCourses.length > 0
    ) {
      loadRecommendations();
    }
  }, [
    loading,
    enrolledCourses,
    availableCourses,
    analytics,
  ]);

  /*
  =======================================================
  LOGOUT
  =======================================================
  */

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

  /*
  =======================================================
  COMPLETION
  =======================================================
  */

  const dashboardCompletion =
    getCompletionRate(
      analytics
    );

  const courseProgress =
    enrolledCourses
      .map((course) => {
        const value =
          Number(
            course?.completionRate ??
              course?.completion_rate ??
              course?.progressPercentage ??
              course?.progress_percentage ??
              course?.progress ??
              course?.completion ??
              course?.percentage ??
              course?.course?.completionRate ??
              course?.course?.progress
          );

        return Number.isFinite(
          value
        )
          ? value
          : null;
      })
      .filter(
        (value) =>
          value !== null
      );

  const calculatedCompletion =
    courseProgress.length > 0
      ? courseProgress.reduce(
          (sum, value) =>
            sum + value,
          0
        ) /
        courseProgress.length
      : 0;

  const completionRate =
    dashboardCompletion > 0
      ? dashboardCompletion
      : calculatedCompletion;

  /*
  =======================================================
  STATS
  =======================================================
  */

  const averageQuizScore =
    Math.max(
      0,
      Math.min(
        100,
        Number(
          analytics.averageQuizScore
        ) || 0
      )
    );

  const stats = {
    coursesInProgress:
      enrolledCourses.length,

    coursesCompleted:
      `${completionRate.toFixed(
        0
      )}%`,

    totalReadTime:
      `${averageQuizScore.toFixed(
        0
      )}%`,

    totalWatchTime:
      availableCourses.length,
  };

  /*
  =======================================================
  PIE DATA
  =======================================================
  */

  const pieData = [
    {
      name: "Completed",
      value: completionRate,
    },

    {
      name: "Remaining",
      value: Math.max(
        0,
        100 - completionRate
      ),
    },
  ];

  /*
  =======================================================
  UI
  =======================================================
  */

  return (
    <div className="app">

      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() =>
            setSidebarOpen(
              false
            )
          }
        />
      )}

      <Sidebar
        open={sidebarOpen}
        closeSidebar={() =>
          setSidebarOpen(
            false
          )
        }
        navigate={navigate}
        logout={logout}
      />

      <main className="main">

        <Header
          notificationCount={0}
          onMenu={() =>
            setSidebarOpen(
              true
            )
          }
          user={user}
        />

        {error && (
          <div className="api-warning">
            {error}

            <button
              onClick={
                loadDashboard
              }
            >
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div className="loading-bar" />
        )}

        <section className="content">

          <div className="welcome-row">

            <div>
              <p className="dashboard-eyebrow">
                LEARNING DASHBOARD
              </p>

              <h1>
                Overview
              </h1>
            </div>

            <button
              className="logout-inline"
              onClick={logout}
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>

          <Stats
            stats={stats}
          />

          <div className="dashboard-grid">

            <div className="left-column">

              <Courses
                courses={
                  enrolledCourses
                }
                navigate={
                  navigate
                }
              />

              <div className="bottom-grid">

                <TimeSpending
                  data={pieData}
                  completion={
                    completionRate
                  }
                />

                <Others
                  recommendations={
                    recommendations
                  }
                  loading={
                    recommendationsLoading
                  }
                  navigate={
                    navigate
                  }
                />

              </div>

            </div>

            <LiveClasses />

          </div>

        </section>

      </main>

    </div>
  );
}

/*
=========================================================
SIDEBAR
=========================================================
*/

function Sidebar({
  open,
  closeSidebar,
  navigate,
  logout,
}) {
  const menuItems = [
    {
      icon: Grid2X2,
      label: "Dashboard",
      path: "/dashboard",
      active: true,
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
    },

    {
      icon: Bookmark,
      label: "Study Material",
      path: "/study-material",
    },

    {
      icon: UserCircle,
      label: "My Profile",
      path: "/profile",
    },
  ];

  return (
    <aside
      className={`sidebar ${
        open
          ? "sidebar-open"
          : ""
      }`}
    >

      <button
        className="sidebar-close"
        onClick={
          closeSidebar
        }
      >
        <X size={22} />
      </button>

      <div className="brand">

        <div className="brand-logo">
          ES
        </div>

        <span>
          EDU
          <span>
            sphere
          </span>
        </span>

      </div>

      <nav className="navigation">

        {menuItems.map(
          ({
            icon: Icon,
            label,
            path,
            active,
          }) => (
            <button
              key={label}
              className={`nav-item ${
                active
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                navigate(path);
                closeSidebar();
              }}
            >
              <Icon
                size={19}
                strokeWidth={1.8}
              />

              <span>
                {label}
              </span>
            </button>
          )
        )}

      </nav>

      <button
        className="upgrade-button"
        onClick={() =>
          navigate(
            "/course-recommendations"
          )
        }
      >
        💎 Upgrade Premium
      </button>

      <button
        className="sidebar-logout"
        onClick={logout}
      >
        <LogOut size={17} />
        Logout
      </button>

    </aside>
  );
}

/*
=========================================================
HEADER
=========================================================
*/

function Header({
  notificationCount,
  onMenu,
}) {
  return (
    <header className="header">

      <button
        className="mobile-menu"
        onClick={onMenu}
      >
        <Menu size={23} />
      </button>

      <div className="search-box">

        <Search size={23} />

        <input
          placeholder="Search anything"
        />

      </div>

      <div className="header-actions">

        <button className="notification">

          <Bell size={21} />

          {notificationCount >
            0 && (
            <span className="notification-count">
              {
                notificationCount
              }
            </span>
          )}

        </button>

      </div>

    </header>
  );
}

/*
=========================================================
STATS
=========================================================
*/

function Stats({ stats }) {
  const items = [
    {
      title: "Courses Enrolled",
      value:
        stats.coursesInProgress,
      icon: Bookmark,
      className: "orange",
    },

    {
      title: "Completion Rate",
      value:
        stats.coursesCompleted,
      icon: Bookmark,
      className: "green",
    },

    {
      title: "Average Quiz Score",
      value:
        stats.totalReadTime,
      icon: Star,
      className: "blue",
    },

    {
      title: "Available Courses",
      value:
        stats.totalWatchTime,
      icon: BookOpen,
      className: "pink",
    },
  ];

  return (
    <div className="stats-grid">

      {items.map(
        (item) => {
          const Icon =
            item.icon;

          return (
            <div
              className="stat-card"
              key={
                item.title
              }
            >

              <div>
                <p>
                  {item.title}
                </p>

                <strong>
                  {item.value}
                </strong>
              </div>

              <div
                className={`stat-icon ${item.className}`}
              >
                <Icon size={21} />
              </div>

            </div>
          );
        }
      )}

    </div>
  );
}

/*
=========================================================
COURSES
=========================================================
*/

function Courses({
  courses,
  navigate,
}) {
  function openCoursePlayer(
    course
  ) {
    const title = getCourseTitle(
      course
    );

    const normalized =
      title.toLowerCase();

    const courseMap = {
      "html & css":
        "html-css",

      jss: "jss",

      javascript: "jss",

      "react js":
        "react-js",

      react:
        "react-js",

      "react development":
        "react-js",

      "node.js & express":
        "node-express",

      "node js":
        "node-express",

      "node.js":
        "node-express",

      "sql & database":
        "sql-database",

      sql:
        "sql-database",

      "python programming":
        "python",

      python:
        "python",

      ml: "ml",

      "machine learning":
        "ml",
    };

    const courseId =
      courseMap[
        normalized
      ];

    if (!courseId) {
      console.error(
        "❌ COURSE NOT FOUND:",
        title
      );
      return;
    }

    const localCourse =
      courseContent.find(
        (item) =>
          item.id ===
          courseId
      );

    if (!localCourse) {
      console.error(
        "❌ LOCAL COURSE NOT FOUND:",
        courseId
      );
      return;
    }

    navigate(
      `/course/${localCourse.id}`
    );
  }

  return (
    <section className="panel courses-panel">

      <PanelHeader
        title="My Courses"
        action={() =>
          navigate(
            "/courses"
          )
        }
      />

      <div className="courses-list">

        {courses.length === 0 ? (
          <div className="panel-empty">

            No enrolled courses yet.

            <button
              onClick={() =>
                navigate(
                  "/courses"
                )
              }
            >
              Browse courses
            </button>

          </div>
        ) : (
          courses
            .slice(0, 5)
            .map(
              (
                course,
                index
              ) => (
                <div
                  className="course-row"
                  key={
                    course?._id ||
                    course?.id ||
                    index
                  }
                >

                  <div className="course-thumbnail course-placeholder">

                    <BookOpen
                      size={24}
                    />

                  </div>

                  <div className="course-info">

                    <strong>
                      {getCourseTitle(
                        course
                      ) ||
                        "Untitled Course"}
                    </strong>

                    <span>
                      Enrolled course
                    </span>

                  </div>

                  <button
                    className="play-button"
                    onClick={() =>
                      openCoursePlayer(
                        course
                      )
                    }
                  >
                    <CirclePlay
                      size={25}
                    />
                  </button>

                </div>
              )
            )
        )}

      </div>

    </section>
  );
}

/*
=========================================================
PIE CHART
=========================================================
*/

function TimeSpending({
  data,
  completion,
}) {
  return (
    <section className="panel spending-panel">

      <PanelHeader
        title="Completion"
      />

      <div
        className="chart-wrapper"
        style={{
          width: "100%",
          height: "260px",
          minHeight: "260px",
          position: "relative",
        }}
      >

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={88}
              paddingAngle={3}
              labelLine={false}
              label={({ value }) =>
                `${Math.round(
                  value
                )}%`
              }
            >

              {data.map(
                (entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? "#08aaa0"
                        : "#e7edf2"
                    }
                  />
                )
              )}

            </Pie>

            <Tooltip
              formatter={(value) =>
                `${Number(
                  value
                ).toFixed(0)}%`
              }
            />

          </PieChart>

        </ResponsiveContainer>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            flexDirection:
              "column",
            pointerEvents:
              "none",
          }}
        >

          <strong
            style={{
              fontSize: "28px",
            }}
          >
            {Number(
              completion || 0
            ).toFixed(0)}
            %
          </strong>

          <span
            style={{
              fontSize: "12px",
              opacity: 0.65,
            }}
          >
            Complete
          </span>

        </div>

      </div>

      <div className="chart-caption">

        <strong>
          {Number(
            completion || 0
          ).toFixed(0)}
          %
        </strong>

        <span>
          overall completion
        </span>

      </div>

    </section>
  );
}

/*
=========================================================
AI RECOMMENDATIONS
=========================================================
*/

function Others({
  recommendations,
  loading,
  navigate,
}) {
  return (
    <section className="panel others-panel">

      <PanelHeader
        title="AI Recommendations"
        action={() =>
          navigate(
            "/course-recommendations"
          )
        }
      />

      <div className="recommendations-list">

        {loading ? (
          <div className="panel-empty">

            <Sparkles
              size={20}
            />

            <span>
              Generating personalized recommendations...
            </span>

          </div>
        ) : recommendations.length ===
          0 ? (
          <div className="panel-empty">

            <Sparkles
              size={20}
            />

            <div>

              <strong>
                No recommendations yet
              </strong>

              <span>
                Continue learning to
                receive personalized
                recommendations.
              </span>

            </div>

          </div>
        ) : (
          recommendations
            .slice(0, 3)
            .map(
              (
                item,
                index
              ) => {

                const probability =
                  Math.round(
                    Number(
                      item?.probability ||
                        0
                    ) * 100
                  );

                return (
                  <div
                    className="recommendation"
                    key={`${item.course}-${index}`}
                  >

                    <div className="recommendation-icon">
                      <Sparkles
                        size={18}
                      />
                    </div>

                    <div className="recommendation-info">

                      <strong>
                        {
                          item.course
                        }
                      </strong>

                      <span>
                        {
                          probability
                        }
                        % match
                      </span>

                    </div>

                    <button
                      className="recommendation-btn"
                      onClick={() =>
                        navigate(
                          "/course-recommendations"
                        )
                      }
                    >
                      View
                    </button>

                  </div>
                );
              }
            )
        )}

      </div>

    </section>
  );
}

/*
=========================================================
CALENDAR
=========================================================
*/

function LiveClasses() {
  const [month, setMonth] =
    useState(
      new Date().getMonth()
    );

  const [year, setYear] =
    useState(
      new Date().getFullYear()
    );

  const date =
    new Date(
      year,
      month,
      1
    );

  const monthName =
    date.toLocaleString(
      "default",
      {
        month: "short",
      }
    );

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const firstDay =
    date.getDay();

  function previousMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(
        year - 1
      );
    } else {
      setMonth(
        month - 1
      );
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(
        year + 1
      );
    } else {
      setMonth(
        month + 1
      );
    }
  }

  return (
    <section className="panel live-panel">

      <div className="live-header">

        <h2>
          Study Calendar
        </h2>

      </div>

      <div className="calendar">

        <div className="calendar-controls">

          <button
            onClick={
              previousMonth
            }
          >
            <ChevronLeft
              size={18}
            />
          </button>

          <select
            value={month}
            onChange={(e) =>
              setMonth(
                Number(
                  e.target.value
                )
              )
            }
          >
            {Array.from({
              length: 12,
            }).map(
              (_, index) => (
                <option
                  value={index}
                  key={index}
                >
                  {new Date(
                    2026,
                    index
                  ).toLocaleString(
                    "default",
                    {
                      month:
                        "short",
                    }
                  )}
                </option>
              )
            )}
          </select>

          <select
            value={year}
            onChange={(e) =>
              setYear(
                Number(
                  e.target.value
                )
              )
            }
          >
            {[2025, 2026, 2027].map(
              (y) => (
                <option
                  value={y}
                  key={y}
                >
                  {y}
                </option>
              )
            )}
          </select>

          <button
            onClick={
              nextMonth
            }
          >
            <ChevronRight
              size={18}
            />
          </button>

        </div>

        <div className="calendar-title">
          {monthName} {year}
        </div>

        <div className="weekdays">

          {[
            "Su",
            "Mo",
            "Tu",
            "We",
            "Th",
            "Fr",
            "Sa",
          ].map(
            (day) => (
              <span key={day}>
                {day}
              </span>
            )
          )}

        </div>

        <div className="calendar-days">

          {Array.from({
            length: firstDay,
          }).map(
            (_, index) => (
              <span
                className="empty-day"
                key={`empty-${index}`}
              />
            )
          )}

          {Array.from({
            length:
              daysInMonth,
          }).map(
            (_, index) => {

              const day =
                index + 1;

              const now =
                new Date();

              const today =
                day ===
                  now.getDate() &&
                month ===
                  now.getMonth() &&
                year ===
                  now.getFullYear();

              return (
                <button
                  className={
                    today
                      ? "today"
                      : ""
                  }
                  key={day}
                >
                  {day}
                </button>
              );
            }
          )}

        </div>

      </div>

      <div className="class-list">

        <div className="class-item">

          <div>

            <strong>
              Keep learning
            </strong>

            <span>
              Use Study Material
              for your next session.
            </span>

          </div>

          <CalendarDays
            size={18}
          />

        </div>

      </div>

    </section>
  );
}

/*
=========================================================
PANEL HEADER
=========================================================
*/

function PanelHeader({
  title,
  action,
}) {
  return (
    <div className="panel-header">

      <h2>
        {title}
      </h2>

      {action && (
        <button
          onClick={action}
        >
          View All
        </button>
      )}

    </div>
  );
}

export default Dashboard;