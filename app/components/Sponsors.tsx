import Image from "next/image";

export default function Sponsors() {
  const sponsors = [
    { name: "BotBlox", logo: "/sponsors/bot_blox.png" },
    { name: "ABC Columbia", logo: "/sponsors/abc.png" },
    { name: "Viam", logo: "/sponsors/viam_white.png" },
    { name: "Robify", logo: "/sponsors/robify.png" },
    { name: "Ban Ban Shop", logo: "/sponsors/banban.png" },
    { name: "Dredd Industries", logo: "/sponsors/dredd_white.png" },
    { name: "RAI", logo: "/sponsors/rai.png" },
    { name: "Robotis", logo: "/sponsors/robotis.png" },
  ];

  return (
    <section id="sponsors" className="text-white py-24 px-6 text-center">
      <h2 className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 text-white text-center">
        Sponsors
      </h2>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 justify-items-center">
          {sponsors.map((sponsor) => (
            <Image
              key={sponsor.name}
              src={sponsor.logo}
              alt={sponsor.name}
              width={280}
              height={140}
              className="object-contain max-h-28 sm:max-h-32 opacity-90 hover:opacity-100 transition-transform duration-300 hover:scale-105"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
