"use client"
import React, { useState } from 'react';
import { Crown, Calendar, Code, Megaphone, DollarSign, Briefcase, ChevronLeft, ChevronRight, Linkedin } from 'lucide-react';

const teams: TeamData[] = [
    {
      title: "Executive",
      icon: Crown,
      members: [
        {
          name: "Sarah Hong",
          class: "CC '26",
          major: "Computer Science + Math",
          linkedin: "https://www.linkedin.com/in/sarah-soohyun-hong/",
          profilePicture: "/team/sarah.jpg"
        },
        {
          name: "Joseph Lee",
          class: "PhD, GSAS '27",
          major: "Physics",
          linkedin: "",
          profilePicture: "/team/joseph.jpeg"
        }
      ]
    },
    {
      title: "Events",
      icon: Calendar,
      members: [
        {
          name: "Celeste Lamadrid",
          class: "SEAS '26",
          major: "Mechanical Engineering",
          linkedin: "https://www.linkedin.com/in/celeste-lamadrid/",
          profilePicture: "/team/celeste.jpg"
        },
        {
          name: "James Zhang",
          class: "MS, SEAS '26",
          major: "Electrical Engineering",
          linkedin: "https://www.linkedin.com/in/tjzhang5741/",
          profilePicture: "/team/james.jpg"
        },
        {
          name: "Isaac Trost",
          class: "",
          major: "",
          linkedin: "",
          profilePicture: "/team/isaac.jpg"
        }
      ]
    },
    {
      title: "Technical Development",
      icon: Code,
      members: [
        {
          name: "Saloni Jain",
          class: "SEAS '26",
          major: "Computer Science + Applied Math",
          linkedin: "https://www.linkedin.com/in/saloni-jain-columbia/",
          profilePicture: "/team/saloni.jpg"
        }
      ]
    },
    {
      title: "Marketing",
      icon: Megaphone,
      members: [
        {
          name: "Mannat Jain",
          class: "SEAS'29",
          major: "Material Science and Engineering + Computer Science",
          linkedin: "https://www.linkedin.com/in/mannatvjain/",
          profilePicture: "/team/mannat.png"
        }
      ]
    },
    {
      title: "Finance",
      icon: DollarSign,
      members: [
        {
          name: "Alice Lin",
          class: "SEAS '27",
          major: "Computer Science + Applied Math",
          linkedin: "https://www.linkedin.com/in/alice-lin-54a21a243/",
          profilePicture: "/team/alice.jpeg"
        },
        {
          name: "Sunny Hu",
          class: "SEAS '26",
          major: "Electrical Engineering",
          linkedin: "https://www.linkedin.com/in/sunny-hu-columbia/",
          profilePicture: "/team/sunny.jpeg"
        }
      ]
    },
    {
      title: "Business",
      icon: Briefcase,
      members: [
        {
          name: "Jia Liu",
          class: "GS '26",
          major: "Computer Science",
          linkedin: "",
          profilePicture: "/team/jia.jpg"
        }
      ]
    }
  ];

interface TeamMember {
  name: string;
  class: string;
  major: string;
  linkedin: string;
  profilePicture: string;
}

interface TeamData {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  members: TeamMember[];
}

const TeamBox: React.FC<{ team: TeamData }> = ({ team }) => {
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const currentMember = team.members[currentMemberIndex];
  const Icon = team.icon;

  const nextMember = () => {
    setCurrentMemberIndex((prev) => (prev + 1) % team.members.length);
  };

  const prevMember = () => {
    setCurrentMemberIndex((prev) => (prev - 1 + team.members.length) % team.members.length);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 transition-all duration-200 hover:bg-white/15">
      {/* Team Header */}
      <div className="flex items-center justify-center mb-6 border-b border-white/20 pb-4">
        <Icon className="w-6 h-6 text-yellow-400 mr-3" />
        <h3 className="text-xl font-bold text-white text-center font-mono">{team.title}</h3>
      </div>

      {/* Member Info */}
      <div className="flex items-center justify-center mb-6 min-h-[120px]">
        <div className="flex items-center space-x-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0 mr-4">
            <img
                src={currentMember.profilePicture}
                alt={`${currentMember.name}'s profile`}
                className="w-30 h-30 rounded-lg object-cover border-2 border-yellow-400/30"
            />
            </div>
            
            {/* Member Details */}
            <div className="flex-grow text-left">
            <h4 className="text-lg font-semibold text-white mb-1">{currentMember.name}</h4>
            <p className="text-yellow-400 font-medium text-sm mb-1">{currentMember.class}</p>
            <p className="text-gray-300 text-sm mb-2">{currentMember.major}</p>
            <a
                href={currentMember.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
            >
                <Linkedin className="w-4 h-4 mr-1" />
                LinkedIn
            </a>
            </div>
        </div>
        
      </div>

      {/* Navigation */}
      {team.members.length > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-2">
          <button
            onClick={prevMember}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
            aria-label="Previous member"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          
          <div className="flex space-x-2">
            {team.members.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMemberIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentMemberIndex ? 'bg-yellow-400' : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to member ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextMember}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
            aria-label="Next member"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

const MeetTheTeam: React.FC = () => {
  return (
    <section className="px-6 py-20 items-center" id="team">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 text-white text-center">
            Meet the Team
          </h1>
        </div>
        
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-8">
          {teams.map((team, index) => (
            <TeamBox key={index} team={team} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetTheTeam;