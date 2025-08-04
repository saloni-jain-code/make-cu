import React from 'react';
import { Clock, Users, Wrench, Utensils, Trophy, Coffee, Gamepad2, UserPlus, Megaphone, Zap, Building2, Cpu, Moon, } from 'lucide-react';

const saturdayEvents: ScheduleEventProps[] = [
  {
    time: "9:00 -  10:00 AM",
    title: "Check-in & Team Formation",
    icon: UserPlus,
    isHighlight: true
  },
  {
    time: "10:00 - 10:30 AM",
    title: "Opening Ceremony",
    icon: Megaphone,
    isHighlight: true
  },
  {
    time: "10:30 AM - 11:00 AM",
    title: "Makerspace Training",
    description: "Hands-on tool training in the Makerspace",
    icon: Wrench
  },
  {
    time: "11:00 AM",
    title: "Official Hacking Begins + Hardware Pickup",
    icon: Zap, 
    isHighlight: true
  },
  {
    time: "12:00 - 1:00 PM",
    title: "Lunch",
    icon: Utensils
  },
  {
    time: "1:00 PM",
    title: "Company Tabling Opens",
    icon: Building2,
  },
  {
    time: "2:00 - 3:00 PM",
    title: "Solidworks CAD, 3D Printing, and Lasercutting Workshop",
    icon: Wrench
  },
  {
    time: "3:00 - 4:00 PM",
    title: "Basic Circuitry for Robotics Workshop",
    icon: Zap 
  },
  {
    time: "4:00 - 5:00 PM",
    title: "AI and Robotics",
    icon: Cpu
  },
  {
    time: "6:30 - 8:00 PM",
    title: "Dinner",
    icon: Utensils
  },
  {
    time: "9:30 - 11:30 PM",
    title: "Mario Kart Tournament",
    icon: Gamepad2,
  },
  {
    time: "12:00 AM",
    title: "Midnight Snack and Jackbox",
    icon: Moon
  },
  {
    time: "All Night",
    title: "24/7 Hacking",
    description: "Carleton Commons and the Makerspace will stay open all night for hackers",
    icon: Clock
  }
];

const sundayEvents: ScheduleEventProps[] = [
  {
    time: "9:00 - 10:00 AM",
    title: "Morning Check-in & Breakfast",
    icon: Coffee
  },
  {
    time: "9:00 AM - 12:00 PM",
    title: "Final Work Time",
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
    icon: Utensils
  },
  {
    time: "1:00 - 2:30 PM",
    title: "Project Expo",
    icon: Users, 
    isHighlight: true
  },
  {
    time: "2:30 - 3:00 PM",
    title: "Hardware Return",
    icon: Wrench,
  },
  {
    time: "3:00 - 3:30 PM",
    title: "Closing Ceremony & Awards",
    icon: Trophy,
    isHighlight: true
  }
];

interface ScheduleEventProps {
  time: string;
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  isHighlight?: boolean;
}

interface DayScheduleProps {
  day: string;
  events: ScheduleEventProps[];
}

const ScheduleEvent: React.FC<ScheduleEventProps> = ({ 
  time, 
  title, 
  description, 
  icon: Icon, 
  isHighlight = false 
}) => (
  <div className={`flex items-start space-x-3 p-4 rounded-lg transition-all duration-200 hover:bg-white/10 ${
    isHighlight ? 'bg-white/5 border-l-4 border-yellow-400' : ''
  }`}>
    <div className="flex-shrink-0 mt-1">
      <Icon className="w-5 h-5 text-yellow-400" />
    </div>
    <div className="flex-grow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-semibold text-white text-lg">{title}</h3>
        <span className="text-yellow-400 font-medium text-sm mt-1 sm:mt-0">{time}</span>
      </div>
      {description && (
        <p className="text-gray-300 text-sm mt-2 leading-relaxed whitespace-pre-line">{description}</p>
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

const HackathonSchedule: React.FC = () => {
  return (
      <section className="px-6 py-20" id="schedule">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 text-white text-center">
            Schedule
            </h1>
          </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DaySchedule day="Saturday" events={saturdayEvents} />
          <DaySchedule day="Sunday" events={sundayEvents} />
        </div>
      </div>
    </section>
  );
};

export default HackathonSchedule;
// export default function Schedule() {
    
// const events = [
//     // Saturday Schedule
//     { time: "Saturday 9:00 AM", title: "Team Formation" },
//     { time: "Saturday 10:00 AM", title: "Opening Ceremony" },
//     { time: "Saturday 11:00 AM", title: "Makerspace Training & Tour" },
//     { time: "Saturday 12:00 PM", title: "Lunch" },
//     { time: "Saturday 1:00 PM", title: "Official Hacking Begins" },
//     { time: "Saturday 1:00 PM", title: "Company Tabling Opens (All Day)" },
//     { time: "Saturday Afternoon", title: "Workshops: Robotic Arm, SolidWorks, OpenCV" },
//     { time: "Saturday 6:00 PM", title: "Dinner" },
//     { time: "Saturday 10:00 PM", title: "Mario Kart Bonding Session" },
//     { time: "Saturday 11:00 PM", title: "Midnight Snack" },
//     { time: "Saturday 12:00 AM", title: "All-Night Hacking (Carleton Open)" },
    
//     // Sunday Schedule
//     { time: "Sunday 8:00 AM", title: "Coffee & Breakfast" },
//     { time: "Sunday 12:00 PM", title: "Lunch" },
//     { time: "Sunday 1:00 PM", title: "Project Expo" },
//     { time: "Sunday 2:00 PM", title: "Closing Ceremony & Awards" }
//   ];
  
  
//     return (
//       <section className="text-white px-6 pb-20" id="schedule">
//         <h2 className="font-mono text-3xl sm:text-6xl font-bold text-center mb-10">
//           Schedule
//         </h2>
//         <ul className="max-w-xl mx-auto space-y-6">
//           {events.map((event, index) => (
//             <li key={index} className="flex flex-col sm:flex-row sm:justify-between">
//               <span className="font-semibold">{event.time}</span>
//               <span className="text-white">{event.title}</span>
//             </li>
//           ))}
//         </ul>
//       </section>
//     );
//   }
  