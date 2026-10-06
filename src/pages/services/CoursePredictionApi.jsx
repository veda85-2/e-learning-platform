import API from "../api/api";
import { getMLRecommendations } from "../api/ml";
export function getCourseTitle(course) {
  if (!course) return "";

  return String(
    course?.title ||
      course?.course?.title ||
      course?.name ||
      course?.course?.name ||
      course?.courseName ||
      course?.course_name ||
      course?.courseTitle ||
      ""
  ).trim();
}

export function normalizeCourseName(name) {
  if (!name) return "";

  return String(name)
    .trim()
    .toLowerCase()
    .replace(/\.js\b/g, "js")
    .replace(/\s*&\s*/g, " & ")
    .replace(/\s+/g, " ");
}

export function canonicalCourseName(name) {
  const normalized = normalizeCourseName(name);

  const aliases = {
    "html css": "html & css",
    "html & css": "html & css",
    html: "html & css",

    javascript: "jss",
    js: "jss",
    jss: "jss",

    react: "react js",
    "react js": "react js",
    reactjs: "react js",
    "react development": "react js",
    "react.js": "react js",

    "node js": "node.js & express",
    nodejs: "node.js & express",
    "node.js": "node.js & express",
    "node & express": "node.js & express",
    "node.js & express": "node.js & express",

    sql: "sql & database",
    "sql database": "sql & database",
    "sql & database": "sql & database",

    python: "python programming",
    "python programming": "python programming",

    ml: "ml",
    "machine learning": "ml",
  };

  return aliases[normalized] || normalized;
}

export function getAnalytics(data = {}) {
  const source =
    data?.analytics ||
    data?.stats ||
    data?.dashboard ||
    data?.data ||
    data ||
    {};

  return {
    mean_score: Number(
      source?.mean_score ??
        source?.meanScore ??
        source?.averageQuizScore ??
        source?.average_quiz_score ??
        0
    ),

    assessment_count: Number(
      source?.assessment_count ??
        source?.assessmentCount ??
        source?.assessments ??
        0
    ),

    course_score: Number(
      source?.course_score ??
        source?.courseScore ??
        source?.averageQuizScore ??
        source?.average_quiz_score ??
        0
    ),

    total_clicks: Number(
      source?.total_clicks ??
        source?.totalClicks ??
        source?.clicks ??
        0
    ),

    active_days: Number(
      source?.active_days ??
        source?.activeDays ??
        0
    ),

    learning_resources: Number(
      source?.learning_resources ??
        source?.learningResources ??
        source?.resources ??
        0
    ),
  };
}



export function getCompletionRate(data = {}) {
  const values = [
    data?.overallCompletionRate,
    data?.overall_completion_rate,
    data?.completionRate,
    data?.completion_rate,
    data?.overallProgress,
    data?.overall_progress,
    data?.progressPercentage,
    data?.progress_percentage,
    data?.completion,
    data?.progress,

    data?.analytics?.overallCompletionRate,
    data?.analytics?.overall_completion_rate,
    data?.analytics?.completionRate,
    data?.analytics?.completion_rate,

    data?.stats?.overallCompletionRate,
    data?.stats?.completionRate,
  ];

  for (const value of values) {
    const number = Number(value);

    if (
      Number.isFinite(number) &&
      number >= 0
    ) {
      return Math.min(100, number);
    }
  }

  return 0;
}


export async function fetchDashboardAnalytics() {
  try {
    const response =
      await API.get("/dashboard");

    const data =
      response?.data?.data ||
      response?.data ||
      {};

    console.log(
      "📊 DASHBOARD ANALYTICS:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "❌ DASHBOARD ANALYTICS ERROR:",
      error.response?.data ||
        error.message
    );

    return {};
  }
}


export function buildMLPayload({
  currentCourse,
  analytics = {},
}) {
  const safe = getAnalytics(analytics);

  return {
    current_course: currentCourse,

    mean_score:
      safe.mean_score,

    assessment_count:
      safe.assessment_count,

    course_score:
      safe.course_score,

    total_clicks:
      safe.total_clicks,

    active_days:
      safe.active_days,

    learning_resources:
      safe.learning_resources,
  };
}

const COURSE_SEQUENCE = [
  "HTML & CSS",
  "JSS",
  "React JS",
  "Node.js & Express",
  "SQL & Database",
  "Python Programming",
  "ML",
];




