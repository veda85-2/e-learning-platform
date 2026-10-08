import background from "../assets/green.png";
import winner from "../assets/winner.jpeg";
import { useNavigate } from "react-router-dom";

function Loading() {
  const navigate = useNavigate();

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden
        bg-cover
        bg-center
        bg-no-repeat
        flex
        flex-col
        justify-between
      "
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      {/* Navigation */}
      <nav
        className="
          relative
          z-20
          flex
          items-center
          justify-between
          px-4
          py-4
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
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              bg-[#111111]
              text-xs
              font-bold
              text-white
              sm:h-12
              sm:w-12
              sm:text-sm
            "
          >
            ES
          </div>

          <span className="text-lg text-[#fbf9f9] sm:text-xl font-bold">
            EDU<span className="font-extrabold text-black">sphere</span>
          </span>
        </div>

        {/* Quick Nav Button */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="
            rounded-full
            bg-black/90
            px-4
            py-2
            text-xs
            font-semibold
            text-white
            shadow-md
            backdrop-blur-xs
            transition-all
            hover:bg-black
            hover:scale-105
            active:scale-95
            sm:px-6
            sm:py-2.5
            sm:text-sm
          "
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-7xl
          flex-1
          flex-col
          items-center
          justify-center
          px-4
          py-6
          sm:px-8
          md:flex-row
          md:items-center
          md:justify-between
          md:px-12
          lg:px-16
        "
      >
        <section
          className="
            w-full
            text-center
            md:text-left
            md:w-1/2
            lg:w-[55%]
          "
        >
          <p
            className="
              mb-2
              text-base
              font-semibold
              text-black
              sm:text-lg
              md:text-xl
            "
          >
            Welcome to EDUsphere!
          </p>

          <h1
            className="
              text-3xl
              font-extrabold
              leading-tight
              tracking-tight
              sm:text-5xl
              md:text-5xl
              lg:text-6xl
            "
          >
            <span className="text-white drop-shadow-sm">
              Take Your
            </span>
            <br />
            <span className="text-white drop-shadow-sm">
              Knowledge to the
            </span>
            <br />
            <span className="text-black">
              Next Level
            </span>
          </h1>

          <p
            className="
              mt-4
              max-w-lg
              mx-auto
              md:mx-0
              text-sm
              leading-relaxed
              text-white/95
              drop-shadow-xs
              sm:text-base
              md:mt-6
              md:text-lg
            "
          >
            Learn at your own pace, track your progress, and build skills that move you forward.
          </p>

          {/* Get Started Button */}
          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3 sm:mt-8">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-black
                px-7
                py-3.5
                text-sm
                font-bold
                text-white
                shadow-xl
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#1a1a1a]
                active:scale-95
                sm:px-8
                sm:py-4
                sm:text-base
              "
            >
              Get Started
              <span className="ml-2 text-lg sm:text-xl">
                →
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-white/90
                px-6
                py-3.5
                text-sm
                font-bold
                text-black
                shadow-md
                backdrop-blur-xs
                transition-all
                hover:bg-white
                hover:-translate-y-0.5
                active:scale-95
                sm:text-base
              "
            >
              Create Account
            </button>
          </div>
        </section>

        {/* Hero Image */}
        <section
          className="
            mt-8
            flex
            w-full
            items-center
            justify-center
            md:mt-0
            md:w-1/2
            lg:w-[45%]
          "
        >
          <img
            src={winner}
            alt="Learning achievement"
            className="
              w-full
              max-w-[260px]
              rounded-3xl
              object-contain
              drop-shadow-2xl
              sm:max-w-xs
              md:max-w-sm
              lg:max-w-md
              transition-transform
              duration-300
              hover:scale-[1.02]
            "
          />
        </section>
      </main>

      {/* Feature Badges Section */}
      <section
        className="
          relative
          z-20
          mx-auto
          flex
          w-full
          max-w-7xl
          flex-wrap
          items-center
          justify-center
          gap-3
          px-4
          py-6
          sm:gap-4
          md:justify-end
          md:px-12
          lg:px-16
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

function FeatureCard({ icon, title, subtitle }) {
  return (
    <div
      className="
        flex
        h-20
        w-28
        flex-col
        items-center
        justify-center
        rounded-xl
        bg-[#F4EFE5]/95
        text-center
        shadow-md
        backdrop-blur-xs
        transition-all
        hover:-translate-y-1
        sm:h-24
        sm:w-32
        md:h-26
        md:w-36
      "
    >
      <div
        className="
          mb-1
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          bg-white
          shadow-xs
          sm:h-10
          sm:w-10
        "
      >
        <span className="text-base text-[#172f2c] sm:text-xl">
          {icon}
        </span>
      </div>

      <p className="text-[11px] font-semibold leading-tight text-gray-800 sm:text-xs">
        {title}
        <br />
        {subtitle}
      </p>
    </div>
  );
}

export default Loading;

