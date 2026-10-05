import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/study_material.css";

import {
  Search,
  BookOpen,
  FileText,
  Code2,
  Globe,
  Palette,
  Braces,
  Layers,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Menu,
  X,
  Grid2X2,
  Bookmark,
  FolderKanban,
  MessageCircle,
  Settings,
  LogOut,
  Bell,
  UserCircle,
  Sparkles,
} from "lucide-react";



const resources = [
  {
    title: "HTML",
    description:
      "Learn how to structure web pages using semantic HTML.",
    category: "Web Development",
    icon: Globe,
    color: "blue",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    source: "MDN",
  },
  {
    title: "CSS",
    description:
      "Learn styling, layouts, responsive design and animations.",
    category: "Web Development",
    icon: Palette,
    color: "purple",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    source: "MDN",
  },
  {
    title: "JavaScript",
    description:
      "Learn JavaScript fundamentals and build interactive applications.",
    category: "Programming",
    icon: Braces,
    color: "yellow",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    source: "MDN",
  },
  {
    title: "Web APIs",
    description:
      "Explore browser APIs and features available to web applications.",
    category: "Web APIs",
    icon: Code2,
    color: "green",
    url: "https://developer.mozilla.org/en-US/docs/Web/API",
    source: "MDN",
  },
  {
    title: "React",
    description:
      "Official React documentation for building user interfaces.",
    category: "Frontend",
    icon: Layers,
    color: "cyan",
    url: "https://react.dev/",
    source: "React",
  },
  {
    title: "MDN Learn Web Development",
    description:
      "Structured learning modules covering modern web development.",
    category: "Learning",
    icon: BookOpen,
    color: "teal",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
    source: "MDN",
  },
];

const learningPaths = [
  {
    title: "HTML & CSS Fundamentals",
    description:
      "Build your foundation with HTML structure and CSS styling.",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
  },
  {
    title: "JavaScript Fundamentals",
    description:
      "Understand JavaScript, DOM manipulation and browser scripting.",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting",
  },
  {
    title: "Web Development Core",
    description:
      "Follow MDN's structured core modules for web development.",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core",
  },
];

function Notes() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredResources = resources.filter((resource) => {
    const query = search.toLowerCase();

    return (
      resource.title.toLowerCase().includes(query) ||
      resource.description
        .toLowerCase()
        .includes(query) ||
      resource.category
        .toLowerCase()
        .includes(query)
    );
  });

  function openResource(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <div className="notes-app">

      {sidebarOpen && (
        <div
          className="notes-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`notes-sidebar ${
          sidebarOpen ? "notes-sidebar-open" : ""
        }`}
      >
        <button
          className="notes-sidebar-close"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>

        <div className="notes-brand">
          <div className="notes-brand-logo">
            ES
          </div>

          <span>
            EDU<span>sphere</span>
          </span>
        </div>

        <nav className="notes-navigation">

          <button
            className="notes-nav-item"
            onClick={() => navigate("/dashboard")}
          >
            <Grid2X2 size={19} />
            <span>Dashboard</span>
          </button>

          <button
            className="notes-nav-item"
            onClick={() => navigate("/my-courses")}
          >
            <BookOpen size={19} />
            <span>My Courses</span>
          </button>

          <button
            className="notes-nav-item active"
          >
            <Bookmark size={19} />
            <span>Course Recommendations</span>
          </button>

          <button
            className="notes-nav-item"
            onClick={() =>
              navigate("/course-recommendations")
            }
          >
            <MessageCircle size={19} />
            <span>Study Materials</span>
          </button>

          <button
            className="notes-nav-item"
            onClick={() => navigate("/projects")}
          >
            <FolderKanban size={19} />
            <span>Profile</span>
          </button>

        </nav>

        <div className="notes-sidebar-bottom">

          <button
            className="notes-nav-item"
            onClick={() => navigate("/settings")}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button
            className="notes-nav-item"
            onClick={logout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>

          <button
            className="notes-upgrade"
            onClick={() => navigate("/premium")}
          >
            💎 Upgrade Premium
          </button>

        </div>
      </aside>

      {/* MAIN */}

      <main className="notes-main">

        {/* HEADER */}

        <header className="notes-header">

          <button
            className="notes-mobile-menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="notes-header-search">
            <Search size={19} />

            <input
              placeholder="Search anything"
            />
          </div>

          <div className="notes-header-actions">

            <button className="notes-notification">
              <Bell size={20} />
              <span>1</span>
            </button>

            <button
              className="notes-profile"
              onClick={() => navigate("/profile")}
            >
              <UserCircle size={34} />
            </button>

          </div>

        </header>

        {/* CONTENT */}

        <section className="notes-content">

          {/* TITLE */}

          <div className="notes-title">

            <div>

              <div className="notes-title-row">

                <FileText
                  size={21}
                  className="notes-title-icon"
                />

                <h1>Notes & Resources</h1>

              </div>

              <p>
                Useful documentation and learning
                resources for your development journey.
              </p>

            </div>

          </div>

          {/* SEARCH */}

          <div className="notes-search">

            <Search size={19} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search notes, documentation or resources..."
            />

          </div>

          {/* FEATURED */}

          <section className="notes-featured">

            <div className="notes-featured-icon">
              <Sparkles size={23} />
            </div>

            <div className="notes-featured-content">

              <span>FEATURED RESOURCE</span>

              <h2>
                MDN Web Docs
              </h2>

              <p>
                Explore reliable documentation and
                structured learning material for modern
                web development.
              </p>

              <button
                onClick={() =>
                  openResource(
                    "https://developer.mozilla.org/en-US/"
                  )
                }
              >
                Explore MDN
                <ExternalLink size={15} />
              </button>

            </div>

          </section>

          {/* RESOURCES */}

          <div className="notes-section-heading">

            <div>
              <h2>
                Documentation
              </h2>

              <p>
                Keep these references close while learning.
              </p>
            </div>

            <span>
              {filteredResources.length} resources
            </span>

          </div>

          <div className="notes-resource-grid">

            {filteredResources.map((resource) => {

              const Icon = resource.icon;

              return (
                <article
                  className="notes-resource-card"
                  key={resource.title}
                >

                  <div className="notes-card-top">

                    <div
                      className={`notes-resource-icon ${resource.color}`}
                    >
                      <Icon size={22} />
                    </div>

                    <span className="notes-source">
                      {resource.source}
                    </span>

                  </div>

                  <div className="notes-card-body">

                    <h3>
                      {resource.title}
                    </h3>

                    <p>
                      {resource.description}
                    </p>

                    <span className="notes-category">
                      {resource.category}
                    </span>

                  </div>

                  <button
                    className="notes-open-button"
                    onClick={() =>
                      openResource(resource.url)
                    }
                  >
                    <span>
                      Open Documentation
                    </span>

                    <ExternalLink size={15} />
                  </button>

                </article>
              );
            })}

          </div>

          {/* LEARNING PATH */}

          <div className="notes-section-heading learning-heading">

            <div>
              <h2>
                Learning Paths
              </h2>

              <p>
                Structured resources to strengthen your fundamentals.
              </p>
            </div>

          </div>

          <div className="notes-learning-list">

            {learningPaths.map((item, index) => (

              <button
                className="notes-learning-card"
                key={item.title}
                onClick={() =>
                  openResource(item.url)
                }
              >

                <div className="notes-learning-number">
                  0{index + 1}
                </div>

                <div className="notes-learning-info">

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>

                </div>

                <ChevronRight size={19} />

              </button>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Notes;