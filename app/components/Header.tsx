import Link from "next/link";

export default function Header() {
  return (
    <section className="text-center px-6 pt-40 pb-5 text-white">
      <h1 className="font-mono text-9xl sm:text-9xl font-bold mb-6 glow-text">
        MakeCU 2025
      </h1>
      <h1 className="font-sans text-6xl sm:text6xl font-bold mb-6">
        November 8-9th, 2025
      </h1>
      <p className="font-sans italic max-w-xl mx-auto text-sm sm:text-lg text-gray-300 mb-8">
        Columbia University Robotics Club's 24-hour hardware hackathon
      </p>
      <Link href="https://www.columbiarobotics.club/hack-and-build-2024/teams"
        className="inline-block bg-white text-[#01206a] font-sans font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition">
          See last year's projects
      </Link>
    </section>
  );
}
