"use client";

import React from "react";
import { Trophy, Users, Cpu, Box } from "lucide-react";

export default function Tracks() {
  return (
    <section className="px-6 py-24" id="tracks">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold mb-10 sm:mb-12 text-white text-center">
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

        {/* ROBOTIS Track */}
        <div className="md:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center space-x-3 mb-4">
            <Cpu className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">
              ROBOTIS Track – Best Use of Dynamixel
            </h3>
          </div>

          <p className="text-gray-300 mb-4">
            Build something creative using ROBOTIS hardware! Explore robotics with 
            DYNAMIXEL smart actuators and the OpenRB-150 platform.
          </p>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-5">
            <div className="flex items-center space-x-2 mb-2">
              <Box className="w-5 h-5 text-blue-300" />
              <h4 className="text-lg font-semibold text-white">
                ROBOTIS Hardware Provided (Loan Units)
              </h4>
            </div>
            <ul className="text-gray-300 space-y-2 list-disc list-inside text-left">
              <li>30× OpenRB-150 Starter Sets, which includes:</li>
              <ul className="ml-6 space-y-1 list-disc list-inside text-gray-400">
                <li>1× OpenRB-150</li>
                <li>1× XL330-M288-T Smart Actuator (5V)</li>
              </ul>
              <li>15× XL330-M288-T Actuators (5V)</li>
              <li>15× XL430-W250-T Actuators (12V)</li>
            </ul>
          </div>

          <ul className="text-gray-300 space-y-3 list-disc list-inside text-left">
            <li>
              <strong>Prize:</strong> Each member of the winning team will receive 1 <a
              href="https://www.robotis.us/omx-bundle/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-400 hover:text-blue-300 decoration-blue-400/50"
            >
              OMX Set
            </a>, shipped directly to their chosen location. (Maximum 3 Sets)
            </li>
            <li>
              <strong>Team Size:</strong> Up to 4 members per team.
            </li>
            <li>
              <strong>Hardware Use:</strong> Projects must use ROBOTIS hardware, but you may combine with other platforms/tools.
            </li>
            <li>
              <strong>Project Video Submission:</strong> Submit a short (1–2 minute) YouTube video showing part of your build/assembly process and the completed project in action. Production quality isn’t a judging factor—just demonstrate your creativity and functionality.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
