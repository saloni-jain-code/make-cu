import Image from "next/image";
import Link from "next/link";

export default function Sponsors() {
  const sponsors = [
    { name: "BotBlox", logo: "/sponsors/bot_blox.png", url: "https://botblox.io/" },
    { name: "ABC Columbia", logo: "/sponsors/abc.png", url:""},
    { name: "Viam", logo: "/sponsors/viam_white.png", url: "https://www.viam.com/" },
    { name: "Robify", logo: "/sponsors/robify.png", url: "https://robify.com/" },
    { name: "Ban Ban Shop", logo: "/sponsors/banban.png", url: "https://thebanbanshop.com/" },
    { name: "Dredd Industries", logo: "/sponsors/dredd_white.png", url: "https://www.dreddindustries.com/" },
    { name: "RAI", logo: "/sponsors/rai.png", url: "https://rai-inst.com/" },
    { name: "Robotis", logo: "/sponsors/robotis.png", url: "https://robotis.us/" },
  ];

  return (
    <section id="sponsors" className="text-white py-24 px-6 text-center">
      <h2 className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 text-white text-center">
        Sponsors
      </h2>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 justify-items-center">
          {sponsors.map((sponsor) => {
            const image = (
              <Image
                key={sponsor.name}
                src={sponsor.logo}
                alt={sponsor.name}
                width={280}
                height={140}
                className={`object-contain max-h-28 sm:max-h-32 opacity-90 transition-transform duration-300 ${
                  sponsor.url ? "hover:opacity-100 hover:scale-105" : ""
                }`}
              />
            );

            return sponsor.url ? (
              <Link
                key={sponsor.name}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                {image}
              </Link>
            ) : (
              <div key={sponsor.name}>{image}</div>
            );
          })}
        </div>
      </div>
    </section>
  );


}
