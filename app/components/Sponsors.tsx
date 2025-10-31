"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type SponsorTier = "Platinum" | "Gold" | "Silver" | "Bronze";

interface Sponsor {
  name: string;
  logo: string;
  url: string;
  tier: SponsorTier;
  description: string;
}

export default function Sponsors() {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleFlip = (sponsorName: string) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sponsorName)) {
        newSet.delete(sponsorName);
      } else {
        newSet.add(sponsorName);
      }
      return newSet;
    });
  };
  const sponsors: Sponsor[] = [
      { name: "Activities Board at Columbia", logo: "/sponsors/abc.png", url: "", tier: "Platinum", description: "" },
    { name: "BotBlox", logo: "/sponsors/bot_blox.png", url: "https://botblox.io/", tier: "Gold", description: "BotBlox builds the backbone of mobile intelligence — compact Ethernet and compute modules that power robots, drones, and mobile systems. We combine high-speed wired networking with edge compute, to enable edge AI and compute." },
    { name: "Robotis", logo: "/sponsors/robotis.png", url: "https://robotis.us/", tier: "Gold", description: "ROBOTIS (Robot is...), trusted since 1999, leads robotics with DYNAMIXEL smart actuators, offering modular solutions for movement and physical AI. From beginners to professionals, our versatile pipeline powers automation across multiple industries. DYNAMIXELs drive countless applications, accelerating innovation in physical AI, and reinforcing ROBOTIS as a pioneer in next-gen robotics." },
    { name: "Viam", logo: "/sponsors/viam_white.png", url: "https://www.viam.com/", tier: "Silver", description: "Viam is a robotics platform built for speed and scale. Build with any hardware, deploy AI models, and control robots using open-source SDKs for Python, Go, TypeScript, Flutter, and C++. With hardware-agnostic APIs, built-in data management, and cloud sync, Viam handles the infrastructure so you can focus on innovation." },
    { name: "Robify", logo: "/sponsors/robify.png", url: "https://robify.com/", tier: "Silver", description: "Founded in 2023, Robify is built by a passionate team dedicated to robotic product development and supply chain integration. We deliver comprehensive robotics hardware and software solutions, helping our customers turn ideas into fully integrated robotic systems. Our base is in Newark, Delaware, serves as the hub where innovation meets execution — from design and prototyping to testing and deployment." },
    { name: "Dredd Industries", logo: "/sponsors/dredd_white.png", url: "https://www.dreddindustries.com/", tier: "Silver", description: "" },
    { name: "RAI", logo: "/sponsors/rai.png", url: "https://rai-inst.com/", tier: "Silver", description: "Our mission is to solve the most important and fundamental challenges in robotics and AI." },
    { name: "Canes", logo: "/sponsors/1200px-Raising_Cane's_Chicken_Fingers_logo.svg-130982720.png", url: "https://www.raisingcanes.com/", tier: "Bronze", description: "Description coming soon..." },
    { name: "Ban Ban Shop", logo: "/sponsors/banban.png", url: "https://thebanbanshop.com/", tier: "Bronze", description: "Description coming soon..." },
  ];

  const tierOrder: SponsorTier[] = ["Platinum", "Gold", "Silver", "Bronze"];
  const tierColors: Record<SponsorTier, string> = {
    Platinum: "text-cyan-300",
    Gold: "text-yellow-400",
    Silver: "text-gray-300",
    Bronze: "text-amber-600",
  };

  const sponsorsByTier = tierOrder.reduce((acc, tier) => {
    acc[tier] = sponsors.filter((s) => s.tier === tier);
    return acc;
  }, {} as Record<SponsorTier, Sponsor[]>);

  const renderSponsor = (sponsor: Sponsor) => {
    const isBronze = sponsor.tier === "Bronze";
    const isFlipped = flippedCards.has(sponsor.name);
    
    // For Bronze tier, render simple card with just logo linking to site
    if (isBronze) {
      return (
        <div key={sponsor.name} className="w-full">
          {sponsor.url ? (
            <Link
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="bg-white/5 border border-white/20 rounded-2xl p-4 flex flex-col items-center space-y-3 h-[160px] overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/30">
                <div className="flex items-center justify-center w-full min-h-[80px]">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={280}
                    height={140}
                    className="object-contain max-h-16 opacity-90 transition-transform duration-300 hover:opacity-100 hover:scale-105"
                  />
                </div>
                <h4 className="font-semibold text-white text-base text-center">
                  {sponsor.name}
                </h4>
              </div>
            </Link>
          ) : (
            <div className="bg-white/5 border border-white/20 rounded-2xl p-4 flex flex-col items-center space-y-3 h-[160px] overflow-hidden">
              <div className="flex items-center justify-center w-full min-h-[80px]">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={280}
                  height={140}
                  className="object-contain max-h-16 opacity-90"
                />
              </div>
              <h4 className="font-semibold text-white text-base text-center">
                {sponsor.name}
              </h4>
            </div>
          )}
        </div>
      );
    }

    // For non-Bronze tiers, render flip card
    return (
      <div key={sponsor.name} className="relative w-full h-[416px] flip-card">
        <div className={`flip-inner ${isFlipped ? "rotate-y-180" : ""}`}>
          {/* Front of card */}
          <div className="flip-face cursor-pointer" onClick={() => toggleFlip(sponsor.name)}>
            <div className="bg-white/5 border border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center space-y-6 w-full h-full overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/30">
              <div className="flex items-center justify-center w-full flex-grow">
                {sponsor.url ? (
                  <Link
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="block"
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={280}
                      height={140}
                      className="object-contain max-h-32 opacity-90 transition-transform duration-300 hover:opacity-100 hover:scale-105"
                    />
                  </Link>
                ) : (
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={280}
                    height={140}
                    className="object-contain max-h-32 opacity-90"
                  />
                )}
              </div>
              <div className="text-center w-full">
                <h4 className="text-xl font-semibold text-white mb-3">
                  {sponsor.name}
                </h4>
                <p className="text-white/50 text-xs italic">Click to see more</p>
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className="flip-face flip-back cursor-pointer" onClick={() => toggleFlip(sponsor.name)}>
            <div className="bg-[#01206a]/95 backdrop-blur-md border border-white/20 rounded-2xl p-8 flex flex-col w-full h-full overflow-hidden transition-all duration-300 hover:border-white/30">
              <h4 className="text-sm font-semibold text-white mb-6 text-center">
                {sponsor.name}
              </h4>
              <div className="flex-grow flex items-center justify-center">
                <p className="text-white/80 text-base leading-relaxed text-center">
                  {sponsor.description}
                </p>
              </div>
              <p className="text-white/50 text-xs italic text-center mt-6">Click to flip back</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="sponsors" className="text-white py-24 px-6 text-center">
      <h2 className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 text-white text-center">
        Sponsors
      </h2>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-12 max-w-7xl mx-auto space-y-16">
        {tierOrder.map((tier) => {
          const tierSponsors = sponsorsByTier[tier];
          if (tierSponsors.length === 0) return null;

          return (
            <div key={tier} className="space-y-8 flex flex-col items-center">
              <h3 className={`font-mono text-4xl sm:text-5xl md:text-6xl font-bold ${tierColors[tier]} text-center`}>
                {tier}
              </h3>
              
              <div
                className={`grid gap-6 w-full justify-items-center ${
                  tier === "Platinum"
                    ? "grid-cols-1 max-w-2xl mx-auto"
                    : tier === "Gold"
                    ? "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto"
                    : tier === "Silver"
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-2"
                }`}
              >
                {tierSponsors.map(renderSponsor)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
