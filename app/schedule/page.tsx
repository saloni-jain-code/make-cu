import React from 'react';
import { CheckSquare, Clock, Users, Wrench, Utensils, Trophy, Coffee, Gamepad2, UserPlus, Megaphone, Zap, Building2, Cpu, Moon, Code, GitBranch, Sparkles, Rocket, Pickaxe, Github, } from 'lucide-react';

const saturdayEvents: ScheduleEventProps[] = [
  {
    time: "9:00 -  10:00 AM",
    title: "Check-in & Team Formation",
    icon: UserPlus,
    location: "Carleton Commons",
    isHighlight: true
  },
  {
    time: "10:00 - 10:30 AM",
    title: "Opening Ceremony",
    icon: Megaphone,
    location: "Carleton Commons",
    isHighlight: true
  },
  {
    time: "10:30 AM - 11:00 AM",
    title: "Makerspace Training",
    location: "Makerspace",
    description: "Hands-on tool training in the Makerspace",
    icon: Wrench
  },
  {
    time: "11:00 AM",
    title: "Official Hacking Begins: Hardware Pickup",
    location: "Carleton Commons",
    icon: Zap, 
    isHighlight: true
  },
  {
    time: "12:00 - 1:00 PM",
    title: "Lunch",
    location: "Carleton Commons",
    icon: Utensils
  },
  {
    time: "1:00 - 6:30 PM",
    title: "Work Time",
    location: "Carleton Commons, Makerspace, Mudd 227, Mudd 233 (after 5pm)",
    icon: Pickaxe
  },
  {
    time: "1:00 - 2:00 PM",
    title: "Modular Coding Workshop",
    location: "Mudd 833",
    icon: Code,
  },
  {
    time: "2:00 - 2:45 PM",
    title: "MLH Hacking with GitHub Copilot Workshop",
    location: "Mudd 833",
    description: "Elevate your hackathon game in just under an hour! Join this workshop on Making Better Hacks, Faster with GitHub Copilot, and discover how this AI companion transforms the coding experience for beginners and seasoned developers. Copilot isn't just another tool you can use to speed up your development; it's like having another hacker on your team!",
    icon: Github,
  },
  {
    time: "2:45 - 3:30 PM",
    title: "MLH Intro to Google AI Studio Workshop",
    location: "Mudd 833",
    description: "Google AI Studio is the fastest way to start building with the Gemini family of multimodal generative AI models. Google AI Studio allows you to try out Gemini's massive token context window, grab an API key in seconds, and experiment out prebuilt prompts. What will you build with Google AI Studio today? Participants will be entered into a raffle for some exclusive swag!",
    icon: Sparkles,
  },
  {
    time: "3:30 - 4:30 PM",
    title: "How To Build A Hardware Startup Workshop",
    location: "Mudd 833",
    description:"Curious to know what it takes to create a startup? Come hear Josh from BotBlox talk about how he built his startup from the ground up.",
    icon: Rocket,
  },
  {
    time: "6:30 - 8:00 PM",
    title: "Dinner & Hardware Jeopardy!",
    location: "Carleton Commons",
    icon: Utensils
  },
  {
    time: "8:00 - 9:30 PM",
    title: "Work Time",
    location: "Carleton Commons, Makerspace, Mudd 227, Mudd 233",
    icon: Pickaxe
  },
  {
    time: "9:30 - 11:30 PM",
    title: "Mario Kart Tournament",
    location: "Carleton Commons",
    icon: Gamepad2,
  },
  {
    time: "12:00 AM",
    title: "Midnight Snack and Jackbox",
    location: "Carleton Commons",
    icon: Moon
  },
  {
    time: "All Night",
    title: "24/7 Hacking",
    description: "Carleton Commons and the Makerspace will stay open all night for hackers",
    location: "Carleton Commons, Makerspace, Mudd 227, Mudd 233",
    icon: Clock
  }
];

const sundayEvents: ScheduleEventProps[] = [
  {
    time: "9:00 - 10:00 AM",
    title: "Morning Check-in & Breakfast",
    location: "Carleton Commons",
    icon: Coffee
  },
  {
    time: "9:00 AM - 12:00 PM",
    title: "Final Work Time",
    location: "Carleton Commons, Mudd 227, Mudd 233",
    icon: Zap
  },
  {
    time: "12:00 PM",
    title: "Hacking Deadline",
    icon: Clock,
    isHighlight: true
  },
  {
    time: "12:00 - 1:00 PM",
    title: "Lunch",
    location: "Carleton Commons",
    icon: Utensils
  },
  {
    time: "1:00 - 3:00 PM",
    title: "Project Expo",
    icon: Users, 
    location: "Carleton Commons",
    isHighlight: true
  },
  {
    time: "3:00 - 3:30 PM",
    title: "Hardware Return",
    location: "Carleton Commons",
    icon: Wrench,
  },
  {
    time: "4:00 - 4:30 PM",
    title: "Closing Ceremony & Closing Keynote: RAI",
    icon: Trophy,
    location: "Carleton Commons",
    isHighlight: true
  }
];

interface ScheduleEventProps {
  time: string;
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  location?: string;
  isHighlight?: boolean;
}

interface DayScheduleProps {
  day: string;
  events: ScheduleEventProps[];
}

// 🔹 Component: individual event
const ScheduleEvent: React.FC<ScheduleEventProps> = ({
    time,
    title,
    description,
    location,
    icon: Icon,
    isHighlight = false,
  }) => (
    <div
      className={`flex items-start space-x-3 p-4 rounded-lg transition-all duration-200 hover:bg-white/10 ${
        isHighlight ? "bg-white/5 border-l-4 border-yellow-400" : ""
      }`}
    >
      <div className="flex-shrink-0 mt-1">
        <Icon className="w-5 h-5 text-yellow-400" />
      </div>
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-white text-lg">{title}</h3>
          <span className="text-yellow-400 font-medium text-sm mt-1 sm:mt-0">
            {time}
          </span>
        </div>
        {location && (
          <p className="text-yellow-300 text-sm mt-1">{location}</p>
        )}
        {description && (
          <p className="text-gray-300 text-sm mt-2 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        )}
      </div>
    </div>
  );
  
  const DaySchedule: React.FC<DayScheduleProps> = ({ day, events }) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 text-center border-b border-white/20 pb-4">
        {day}
      </h2>
      <div className="space-y-3">
        {events.map((event, index) => (
          <ScheduleEvent key={index} {...event} />
        ))}
      </div>
    </div>
  );
  
  export default function SchedulePage() {
    return (
      <main className="px-6 py-20 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 text-white text-center py-4">
              Hackathon Schedule
            </h1>
          </header>
  
          {/* Before You Arrive Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-12">
            <div className="flex items-center space-x-3 mb-4 border-b border-white/20 pb-3">
              <Wrench className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">
                Before You Arrive...
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
              Make sure you’re ready for the hackathon! Here’s a quick checklist
              of what to bring:
            </p>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-start space-x-3">
                <CheckSquare className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Sleeping Equipment:</strong> Bring a sleeping bag or
                  blanket if you plan to rest in the designated room.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckSquare className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Hardware:</strong> We’ll provide hardware, but teams are
                  encouraged to bring their own microcontrollers or tools.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckSquare className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Government-Issued ID:</strong> Required to enter
                  Columbia’s campus.
                </span>
              </li>
            </ul>
          </div>
  
          {/* Schedule content */}
          <div className="space-y-12">
            <DaySchedule day="Saturday" events={saturdayEvents} />
            <DaySchedule day="Sunday" events={sundayEvents} />
          </div>
        </div>
      </main>
    );
  }
  