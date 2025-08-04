"use client"
import React from 'react';
import { Cpu, Zap, Cog, ExternalLink } from 'lucide-react';

interface HardwareItem {
  id: string;
  name: string;
  description?: string;
  url?: string;
}

interface HardwareCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: HardwareItem[];
}

const HardwareItemComponent: React.FC<{ item: HardwareItem }> = ({ item }) => {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-white/5">
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 flex-grow group"
        >
          <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></div>
          <div className="flex-grow">
            <span className="text-sm text-blue-400 group-hover:text-blue-300 hover:underline transition-colors duration-200 font-medium">
              {item.name}
            </span>
            {item.description && (
              <p className="text-xs text-gray-400 mt-1">{item.description}</p>
            )}
          </div>
          <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-200 flex-shrink-0" />
        </a>
      ) : (
        <div className="flex items-center space-x-3 flex-grow">
          <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></div>
          <div className="flex-grow">
            <span className="text-sm text-white font-medium">{item.name}</span>
            {item.description && (
              <p className="text-xs text-gray-400 mt-1">{item.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const HardwareCategory: React.FC<{ category: HardwareCategory }> = ({ category }) => {
  const Icon = category.icon;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center space-x-3 mb-6 border-b border-white/20 pb-4">
        <Icon className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-white">{category.title}</h3>
        {/* <div className="text-sm text-gray-300">({category.items.length} items)</div> */}
      </div>
      
      <div className="space-y-2">
        {category.items.map((item) => (
          <HardwareItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

const Hardware: React.FC = () => {
  const hardwareCategories: HardwareCategory[] = [
    {
      title: "Microcontrollers",
      icon: Cpu,
      items: [
        {
          id: "elegoo-kit",
          name: "Elegoo Kit",
          description: "Complete Arduino-compatible development kit with components"
        },
        {
          id: "raspberry-pi",
          name: "Raspberry Pi",
          description: "Single-board computer for advanced projects"
        }
      ]
    },
    {
        title: "Sensors",
        icon: Zap,
        items: [
          {
            id: "audio-kit",
            name: "Audio Kit",
            description: "Microphones and speakers for sound projects"
          },
          {
            id: "camera-kit",
            name: "Camera Kit",
            description: "Image capture and computer vision components"
          },
          {
            id: "motion-detection",
            name: "Motion Detection Kit",
            description: "PIR motion sensors and ultrasonic distance sensors"
          },
          {
            id: "advanced-sensors",
            name: "Advanced Sensors",
            description: "LiDAR distance sensors and muscle/EMG sensors"
          }
        ]
      },
    {
      title: "Motors & Actuators",
      icon: Cog,
      items: [
        {
          id: "servo-motor",
          name: "Servo Motors",
          description: "Precise position control motors for robotics"
        },
        {
          id: "stepper-motor",
          name: "Stepper Motors",
          description: "High-precision motors for accurate positioning"
        },
        {
          id: "brushed-motor",
          name: "Brushed DC Motors",
          description: "Standard DC motors for continuous rotation applications"
        }
      ]
    }
  ];

  const totalItems = hardwareCategories.reduce((sum, category) => sum + category.items.length, 0);

  return (
    <section className="px-6 py-20" id="hardware">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 text-white text-center">
            Hardware
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            All the hardware components you need to build amazing projects!
          </p>
          
          {/* Hardware Summary */}
          {/* <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold">Total Components</span>
              <span className="text-yellow-400 font-bold">{totalItems}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-blue-400 font-bold text-lg">{hardwareCategories[0].items.length}</div>
                <div className="text-xs text-gray-300">Controllers</div>
              </div>
              <div>
                <div className="text-green-400 font-bold text-lg">{hardwareCategories[1].items.length}</div>
                <div className="text-xs text-gray-300">Sensors</div>
              </div>
              <div>
                <div className="text-purple-400 font-bold text-lg">{hardwareCategories[2].items.length}</div>
                <div className="text-xs text-gray-300">Motors</div>
              </div>
            </div>
          </div> */}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-8">
          {hardwareCategories.map((category, index) => (
            <HardwareCategory key={index} category={category} />
          ))}
        </div>

        {/* <div className="mt-12 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-3">Hardware Notes</h3>
            <div className="text-gray-300 text-sm space-y-2 text-left">
              <p>• All hardware will be available for checkout during the hackathon</p>
              <p>• Components are provided on a first-come, first-served basis</p>
              <p>• Additional components may be available - ask our hardware team!</p>
              <p>• Please return all borrowed hardware at the end of the event</p>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Hardware;