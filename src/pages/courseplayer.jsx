import { useState } from "react";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { courses } from "./data/courses";

import "./courseplayer.css";

export default function CoursePlayer() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const course = courses.find((item) => item.id === courseId);

  const [selectedModule, setSelectedModule] = useState(
    course?.modules?.[0] || null
  );

  if (!course) {
    return (
      <div className="course-not-found">
        <div className="course-not-found-card">
          <BookOpen size={42} />

          <h2>Course not found</h2>

          <p>
            The course you are looking for is not available.
          </p>

          <button onClick={() => navigate("/courses")}>
            <ArrowLeft size={18} />
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const getEmbedUrl = (url) => {
    if (!url) return "";

    try {
      const parsed = new URL(url);

      if (parsed.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
      }

      if (parsed.hostname.includes("youtube.com")) {
        const videoId = parsed.searchParams.get("v");

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      return url;
    } catch {
      return "";
    }
  };

  const currentIndex = course.modules.findIndex(
    (module) => module.id === selectedModule?.id
  );

  const currentLessonNumber = currentIndex + 1;
  const totalLessons = course.modules.length;

  const progress =
    totalLessons > 0
      ? (currentLessonNumber / totalLessons) * 100
      : 0;

  const nextModule = () => {
    if (currentIndex < course.modules.length - 1) {
      setSelectedModule(course.modules[currentIndex + 1]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const previousModule = () => {
    if (currentIndex > 0) {
      setSelectedModule(course.modules[currentIndex - 1]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const selectModule = (module) => {
    setSelectedModule(module);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="course-player-page">

      {/* ================= HEADER ================= */}

      <header className="course-player-header">

        <button
          className="back-course-button"
          onClick={() => navigate("/courses")}
        >
          <ArrowLeft size={19} />
          <span>Back to Courses</span>
        </button>

        <div className="course-player-title">
          <span className="course-player-label">
            COURSE
          </span>

          <h1>{course.title}</h1>
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
              <span>{course.category}</span>
              <h2>{course.title}</h2>
            </div>

          </div>

          <div className="sidebar-heading">

            <div>
              <BookOpen size={18} />
              <span>Course Content</span>
            </div>

            <span className="lesson-count">
              {totalLessons} Lessons
            </span>

          </div>

          <div className="module-list">

            {course.modules.map((module, index) => {

              const isActive =
                selectedModule?.id === module.id;

              const isPrevious =
                index < currentIndex;

              return (
                <button
                  key={module.id}
                  type="button"
                  className={`module-item ${
                    isActive ? "active" : ""
                  }`}
                  onClick={() => selectModule(module)}
                >

                  <div
                    className={`module-number ${
                      isActive
                        ? "active-number"
                        : ""
                    }`}
                  >
                    {isPrevious ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div className="module-details">

                    <span className="module-small-text">
                      Lesson {index + 1}
                    </span>

                    <strong>{module.title}</strong>

                  </div>

                  {isActive && (
                    <PlayCircle
                      className="module-play-icon"
                      size={19}
                    />
                  )}

                </button>
              );
            })}

          </div>

        </aside>

        {/* ================= CONTENT ================= */}

        <main className="course-player-content">

          <div className="lesson-top">

            <div>

              <span className="lesson-badge">
                LESSON {currentLessonNumber}
              </span>

              <h2>{selectedModule?.title}</h2>

              <p>
                Continue learning {course.title}
              </p>

            </div>

            <div className="lesson-counter">
              {currentLessonNumber} / {totalLessons}
            </div>

          </div>

          {/* Progress */}

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
              Lesson {currentLessonNumber} of{" "}
              {totalLessons}
            </span>

          </div>

          {/* ================= VIDEO ================= */}

          <div className="video-card">

            {selectedModule?.videoUrl ? (

              <div className="video-container">

                <iframe
                  src={getEmbedUrl(
                    selectedModule.videoUrl
                  )}
                  title={selectedModule.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />

              </div>

            ) : (

              <div className="video-placeholder">

                <div className="video-placeholder-icon">
                  <PlayCircle size={54} />
                </div>

                <h3>Video coming soon</h3>

                <p>
                  This lesson does not have a video
                  available yet.
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
                <PlayCircle size={17} />
                Video Lesson
              </div>

            </div>

            {selectedModule?.content ? (

              <div className="lesson-content">

                <h3>
                  {selectedModule.content.heading}
                </h3>

                {selectedModule.content.sections?.map(
                  (section) => (

                    <div
                      key={section.title}
                      className="content-section"
                    >

                      <h4>{section.title}</h4>

                      {section.text && (
                        <p>{section.text}</p>
                      )}

                      {section.points && (
                        <ul>
                          {section.points.map(
                            (point) => (
                              <li key={point}>
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
                Watch the lesson video above and
                continue to the next lesson when
                you're ready.
              </p>

            )}

          </section>

          {/* ================= NAVIGATION ================= */}

          <div className="lesson-navigation">

            <button
              className="lesson-nav-button previous"
              onClick={previousModule}
              disabled={currentIndex === 0}
            >

              <ChevronLeft size={20} />

              <div>

                <span>PREVIOUS</span>

                <strong>
                  {currentIndex > 0
                    ? course.modules[
                        currentIndex - 1
                      ].title
                    : "Previous Lesson"}
                </strong>

              </div>

            </button>

            <button
              className="lesson-nav-button next"
              onClick={nextModule}
              disabled={
                currentIndex ===
                course.modules.length - 1
              }
            >

              <div>

                <span>
                  {currentIndex ===
                  course.modules.length - 1
                    ? "COURSE COMPLETE"
                    : "NEXT LESSON"}
                </span>

                <strong>
                  {currentIndex <
                  course.modules.length - 1
                    ? course.modules[
                        currentIndex + 1
                      ].title
                    : "You're at the final lesson"}
                </strong>

              </div>

              <ChevronRight size={20} />

            </button>

          </div>

        </main>

      </div>

    </div>
  );
}