export const getCourseRecommendations = async ({
  currentCourse,
}) => {
  if (!currentCourse) {
    throw new Error("Current course is required");
  }

  const data = await getMLRecommendations(currentCourse);

  console.log("🤖 RAW ML RESPONSE:", data);

 let results = [];

// Direct array
if (Array.isArray(data)) {
  results = data;
}

// { recommendations: [...] }
else if (Array.isArray(data?.recommendations)) {
  results = data.recommendations;
}

// { predictions: [...] }
else if (Array.isArray(data?.predictions)) {
  results = data.predictions;
}

// { data: [...] }
else if (Array.isArray(data?.data)) {
  results = data.data;
}

// { data: { recommendations: [...] } }
else if (Array.isArray(data?.data?.recommendations)) {
  results = data.data.recommendations;
}

// { data: { predictions: [...] } }
else if (Array.isArray(data?.data?.predictions)) {
  results = data.data.predictions;
}

// { data: { data: [...] } }
else if (Array.isArray(data?.data?.data)) {
  results = data.data.data;
}

console.log(
  "🤖 PARSED ML RESULTS:",
  results
);
  console.log(
    "🤖 PARSED ML RESULTS:",
    results
  );

  // Normalize ML results
  const normalizedResults = results
    .map((item) => {
      let probability = Number(
        item?.probability ??
        item?.score ??
        item?.confidence ??
        0
      );

      // If backend returns 85 instead of 0.85
      if (probability > 1) {
        probability /= 100;
      }

      return {
        course:
          item?.course ||
          item?.course_name ||
          item?.courseName ||
          item?.course_title ||
          item?.name ||
          "",

        probability: Math.max(
          0,
          Math.min(1, probability)
        ),

        source:
          item?.source || "ml",
      };
    })
    .filter(
      (item) => item.course
    );

  console.log(
    "🤖 NORMALIZED ML RESULTS:",
    normalizedResults
  );

  return normalizedResults;
};


export function getFallbackRecommendations({
  currentCourse,
  enrolledCourses = [],
}) {
  const current =
    canonicalCourseName(
      currentCourse
    );

  const enrolled =
    new Set(
      enrolledCourses
        .map(getCourseTitle)
        .filter(Boolean)
        .map(canonicalCourseName)
    );

  const currentIndex =
    COURSE_SEQUENCE.findIndex(
      (course) =>
        canonicalCourseName(
          course
        ) === current
    );

  let courses;

  if (currentIndex >= 0) {
    courses =
      COURSE_SEQUENCE.slice(
        currentIndex + 1
      );
  } else {
    courses =
      COURSE_SEQUENCE;
  }

  return courses
    .filter(
      (course) =>
        !enrolled.has(
          canonicalCourseName(
            course
          )
        ) &&
        canonicalCourseName(
          course
        ) !== current
    )
    .slice(0, 3)
    .map(
      (course, index) => ({
        course,

        probability:
          0.90 -
          index * 0.08,

        source: "fallback",
      })
    );
}

/*
=========================================================
FILTER RECOMMENDATIONS
=========================================================
*/

export function filterRecommendations({
  recommendations = [],
  availableCourses = [],
  enrolledCourses = [],
  currentCourse = "",
}) {
  const availableMap =
    new Map();

  availableCourses.forEach(
    (course) => {
      const title =
        getCourseTitle(course);

      if (!title) return;

      availableMap.set(
        canonicalCourseName(
          title
        ),
        title
      );
    }
  );

  const enrolledSet =
    new Set(
      enrolledCourses
        .map(getCourseTitle)
        .filter(Boolean)
        .map(
          canonicalCourseName
        )
    );

  const currentCanonical =
    canonicalCourseName(
      currentCourse
    );

  const seen =
    new Set();

  return recommendations
    .map((item) => {
      const canonical =
        canonicalCourseName(
          item?.course
        );

      const actualTitle =
        availableMap.get(
          canonical
        );

      /*
      Course doesn't exist
      in LMS.
      */

      if (!actualTitle) {
        return null;
      }

      /*
      Don't recommend
      current course.
      */

      if (
        canonical ===
        currentCanonical
      ) {
        return null;
      }

      /*
      Don't recommend
      already enrolled.
      */

      if (
        enrolledSet.has(
          canonical
        )
      ) {
        return null;
      }

      /*
      Remove duplicates.
      */

      if (
        seen.has(canonical)
      ) {
        return null;
      }

      seen.add(canonical);

      return {
        course:
          actualTitle,

        probability:
          Number(
            item?.probability || 0
          ),

        source:
          item?.source ||
          "ml",
      };
    })

    .filter(Boolean)

    .sort(
      (a, b) =>
        b.probability -
        a.probability
    );
}

/*
=========================================================
TEST BACKEND ML CONNECTION
=========================================================
*/

export async function testMLConnection() {
  try {
    const token =
      localStorage.getItem("token");

    if (!token) {
      return {
        status: 0,
        ok: false,
        response:
          "No login token found.",
      };
    }

    const response =
      await fetch(
        "https://lms-backend-g4.onrender.com/recommend",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            current_course:
              "HTML & CSS",
          }),
        }
      );

    const text =
      await response.text();

    console.log(
      "🧪 BACKEND ML TEST STATUS:",
      response.status
    );

    console.log(
      "🧪 BACKEND ML TEST RESPONSE:",
      text
    );

    return {
      status:
        response.status,

      ok:
        response.ok,

      response:
        text,
    };

  } catch (error) {
    console.error(
      "🧪 BACKEND ML TEST FAILED:",
      error
    );

    return {
      status: 0,

      ok: false,

      response:
        error.message,
    };
  }
}