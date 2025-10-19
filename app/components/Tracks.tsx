"use client";

import React from "react";
import { Trophy, Users, Cpu } from "lucide-react";

export default function Tracks() {
  return (
    <section className="px-6 py-24" id="tracks">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="font-mono text-4xl sm:text-5xl font-bold text-white mb-6">
          Tracks & Prizes
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Best Beginner Hack */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center space-x-3 mb-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold text-white">
              Best Beginner Hack
            </h3>
          </div>
          <p className="text-gray-300">
            For first-time hackers—build anything that shows initiative,
            creativity, and a willingness to learn!
          </p>
        </div>

        {/* Hacker’s Choice */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center space-x-3 mb-3">
            <Users className="w-6 h-6 text-green-400" />
            <h3 className="text-2xl font-bold text-white">Hacker’s Choice</h3>
          </div>
          <p className="text-gray-300">
            Voted by your fellow participants. Show off your originality and
            impress the hacker community!
          </p>
        </div>

        {/* Best Use of Dynamixel */}
        <div className="md:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center space-x-3 mb-4">
            <Cpu className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">
              Best Use of Dynamixel [ROBOTIS]
            </h3>
          </div>
          <ul className="text-gray-300 space-y-3 list-disc list-inside text-left">
            <li>
              <strong>Prize:</strong> OMX Set for each team member (maximum 3
              sets per team)
            </li>
            <li>
              <strong>Shipping:</strong> Prizes will be shipped directly from
              ROBOTIS to your chosen location.
            </li>
            <li>
              <strong>Team Size:</strong> Up to 3 members per team.
            </li>
            <li>
              <strong>Hardware Use:</strong> Projects must use ROBOTIS hardware,
              but you can combine with other platforms/tools.
            </li>
            <li>
              <strong>Project Video Submission:</strong> Submit a short
              (1–2 minute) YouTube video showing your build process and final
              project demo.
              <p className="text-gray-400 mt-1 ml-6">
                Production quality isn’t a judging factor—just demonstrate your
                creativity and functionality.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
