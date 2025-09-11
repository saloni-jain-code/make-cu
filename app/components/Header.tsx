import Link from "next/link";

export default function Header() {
  return (
    <section className="text-center px-6 pt-40 pb-5 text-white" id="header">
      <h1 className="font-mono text-7xl sm:text-8xl md:text-9xl lg:text-10xl font-bold mb-4 sm:mb-6 glow-text text-center">
        MakeCU 2025
      </h1>
      <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-center">
        November 8-9th, 2025
      </h1>
      <p className="font-sans italic max-w-xs sm:max-w-md md:max-w-xl mx-auto text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 text-center px-4">
        Columbia University Robotics Club's 24-hour hardware hackathon
      </p>
      <Link
        href="https://forms.gle/sCMs2GZJ2LzeW3Wu7"
        className="block w-fit mx-auto bg-white text-[#01206a] font-sans font-bold px-8 sm:px-10 py-4 rounded-full text-lg sm:text-xl transition-all duration-300 hover:shadow-[0_0_15px_5px_rgba(255,255,255,0.75)]"
        target="_blank"
        rel="noopener noreferrer"
      >
        Apply Now
      </Link>

      <Link href="https://www.columbiarobotics.club/hack-and-build-2024/teams"
          className="block w-fit mx-auto bg-[#1c3679] text-white font-sans font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-[#193e9c] transition text-sm sm:text-base mb-8 my-6"
>
          See last year's projects
      </Link>
    </section>
  );
}
