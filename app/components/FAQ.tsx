
"use client"
import { useState } from "react";

const faqs = [
    {
      question: "What is a hardware hackathon?",
      answer: "Unlike traditional software hackathons, hardware hackathons are events where participants come together to prototype and build projects using real materials. They offer an opportunity to apply electrical, mechanical, and software engineering skills to a real world project. Students will build familiarity with circuit design, soldering, working with sensors/actuators, develop skills using 3D printers, CAD software, and working with physical materials, engineering moving parts. You'll also develop programming skills for coding the logic behind microcontrollers or embedded systems.",
    },
    {
      question: "When is MakeCU?",
      answer: "MakeCU will take place on November 8-9, 2025 at Columbia University. More detailed schedule to come later.",
    },
    {
      question: "Who can participate?",
      answer: "We welcome all collegiate undergraduate and graduate students!",
    },
    {
      question: "Do I need any experience to join?",
      answer: "Not at all! We will provide workshops and mentors at the event to enable interested students of all levels participate.",
    },
    {
      question: "Is there a cost to participate?",
      answer: "Nope! All hardware will be provided at the hackathon.",
    },
    {
      question: "What kinds of hardware will be provided?",
      answer: "We will do our best to provide all necessary equipment; however, you are encouraged to bring your own hardware tools, such as microcomputers, sensors, and mechanical tools, to enhance your project! Arduino kits, sensors, and more will be available. See the 'Hardware' section of the website.",
    },
    {
      question: "Do I need to bring my own hardware?",
      answer: "Only if you want! Feel free to bring any kind of hardware or tools you want, but note that all projects must be assembled and built entirely within the duration of the hackathon to be counted for judging.",
    },
    {
      question: "How large of a team can I form?",
      answer: "Teams must have at least 2 people and no more than 4 people.",
    },
    {
      question: "What if I don't have a team?",
      answer: "No worries! We will make sure all participants will have a team. In person team formation will happen at the beginning of the event, and 1 week before the hackathon, we will send out links to our Discord server where members can form teams online based on similar projects and interests.",
    },
  ];
  

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-6 py-20" id="faq">
      {/* Background overlay for better text readability */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-12 max-w-4xl mx-auto">
        <h2 className="font-mono text-4xl sm:text-6xl font-bold mb-12 text-center text-white">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-6 py-5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
              >
                <div className="flex justify-between items-center">
                  <span className="font-sans font-semibold text-lg text-white pr-4">
                    {faq.question}
                  </span>
                  
                  {/* Animated arrow */}
                  <div className={`transform transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : 'rotate-0'
                  }`}>
                    <svg 
                      className="w-6 h-6 text-white/80" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </div>
                </div>
              </button>
              
              {/* Animated content */}
              <div
                className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index 
                    ? "max-h-96 opacity-100 pb-5" 
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="border-t border-white/20 pt-4">
                  <p className="font-sans text-white/90 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
