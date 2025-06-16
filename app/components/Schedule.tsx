export default function Schedule() {
    
const events = [
    // Saturday Schedule
    { time: "Saturday 9:00 AM", title: "Team Formation" },
    { time: "Saturday 10:00 AM", title: "Opening Ceremony" },
    { time: "Saturday 11:00 AM", title: "Makerspace Training & Tour" },
    { time: "Saturday 12:00 PM", title: "Lunch" },
    { time: "Saturday 1:00 PM", title: "Official Hacking Begins" },
    { time: "Saturday 1:00 PM", title: "Company Tabling Opens (All Day)" },
    { time: "Saturday Afternoon", title: "Workshops: Robotic Arm, SolidWorks, OpenCV" },
    { time: "Saturday 6:00 PM", title: "Dinner" },
    { time: "Saturday 10:00 PM", title: "Mario Kart Bonding Session" },
    { time: "Saturday 11:00 PM", title: "Midnight Snack" },
    { time: "Saturday 12:00 AM", title: "All-Night Hacking (Carleton Open)" },
    
    // Sunday Schedule
    { time: "Sunday 8:00 AM", title: "Coffee & Breakfast" },
    { time: "Sunday 12:00 PM", title: "Lunch" },
    { time: "Sunday 1:00 PM", title: "Project Expo" },
    { time: "Sunday 2:00 PM", title: "Closing Ceremony & Awards" }
  ];
  
  
    return (
      <section className="text-white px-6 pb-20" id="schedule">
        <h2 className="font-mono text-3xl sm:text-6xl font-bold text-center mb-10">
          Schedule
        </h2>
        <ul className="max-w-xl mx-auto space-y-6">
          {events.map((event, index) => (
            <li key={index} className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-semibold">{event.time}</span>
              <span className="text-white">{event.title}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }
  