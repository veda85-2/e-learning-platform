import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Trophy,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "./pages/quizzes.css";
import API from "./pages/api/api";

export default function Quiz() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD QUIZ
  // =========================================================

  useEffect(() => {
    loadQuiz();
  }, [courseId]);

  async function loadQuiz() {
    try {
      setLoading(true);
      setError("");

      console.log(
        "🧠 Loading quiz for course:",
        courseId
      );

      const response = await API.get(
        `/quizzes/${courseId}`
      );

      console.log(
        "✅ QUIZ API RESPONSE:",
        response.data
      );

      const data =
        response.data?.data ||
        response.data;

      /*
       * Support common backend structures:
       *
       * {
       *   quiz: {...},
       *   questions: [...]
       * }
       *
       * OR
       *
       * [...]
       */

      if (Array.isArray(data)) {
        setQuestions(data);
        setQuiz(null);
      } else {
        setQuiz(data?.quiz || data);
        setQuestions(
          data?.questions ||
            data?.quiz?.questions ||
            []
        );
      }
    } catch (err) {
      console.error(
        "❌ QUIZ LOAD ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load this quiz."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // SELECT ANSWER
  // =========================================================

  function selectAnswer(questionId, answer) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  }

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  function nextQuestion() {
    if (
      currentIndex <
      questions.length - 1
    ) {
      setCurrentIndex(
        currentIndex + 1
      );
    }
  }

  // =========================================================
  // PREVIOUS QUESTION
  // =========================================================

  function previousQuestion() {
    if (currentIndex > 0) {
      setCurrentIndex(
        currentIndex - 1
      );
    }
  }

  // =========================================================
  // SUBMIT QUIZ
  // =========================================================

  async function submitQuiz() {
    try {
      setSubmitting(true);
      setError("");

      console.log(
        "📤 SUBMITTING QUIZ:",
        answers
      );

      /*
       * Most backends expect something similar to:
       *
       * {
       *   answers: {
       *      questionId: selectedAnswer
       *   }
       * }
       *
       * We send the answers object directly.
       */

      const response = await API.post(
        `/quizzes/${
          quiz?._id ||
          quiz?.id ||
          courseId
        }/submit`,
        {
          answers,
        }
      );

      console.log(
        "✅ QUIZ RESULT:",
        response.data
      );

      setResult(
        response.data?.data ||
          response.data
      );
    } catch (err) {
      console.error(
        "❌ QUIZ SUBMIT ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to submit quiz."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="quiz-loading">
          <Loader2
            size={36}
            className="spin"
          />

          <h2>
            Loading Quiz...
          </h2>

          <p>
            Preparing your questions.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error && !questions.length) {
    return (
      <div className="quiz-page">

        <header className="quiz-header">

          <button
            onClick={() =>
              navigate("/courses")
            }
          >
            <ArrowLeft size={18} />
            Courses
          </button>

          <strong>
            EDU<span>sphere</span>
          </strong>

        </header>

        <div className="quiz-error">

          <XCircle size={50} />

          <h2>
            Unable to load quiz
          </h2>

          <p>{error}</p>

          <button
            onClick={loadQuiz}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // RESULT
  // =========================================================

  if (result) {
    const score =
      result.score ??
      result.percentage ??
      result.data?.score ??
      0;

    const total =
      result.total ??
      questions.length;

    return (
      <div className="quiz-page">

        <header className="quiz-header">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

          <strong>
            EDU<span>sphere</span>
          </strong>

        </header>

        <main className="quiz-result">

          <div className="result-icon">
            <Trophy size={48} />
          </div>

          <p className="quiz-eyebrow">
            QUIZ COMPLETED
          </p>

          <h1>
            Great work!
          </h1>

          <p>
            You have successfully
            completed the quiz.
          </p>

          <div className="score-card">

            <span>
              Your Score
            </span>

            <strong>
              {score}
              {String(score).includes("%")
                ? ""
                : "%"}
            </strong>

            <small>
              {total} questions
            </small>

          </div>

          <div className="result-actions">

            <button
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Back to Dashboard
            </button>

            <button
              className="secondary"
              onClick={() => {
                setResult(null);
                setCurrentIndex(0);
                setAnswers({});
              }}
            >
              Retake Quiz
            </button>

          </div>

        </main>

      </div>
    );
  }

  // =========================================================
  // NO QUESTIONS
  // =========================================================

  if (!questions.length) {
    return (
      <div className="quiz-page">

        <header className="quiz-header">

          <button
            onClick={() =>
              navigate("/courses")
            }
          >
            <ArrowLeft size={18} />
            Courses
          </button>

          <strong>
            EDU<span>sphere</span>
          </strong>

        </header>

        <div className="quiz-empty">

          <CheckCircle2 size={50} />

          <h2>
            No quiz available
          </h2>

          <p>
            There are currently no
            questions available for
            this course.
          </p>

          <button
            onClick={() =>
              navigate("/courses")
            }
          >
            Browse Courses
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  const question =
    questions[currentIndex];

  const questionId =
    question?._id ||
    question?.id ||
    currentIndex;

  const selectedAnswer =
    answers[questionId];

  const options =
    question?.options ||
    question?.answers ||
    [];

  const progress =
    ((currentIndex + 1) /
      questions.length) *
    100;

  const isLastQuestion =
    currentIndex ===
    questions.length - 1;

  // =========================================================
  // QUIZ UI
  // =========================================================

  return (
    <div className="quiz-page">

      <header className="quiz-header">

        <button
          onClick={() =>
            navigate("/courses")
          }
        >
          <ArrowLeft size={18} />
          Courses
        </button>

        <div className="quiz-brand">
          <span className="brand-logo">
            ES
          </span>

          EDU<span>sphere</span>
        </div>

        <div className="quiz-meta">
          <Clock3 size={17} />
          Question{" "}
          {currentIndex + 1}{" "}
          of {questions.length}
        </div>

      </header>

      <main className="quiz-container">

        <div className="quiz-top">

          <div>

            <p className="quiz-eyebrow">
              KNOWLEDGE CHECK
            </p>

            <h1>
              {quiz?.title ||
                "Course Quiz"}
            </h1>

          </div>

          <span>
            {Math.round(progress)}%
          </span>

        </div>

        <div className="quiz-progress">

          <div
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <section className="question-card">

          <div className="question-number">
            Question{" "}
            {currentIndex + 1}
          </div>

          <h2>
            {question?.question ||
              question?.text ||
              question?.questionText ||
              "Question"}
          </h2>

          <div className="options">

            {options.map(
              (option, index) => {

                const value =
                  typeof option ===
                  "string"
                    ? option
                    : option?.value ??
                      option?.text ??
                      option?.label;

                const optionKey =
                  typeof option ===
                  "string"
                    ? option
                    : option?._id ||
                      option?.id ||
                      index;

                const selected =
                  selectedAnswer ===
                  value;

                return (
                  <button
                    type="button"
                    key={optionKey}
                    className={`quiz-option ${
                      selected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      selectAnswer(
                        questionId,
                        value
                      )
                    }
                  >

                    <span className="option-letter">
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span>
                      {value}
                    </span>

                    {selected && (
                      <CheckCircle2
                        size={20}
                      />
                    )}

                  </button>
                );
              }
            )}

          </div>

          {error && (
            <div className="quiz-inline-error">
              {error}
            </div>
          )}

        </section>

        <div className="quiz-navigation">

          <button
            className="secondary"
            disabled={
              currentIndex === 0
            }
            onClick={
              previousQuestion
            }
          >
            Previous
          </button>

          {!isLastQuestion ? (

            <button
              disabled={!selectedAnswer}
              onClick={
                nextQuestion
              }
            >
              Next Question
            </button>

          ) : (

            <button
              disabled={
                !selectedAnswer ||
                submitting
              }
              onClick={
                submitQuiz
              }
            >
              {submitting
                ? "Submitting..."
                : "Submit Quiz"}
            </button>

          )}

        </div>

      </main>

    </div>
  );
}