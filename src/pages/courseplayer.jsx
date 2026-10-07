import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { courses } from "./data/courses";

import "./courseplayer.css";

export default function CoursePlayer() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const PROGRESS_KEY = `edusphere_progress_${courseId}`;

 
  const course = courses.find(
    (item) => item.id === courseId
  );


  const [
    selectedModule,
    setSelectedModule,
  ] = useState(
    course?.modules?.[0] || null
  );



// const currentUser =
//   JSON.parse(localStorage.getItem("user")) || {};

// const userId =
//   currentUser.id ||
//   currentUser.email ||
//   currentUser._id ||
//   "guest";

const progressKey =
  `edusphere_progress_${userId}_${courseId}`;

const [completedLessons, setCompletedLessons] =
  useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(progressKey) || "[]"
      );

      return Array.isArray(saved)
        ? saved
        : [];
    } catch {
      return [];
    }
  });



  const iframeRef = useRef(null);
  const youtubePlayerRef = useRef(null);


useEffect(() => {
  if (!selectedModule?.videoUrl) {
    return;
  }

  const videoId = getYouTubeVideoId(
    selectedModule.videoUrl
  );

  if (!videoId) {
    return;
  }

  let player = null;
  let progressTimer = null;
  let cancelled = false;

  const completeLesson = () => {
    if (cancelled) return;

    console.log(
      "🎉 VIDEO COMPLETED:",
      selectedModule.id
    );

    markLessonComplete(
      selectedModule.id
    );
  };

  const startTracking = () => {
    if (
      cancelled ||
      !window.YT ||
      !window.YT.Player ||
      !iframeRef.current
    ) {
      return;
    }

    try {
      player = new window.YT.Player(
        iframeRef.current,
        {
          events: {
            onReady: (event) => {
              console.log(
                "🎥 YouTube player ready"
              );

              const checkProgress = () => {
                if (cancelled || !player) {
                  return;
                }

                try {
                  const duration =
                    player.getDuration();

                  const currentTime =
                    player.getCurrentTime();

                  if (
                    duration > 0 &&
                    currentTime > 0
                  ) {
                    const percentage =
                      (currentTime / duration) *
                      100;

                    console.log(
                      `🎬 Video progress: ${percentage.toFixed(
                        1
                      )}%`
                    );

                    // Complete at 90%
                    if (percentage >= 90) {
                      completeLesson();

                      if (progressTimer) {
                        clearInterval(
                          progressTimer
                        );
                      }
                    }
                  }
                } catch (error) {
                  // Player may not be ready yet
                }
              };

              progressTimer =
                setInterval(
                  checkProgress,
                  1000
                );
            },

            onStateChange: (event) => {
              console.log(
                "YouTube state:",
                event.data
              );

              // 0 = ENDED
              if (
                window.YT &&
                event.data ===
                  window.YT.PlayerState
                    .ENDED
              ) {
                completeLesson();

                if (progressTimer) {
                  clearInterval(
                    progressTimer
                  );
                }
              }
            },

            onError: (event) => {
              console.error(
                "YouTube error:",
                event.data
              );
            },
          },
        }
      );
    } catch (error) {
      console.error(
        "❌ YouTube player initialization failed:",
        error
      );
    }
  };



  if (
    window.YT &&
    window.YT.Player
  ) {
    setTimeout(() => {
      startTracking();
    }, 500);
  } else {
  

    let script =
      document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );

    if (!script) {
      script =
        document.createElement(
          "script"
        );

      script.src =
        "https://www.youtube.com/iframe_api";

      script.async = true;

      document.body.appendChild(
        script
      );
    }

    const oldCallback =
      window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady =
      () => {
        if (
          typeof oldCallback ===
          "function"
        ) {
          oldCallback();
        }

        if (!cancelled) {
          setTimeout(() => {
            startTracking();
          }, 500);
        }
      };
  }

  
  return () => {
    cancelled = true;

    if (progressTimer) {
      clearInterval(progressTimer);
    }

    if (player) {
      try {
        player.destroy();
      } catch {
        // Ignore cleanup error
      }
    }
  };
}, [
  selectedModule?.id,
  selectedModule?.videoUrl,
]);

  const getCompletedLessons = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(
          PROGRESS_KEY
        ) || "[]"
      );

      return Array.isArray(saved)
        ? saved
        : [];
    } catch {
      return [];
    }
  };

  

  const markLessonComplete = (
    moduleId
  ) => {
    if (!moduleId) return;

    const completed =
      getCompletedLessons();

    if (completed.includes(moduleId)) {
      return;
    }

    const updated = [
      ...completed,
      moduleId,
    ];

    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify(updated)
    );

    setCompletedLessons(updated);

    window.dispatchEvent(
      new Event(
        "edusphere-progress-updated"
      )
    );

    console.log(
      "✅ LESSON COMPLETED:",
      moduleId
    );
  };


  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    try {
      const parsed = new URL(url);

      // youtu.be/VIDEO_ID
      if (
        parsed.hostname.includes(
          "youtu.be"
        )
      ) {
        return parsed.pathname
          .slice(1)
          .split("?")[0];
      }

      // youtube.com/watch?v=VIDEO_ID
      if (
        parsed.hostname.includes(
          "youtube.com"
        )
      ) {
        const videoId =
          parsed.searchParams.get("v");

        if (videoId) {
          return videoId;
        }

       
        if (
          parsed.pathname.startsWith(
            "/embed/"
          )
        ) {
          return parsed.pathname
            .split("/embed/")[1]
            ?.split("?")[0];
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";

    const videoId =
      getYouTubeVideoId(url);

    if (!videoId) {
      return url;
    }

    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "";

    return (
      `https://www.youtube.com/embed/${videoId}` +
      `?enablejsapi=1` +
      `&rel=0` +
      `&origin=${encodeURIComponent(origin)}`
    );
  };

  // =====================================================
  // COURSE NOT FOUND
  // =====================================================

  if (!course) {
    return (
      <div className="course-not-found">
        <div className="course-not-found-card">
          <BookOpen size={42} />

          <h2>
            Course not found
          </h2>

          <p>
            The course you are looking for
            is not available.
          </p>

          <button
            onClick={() =>
              navigate("/courses")
            }
          >
            <ArrowLeft size={18} />
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // CURRENT LESSON
  // =====================================================

  const currentIndex =
    course.modules.findIndex(
      (module) =>
        module.id ===
        selectedModule?.id
    );

  const currentLessonNumber =
    currentIndex + 1;

  const totalLessons =
    course.modules.length;

  const progress =
    totalLessons > 0
      ? (currentLessonNumber /
          totalLessons) *
        100
      : 0;

  // =====================================================
  // YOUTUBE IFRAME API
  //
  // This uses the EXISTING iframe.
  // It does not replace your video with a div.
  // =====================================================

  useEffect(() => {
    if (!selectedModule?.videoUrl) {
      return;
    }

    const videoId =
      getYouTubeVideoId(
        selectedModule.videoUrl
      );

    if (!videoId) {
      return;
    }

    let cancelled = false;

    const createPlayer = () => {
      if (
        cancelled ||
        !iframeRef.current ||
        !window.YT ||
        !window.YT.Player
      ) {
        return;
      }

      // Destroy previous player
      if (
        youtubePlayerRef.current
      ) {
        try {
          youtubePlayerRef.current.destroy();
        } catch {
          // Ignore cleanup errors
        }

        youtubePlayerRef.current =
          null;
      }

      try {
        youtubePlayerRef.current =
          new window.YT.Player(
            iframeRef.current,
            {
              events: {
                onReady: () => {
                  console.log(
                    "🎥 YouTube player ready"
                  );
                },

                onStateChange: (event) => {
                  if (
                    event.data ===
                    window.YT.PlayerState
                      .ENDED
                  ) {
                    console.log(
                      "🎉 VIDEO FINISHED:",
                      selectedModule.id
                    );

                    markLessonComplete(
                      selectedModule.id
                    );
                  }
                },
              },
            }
          );
      } catch (error) {
        console.error(
          "YouTube player error:",
          error
        );
      }
    };

    // =================================================
    // API ALREADY LOADED
    // =================================================

    if (
      window.YT &&
      window.YT.Player
    ) {
      // Give React time to finish rendering iframe
      setTimeout(() => {
        createPlayer();
      }, 100);

      return () => {
        cancelled = true;

        if (
          youtubePlayerRef.current
        ) {
          try {
            youtubePlayerRef.current.destroy();
          } catch {
            // Ignore
          }

          youtubePlayerRef.current =
            null;
        }
      };
    }

    // =================================================
    // LOAD YOUTUBE API
    // =================================================

    const existingScript =
      document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );

    if (!existingScript) {
      const script =
        document.createElement(
          "script"
        );

      script.src =
        "https://www.youtube.com/iframe_api";

      script.async = true;

      document.body.appendChild(
        script
      );
    }

    // =================================================
    // WAIT FOR YOUTUBE API
    // =================================================

    const previousCallback =
      window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady =
      () => {
        if (
          typeof previousCallback ===
          "function"
        ) {
          previousCallback();
        }

        if (!cancelled) {
          createPlayer();
        }
      };

    // If API script was already loading,
    // check periodically until ready.
    const interval =
      setInterval(() => {
        if (
          window.YT &&
          window.YT.Player
        ) {
          clearInterval(interval);

          if (!cancelled) {
            createPlayer();
          }
        }
      }, 200);

    return () => {
      cancelled = true;

      clearInterval(interval);

      if (
        youtubePlayerRef.current
      ) {
        try {
          youtubePlayerRef.current.destroy();
        } catch {
          // Ignore
        }

        youtubePlayerRef.current =
          null;
      }
    };
  }, [
    selectedModule?.id,
    selectedModule?.videoUrl,
  ]);

  // =====================================================
  // NEXT LESSON
  // =====================================================

  const nextModule = () => {
    // Manual completion also works
    markLessonComplete(
      selectedModule?.id
    );

    if (
      currentIndex <
      course.modules.length - 1
    ) {
      setSelectedModule(
        course.modules[
          currentIndex + 1
        ]
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // =====================================================
  // PREVIOUS LESSON
  // =====================================================

  const previousModule = () => {
    if (currentIndex > 0) {
      setSelectedModule(
        course.modules[
          currentIndex - 1
        ]
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // =====================================================
  // SELECT LESSON
  // =====================================================

  const selectModule = (
    module
  ) => {
    setSelectedModule(module);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="course-player-page">

      {/* ================= HEADER ================= */}

      <header className="course-player-header">

        <button
          className="back-course-button"
          onClick={() =>
            navigate("/courses")
          }
        >
          <ArrowLeft size={19} />

          <span>
            Back to Courses
          </span>
        </button>

        <div className="course-player-title">

          <span className="course-player-label">
            COURSE
          </span>

          <h1>
            {course.title}
          </h1>

        </div>

        <div className="course-header-icon">
          {course.icon || "📖"}
        </div>

      </header>

      {/* ================= MAIN ================= */}

      <div className="course-player-layout">

        {/* ================= SIDEBAR ================= */}

        <aside className="course-module-sidebar">

          <div className="sidebar-course-info">

            <div className="sidebar-course-icon">
              {course.icon || "📖"}
            </div>

            <div>

              <span>
                {course.category}
              </span>

              <h2>
                {course.title}
              </h2>

            </div>

          </div>

          <div className="sidebar-heading">

            <div>

              <BookOpen size={18} />

              <span>
                Course Content
              </span>

            </div>

            <span className="lesson-count">
              {totalLessons} Lessons
            </span>

          </div>

          <div className="module-list">

            {course.modules.map(
              (module, index) => {

                const isActive =
                  selectedModule?.id ===
                  module.id;

                const isPrevious =
                  completedLessons.includes(
                    module.id
                  );

                return (
                  <button
                    key={module.id}
                    type="button"
                    className={`module-item ${
                      isActive
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      selectModule(
                        module
                      )
                    }
                  >

                    <div
                      className={`module-number ${
                        isActive
                          ? "active-number"
                          : ""
                      }`}
                    >

                      {isPrevious ? (
                        <CheckCircle2
                          size={17}
                        />
                      ) : (
                        index + 1
                      )}

                    </div>

                    <div className="module-details">

                      <span className="module-small-text">
                        Lesson {index + 1}
                      </span>

                      <strong>
                        {module.title}
                      </strong>

                    </div>

                    {isActive && (
                      <PlayCircle
                        className="module-play-icon"
                        size={19}
                      />
                    )}

                  </button>
                );
              }
            )}

          </div>

        </aside>

        {/* ================= CONTENT ================= */}

        <main className="course-player-content">

          <div className="lesson-top">

            <div>

              <span className="lesson-badge">
                LESSON{" "}
                {currentLessonNumber}
              </span>

              <h2>
                {selectedModule?.title}
              </h2>

              <p>
                Continue learning{" "}
                {course.title}
              </p>

            </div>

            <div className="lesson-counter">
              {currentLessonNumber} /{" "}
              {totalLessons}
            </div>

          </div>

          {/* ================= PROGRESS ================= */}

          <div className="lesson-progress-wrapper">

            <div className="lesson-progress-track">

              <div
                className="lesson-progress-bar"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <span>
              Lesson{" "}
              {currentLessonNumber}{" "}
              of{" "}
              {totalLessons}
            </span>

          </div>

          {/* ================= VIDEO ================= */}

          <div className="video-card">

            {selectedModule?.videoUrl ? (

              <div className="video-container">

                {/* IMPORTANT:
                    KEEP THIS AS AN IFRAME.
                    Do NOT replace it with a div.
                */}

                <iframe
                  ref={iframeRef}
                  key={selectedModule.id}
                  src={getEmbedUrl(
                    selectedModule.videoUrl
                  )}
                  title={
                    selectedModule.title
                  }
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />

              </div>

            ) : (

              <div className="video-placeholder">

                <div className="video-placeholder-icon">

                  <PlayCircle
                    size={54}
                  />

                </div>

                <h3>
                  Video coming soon
                </h3>

                <p>
                  This lesson does not
                  have a video available
                  yet.
                </p>

              </div>

            )}

          </div>

          {/* ================= LESSON INFO ================= */}

          <section className="lesson-info">

            <div className="lesson-info-heading">

              <div>

                <span className="lesson-info-label">
                  CURRENT LESSON
                </span>

                <h2>
                  {selectedModule?.title}
                </h2>

              </div>

              <div className="lesson-status">

                <PlayCircle
                  size={17}
                />

                Video Lesson

              </div>

            </div>

            {selectedModule?.content ? (

              <div className="lesson-content">

                <h3>
                  {
                    selectedModule
                      .content
                      .heading
                  }
                </h3>

                {selectedModule.content.sections?.map(
                  (section) => (

                    <div
                      key={
                        section.title
                      }
                      className="content-section"
                    >

                      <h4>
                        {section.title}
                      </h4>

                      {section.text && (
                        <p>
                          {section.text}
                        </p>
                      )}

                      {section.points && (
                        <ul>

                          {section.points.map(
                            (point) => (

                              <li
                                key={point}
                              >
                                {point}
                              </li>

                            )
                          )}

                        </ul>
                      )}

                    </div>

                  )
                )}

              </div>

            ) : (

              <p className="lesson-description">
                Watch the lesson video
                above and continue to
                the next lesson when
                you're ready.
              </p>

            )}

          </section>

          {/* ================= NAVIGATION ================= */}

          <div className="lesson-navigation">

            <button
              className="lesson-nav-button previous"
              onClick={
                previousModule
              }
              disabled={
                currentIndex === 0
              }
            >

              <ChevronLeft
                size={20}
              />

              <div>

                <span>
                  PREVIOUS
                </span>

                <strong>
                  {currentIndex > 0
                    ? course.modules[
                        currentIndex -
                          1
                      ].title
                    : "Previous Lesson"}
                </strong>

              </div>

            </button>

            <button
              className="lesson-nav-button next"
              onClick={
                nextModule
              }
              disabled={
                currentIndex ===
                course.modules.length -
                  1
              }
            >

              <div>

                <span>
                  {currentIndex ===
                  course.modules.length -
                    1
                    ? "COURSE COMPLETE"
                    : "NEXT LESSON"}
                </span>

                <strong>
                  {currentIndex <
                  course.modules.length -
                    1
                    ? course.modules[
                        currentIndex +
                          1
                      ].title
                    : "You're at the final lesson"}
                </strong>

              </div>

              <ChevronRight
                size={20}
              />

            </button>

          </div>

        </main>

      </div>

    </div>
  );
}