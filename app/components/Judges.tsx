import Image from "next/image";

export default function Judges() {
  const judges = [
    {
      name: "Tony Dear",
      title: "Senior Lecturer in CS at Columbia",
      bio: "Tony Dear is a Columbia University Computer Science teaching faculty member and faculty director of the AI Executive Education certificate and CS@CU MS Bridge programs. He teaches courses in math for CS, AI, and robotics, and co-designed the Data-Driven Decision Modeling graduate course. He also teaches Decision Making and Reinforcement Learning on Coursera. His research focuses on robotics, reinforcement learning, deep learning, and improving efficiency for complex systems.",
      image: "/judges/tony_dear.jpeg",
    },
    {
      name: "David Watkins",
      title: "Research Lead at RAI Institute",
      bio: "David Watkins is a research lead at the RAI Institute focused on the intersection of robotics hardware and software to create state-of-the-art robotics foundation models. Previously, he received his PhD from Columbia University from the Columbia Robotics Lab, advised by Peter Allen. He is also coauthor of the blog, whattotelltherobot.com, with Stefanie Tellex, discussing the intersection of language and robotics.",
      image: "/judges/david_watkins.jpg",
    },
    {
      name: "Josh Elijah",
      title: "Founder of BotBlox",
      bio: "Josh Elijah is the Founder of BotBlox, a multi-million dollar hardware company that manufactures ultra compact networking and compute modules for drones and robots. Josh has deep expertise in electronics, robotics, manufacture and computer architecture.",
      image: "/judges/josh_elijah.png",
    },
  ];

  return (
    <section id="judges" className="text-white py-24 px-6 text-center">
      <h2 className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold mb-10 sm:mb-12 text-white text-center">
        Judges
      </h2>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 max-w-7xl mx-auto">
        {judges.map((judge) => (
          <div
            key={judge.name}
            className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 sm:p-10 text-center shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-white/20 flex-1 max-w-sm mx-auto"
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden mb-6 shadow-md">
              <Image
                src={judge.image}
                alt={judge.name}
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>

            <h3 className="font-sans text-xl sm:text-2xl font-semibold mb-2">
              {judge.name}
            </h3>
            <p className="text-sm sm:text-base text-gray-300 italic mb-4">
              {judge.title}
            </p>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {judge.bio}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
