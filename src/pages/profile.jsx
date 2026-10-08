import { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  Bookmark,
  CalendarDays,
  ChevronRight,
  Grid2X2,
  LogOut,
  Menu,
  MessageCircle,
  FolderKanban,
  Settings,
  UserRound,
  Lock,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Pencil,
  X,
  Save,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import API from "./api/api";
import "./profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    gender: "",
    college: "",
    profilePhoto: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PROFILE
  // =====================================================

 async function loadProfile() {
  try {
    setLoading(true);
    setError("");

    const response = await API.get("/users/me");

    console.log("✅ PROFILE API RESPONSE:", response.data);

    const data =
      response.data?.data ||
      response.data?.user ||
      response.data;

    if (!data) {
      throw new Error("Profile data not found.");
    }

    setProfile(data);

    setForm({
      fullName: data.name || data.fullName || "",
      email: data.email || "",
      gender: data.gender || "",
      college: data.college || "",
      profilePhoto: data.profilePhoto || "",
    });

    const localUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...localUser,
        ...data,
      })
    );
  } catch (err) {
    console.error(
      "❌ PROFILE ERROR:",
      err.response?.data || err.message
    );

    setError(
      err.response?.data?.message ||
        "Unable to load profile."
    );
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadProfile();
  }, []);

  
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  }

 function openEdit() {
  if (!profile) return;

  setForm({
    fullName: profile.name || profile.fullName || "",
    email: profile.email || "",
    gender: profile.gender || "",
    college: profile.college || "",
    profilePhoto: profile.profilePhoto || "",
  });

  setMessage("");
  setError("");
  setEditOpen(true);
}

  function closeEdit() {
    if (saving) return;

    setEditOpen(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }


async function saveProfile(e) {
  e.preventDefault();

  if (!form.fullName.trim()) {
    setError("Full name is required.");
    return;
  }

  try {
    setSaving(true);
    setError("");
    setMessage("");

    const response = await API.put("/users/me", {
      name: form.fullName.trim(),
      email: form.email.trim(),
    });

    console.log(
      "✅ PROFILE UPDATE RESPONSE:",
      response.data
    );

    const updated =
      response.data?.data ||
      response.data?.user ||
      response.data;

    if (!updated) {
      throw new Error("Updated profile data not found.");
    }

    setProfile(updated);

    setForm({
      fullName: updated.name || updated.fullName || "",
      email: updated.email || "",
      gender: updated.gender || "",
      college: updated.college || "",
      profilePhoto: updated.profilePhoto || "",
    });

    const localUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...localUser,
        ...updated,
      })
    );

    setEditOpen(false);
    setMessage("Profile updated successfully.");

    await loadProfile();
  } catch (err) {
    console.error(
      "❌ UPDATE PROFILE ERROR:",
      err.response?.data || err.message
    );

    setError(
      err.response?.data?.message ||
        "Unable to update profile."
    );
  } finally {
    setSaving(false);
  }
}

  
  const fullName =
    profile?.fullName ||
    profile?.name ||
    "Student";

  const email =
    profile?.email ||
    "-";

  const college =
    profile?.college ||
    "Computer Science";

  const gender =
    profile?.gender || "";

  const profilePhoto =
    profile?.profilePhoto || "";

  const role =
    profile?.role ||
    "STUDENT";

  const location =
    profile?.location ||
    "India";

  const firstName =
    fullName.split(" ")[0] || "";

  const lastName =
    fullName.split(" ").slice(1).join(" ") || "";

  const initials =
    fullName
      .split(" ")
      .map((item) => item[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  

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
      icon: Bookmark,
      label: "Course Recommendations",
      path: "/course-recommendations",
    },
    {
      icon: FolderKanban,
      label: "Study Material",
      path: "/study-material",
    },
    {
      icon: UserRound,
      label: "My Profile",
      path: "/profile",
      active: true,
    },
  ];


  return (
    <div className="profile-app">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="profile-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

  

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
                  setSidebarOpen(false);
                }}
              >
                <Icon size={17} />
                <span>{label}</span>
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


 

      <main className="profile-main">

        {/* HEADER */}

        <header className="profile-topbar">

          <button
            className="profile-mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={22} />
          </button>

          <div className="profile-top-spacer" />

          <div className="profile-top-actions">

            <button className="profile-notification">
              <Bell size={19} />

              <span>1</span>
            </button>

            <button className="profile-user-button">
              <UserRound size={20} />
            </button>

          </div>

        </header>


        {/* PAGE */}

        <section className="profile-content">

          <div className="profile-heading">

            <p>MY PROFILE</p>

            <h1>My Profile</h1>

            <span>
              Manage your personal profile
              and learning profile.
            </span>

          </div>


          {/* MESSAGES */}

          {message && (
            <div className="profile-success">
              {message}
            </div>
          )}

          {error && (
            <div className="profile-error">
              {error}

              <button
                onClick={loadProfile}
              >
                Retry
              </button>
            </div>
          )}


          {loading ? (

            <div className="profile-loading">
              Loading profile...
            </div>

          ) : (

            <>


              <section className="profile-hero">

                <div className="profile-cover" />

                <div className="profile-hero-content">

                  <div className="profile-avatar">

                    {profilePhoto ? (

                      <img
                        src={profilePhoto}
                        alt={fullName}
                      />

                    ) : (

                      <span>
                        {initials}
                      </span>

                    )}

                  </div>


                  <div className="profile-identity">

                    <h2>
                      {fullName}
                    </h2>

                    <p>
                      <GraduationCap
                        size={14}
                      />

                      {college}
                    </p>

                    <p>
                      <MapPin
                        size={14}
                      />

                      {location}
                    </p>

                    <p>
                      <Mail size={14} />

                      {email}
                    </p>

                  </div>


                  <button
                    className="edit-profile-button"
                    onClick={openEdit}
                  >
                    <Pencil size={14} />
                    Edit Profile
                  </button>

                </div>

              </section>

              <div className="profile-grid">

                {/* PERSONAL INFORMATION */}

                <section className="profile-card personal-card">

                  <div className="profile-card-heading">

                    <div className="profile-card-icon cyan">
                      <UserRound size={17} />
                    </div>

                    <div>
                      <h2>
                        Personal Information
                      </h2>

                      <p>
                        Your basic account
                        information
                      </p>
                    </div>

                  </div>


                  <div className="profile-fields">

                    <ProfileField
                      label="First Name"
                      value={firstName}
                    />

                    <ProfileField
                      label="Last Name"
                      value={lastName}
                    />

                    <ProfileField
                      label="Email Address"
                      value={email}
                      icon={<Mail size={13} />}
                    />

                    <ProfileField
                      label="Phone Number"
                      value={
                        profile?.mobile ||
                        profile?.phone ||
                        "Not provided"
                      }
                      icon={<Phone size={13} />}
                    />

                    <ProfileField
                      label="Location"
                      value={location}
                      icon={<MapPin size={13} />}
                    />

                    <ProfileField
                      label="Education"
                      value={college}
                      icon={
                        <GraduationCap
                          size={13}
                        />
                      }
                    />

                  </div>

                </section>


                {/* LEARNING OVERVIEW */}

                <section className="profile-card overview-card">

                  <div className="profile-card-heading">

                    <div className="profile-card-icon cyan">
                      <BookOpen size={17} />
                    </div>

                    <div>
                      <h2>
                        Learning Overview
                      </h2>

                      <p>
                        Your progress at a glance
                      </p>
                    </div>

                  </div>


                  <OverviewItem
                    icon={<BookOpen size={16} />}
                    title="My Courses"
                    subtitle="View all your courses"
                    color="cyan"
                    onClick={() =>
                      navigate("/courses")
                    }
                  />

                  <OverviewItem
                    icon={<StarIcon />}
                    title="My Achievements"
                    subtitle="Certificates and badges"
                    color="orange"
                  />

                  <OverviewItem
                    icon={<CalendarDays size={16} />}
                    title="Learning Time"
                    subtitle="Track your study hours"
                    color="blue"
                  />

                  <OverviewItem
                    icon={<FolderKanban size={16} />}
                    title="My Projects"
                    subtitle="View your projects"
                    color="pink"
                  />

                </section>


                {/* ABOUT ME */}

                <section className="profile-card about-card">

                  <div className="about-heading">

                    <h2>
                      About Me
                    </h2>

                    <button
                      onClick={openEdit}
                    >
                      <Pencil size={15} />
                    </button>

                  </div>


                  <p>
                    {profile?.about ||
                      "Computer Science student interested in programming, data structures and software development."}
                  </p>

                </section>


                {/* SECURITY */}

                <section className="profile-card security-card">

                  <div className="profile-card-heading">

                    <div className="profile-card-icon cyan">
                      <Lock size={17} />
                    </div>

                    <div>
                      <h2>
                        Security
                      </h2>

                      <p>
                        Manage your account security
                      </p>
                    </div>

                  </div>


                  <button
                    className="change-password"
                    onClick={() => {
                      alert(
                        "Password change page can be connected here."
                      );
                    }}
                  >
                    Change Password
                    <ChevronRight size={15} />
                  </button>

                </section>

              </div>

            </>

          )}

        </section>

      </main>



      {editOpen && (
        <div className="edit-modal-overlay">

          <div className="edit-modal">

            <div className="edit-modal-header">

              <div>
                <p>PROFILE</p>
                <h2>Edit Profile</h2>
              </div>

              <button
                onClick={closeEdit}
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>


            <form
              className="edit-form"
              onSubmit={saveProfile}
            >

              <label>
                Full Name

                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </label>


              <label>
                Email

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </label>


              <label>
                Gender

                <select
                  name="gender"
                  value={gender}
                  onChange={handleChange}
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="MALE">
                    Male
                  </option>

                  <option value="FEMALE">
                    Female
                  </option>

                  <option value="OTHER">
                    Other
                  </option>
                </select>
              </label>


              <label>
                Education / College

                <input
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  placeholder="Enter your college"
                />
              </label>


              <label>
                Profile Photo URL

                <input
                  name="profilePhoto"
                  value={form.profilePhoto}
                  onChange={handleChange}
                  placeholder="Paste image URL"
                />
              </label>


              <div className="edit-modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeEdit}
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save-button"
                  disabled={saving}
                >
                  <Save size={16} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}



function ProfileField({
  label,
  value,
  icon,
}) {
  return (
    <div className="profile-field">

      <label>
        {label}
      </label>

      <div className="profile-field-input">

        {icon}

        <span>
          {value || "Not provided"}
        </span>

      </div>

    </div>
  );
}


function OverviewItem({
  icon,
  title,
  subtitle,
  color,
  onClick,
}) {
  return (
    <button
      className="overview-item"
      onClick={onClick}
    >

      <div
        className={`overview-icon ${color}`}
      >
        {icon}
      </div>


      <div className="overview-text">

        <strong>
          {title}
        </strong>

        <span>
          {subtitle}
        </span>

      </div>


      <ChevronRight size={15} />

    </button>
  );
}


function StarIcon() {
  return (
    <span style={{ fontSize: "15px" }}>
      ★
    </span>
  );
}