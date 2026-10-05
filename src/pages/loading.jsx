
import background from "../assets/green.png";
import winner from "../assets/winner.png";
import { useNavigate } from "react-router-dom";

function Loading() {
  const navigate = useNavigate();

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-cover
        bg-center
        bg-no-repeat
      "
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      {/* ================= NAVBAR ================= */}
      <nav
        className="
          relative
          z-20
          flex
          items-center
          justify-between
          px-5
          py-5
          sm:px-8
          sm:py-6
          md:px-12
          lg:px-16
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-lg
              bg-[#111111]
              text-xs
              font-bold
              text-white
              sm:h-14
              sm:w-14
              sm:text-sm
            "
          >
            ES
          </div>

          <span className="text-lg text-[#111111] sm:text-xl">
            EDU<span className="font-medium">sphere</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div
          className="
            hidden
            items-center
            gap-8
            text-base
            md:flex
            lg:gap-12
            lg:text-lg
          "
        >
          <a
            href="#"
            className="transition-opacity hover:opacity-60"
          >
            About
          </a>

          <a
            href="#"
            className="transition-opacity hover:opacity-60"
          >
            Courses
          </a>

          <a
            href="#"
            className="transition-opacity hover:opacity-60"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[calc(100vh-200px)]
          max-w-350
          flex-col
          items-center
          px-5
          pt-4
          sm:px-8
          md:min-h-[calc(100vh-180px)]
          md:flex-row
          md:items-center
          md:px-12
          md:-mt-8
          lg:px-16
          lg:-mt-10
        "
      >
        {/* ================= LEFT CONTENT ================= */}
        <section
          className="
            w-full
            md:w-1/2
            lg:w-[52%]
          "
        >
          <p
            className="
              mb-4
              ml-2
              text-lg
              font-semibold
              text-black
              sm:mb-5
              sm:ml-4
              sm:text-xl
              md:ml-8
              md:text-2xl
            "
          >
            Welcome Back!
          </p>

          <h1
            className="
              text-4xl
              font-extrabold
              leading-[1.1]
              tracking-tight
              sm:text-5xl
              md:text-5xl
              lg:text-6xl
          "
          >
            <span className="text-white">
              Take Your
            </span>

            <br />

            <span className="text-white">
              Knowledge to the
            </span>

            <br />

            <span className="text-black">
              Next Level
            </span>
          </h1>

          <p
            className="
              mt-6
              max-w-lg
              text-sm
              leading-6
              text-white
              sm:text-base
              sm:leading-7
              md:mt-8
              md:text-lg
            "
          >
            Learn at your own pace, track your progress,
            <br className="hidden sm:block" />
            and build skills that move you forward.
          </p>

          {/* Get Started */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
               mt-6
    inline-block
    rounded-md
    bg-black!
    px-8
    py-3
    text-sm
    font-bold
    text-white
    shadow-lg
    transition-all
    duration-200
    hover:-translate-y-1
    hover:bg-[#111111]
    sm:mt-8
    sm:px-9
    sm:py-4
    sm:text-base
            "
          >
            Get Started

            <span className="ml-3 text-lg sm:text-xl">
              →
            </span>
          </button>
        </section>

        {/* ================= WINNER IMAGE ================= */}
        <section
          className="
            flex
            w-full
            items-center
            justify-center
            md:w-1/2
            md:-translate-x-8
            lg:-translate-x-12
            mr-7
            
          "
        >
          <img
            src={winner}
            alt="Learning achievement"
            className="
             max-w-250
              mb-30
              // w-80
             
              object-contain
              drop-shadow-xl
              sm:w-82.5
              md:mt-0
              md:w-100
              lg:w-100
            "
          />
        </section>
      </main>

      {/* ================= FEATURE CARDS ================= */}
      <section
        className="
          relative
          z-20
          mx-auto
          mr-22
          
          flex
          w-full
          flex-wrap
          justify-center
          gap-3
          mb-10
          px-4
          pb-4
          sm:gap-5
          md:absolute
          md:bottom-6
          md:right-8
          md:w-auto
          md:justify-end
          md:px-0
          md:pb-0
          lg:right-16
        "
      >
        <FeatureCard
          icon="🖥"
          title="Online"
          subtitle="Courses"
        />

        <FeatureCard
          icon="♙"
          title="Expert"
          subtitle="Tutoring"
        />

        <FeatureCard
          icon="▣"
          title="Effective"
          subtitle="Method"
        />
      </section>
    </div>
  );
}

/* ================= FEATURE CARD ================= */

function FeatureCard({ icon, title, subtitle }) {
  return (
    <div
      className="
        flex
        h-24
        w-28
        flex-col
        items-center
        justify-center
        rounded-xl
        bg-[#F4EFE5]
        text-center
        shadow-sm
        sm:h-28
        sm:w-36
        md:h-28
        md:w-38
      "
    >
      <div
        className="
          mb-1
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-black
          sm:mb-2
          sm:h-12
          sm:w-12
        "
      >
        <span className="text-xl text-[#00D9C0] sm:text-2xl">
          {icon}
        </span>
      </div>

      <p className="text-xs font-medium leading-4 sm:text-sm">
        {title}
        <br />
        {subtitle}
      </p>
    </div>
  );
}

export default Loading;

