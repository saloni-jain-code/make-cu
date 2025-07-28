"use client"
import React, { useState } from 'react';
import { CheckSquare, Square, Play, FileText, ExternalLink, Wrench, Zap } from 'lucide-react';

interface TrainingItem {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'guide' | 'equipment';
  url?: string;
  status?: 'available' | 'in-process';
}

interface TrainingSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: TrainingItem[];
}

const TrainingItemComponent: React.FC<{ 
  item: TrainingItem; 
  isChecked: boolean; 
  onToggle: () => void;
}> = ({ item, isChecked, onToggle }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'video':
        return <Play className="w-4 h-4 text-blue-400" />;
      case 'quiz':
        return <FileText className="w-4 h-4 text-green-400" />;
      case 'guide':
        return <Wrench className="w-4 h-4 text-yellow-400" />;
      case 'equipment':
        return <ExternalLink className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'video':
        return 'Video';
      case 'quiz':
        return 'Quiz';
      case 'guide':
        return 'Guide';
      case 'equipment':
        return 'Equipment Info';
      default:
        return '';
    }
  };

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-white/5 ${
      item.status === 'in-process' ? 'opacity-60' : ''
    }`}>
      <button
        onClick={onToggle}
        className="flex-shrink-0 transition-colors duration-200 hover:scale-110"
        disabled={item.status === 'in-process'}
      >
        {isChecked ? (
          <CheckSquare className="w-5 h-5 text-green-400" />
        ) : (
          <Square className="w-5 h-5 text-gray-400 hover:text-white" />
        )}
      </button>
      
      {item.url && item.status !== 'in-process' ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 flex-grow group"
        >
          <div className="text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
            {getIcon()}
          </div>
          <span className={`text-sm transition-colors duration-200 ${
            isChecked 
              ? 'text-gray-400 line-through' 
              : 'text-blue-400 group-hover:text-blue-300 hover:underline'
          }`}>
            {item.title}
          </span>
        </a>
      ) : (
        <div className="flex items-center space-x-2 flex-grow">
          {getIcon()}
          <span className={`text-sm ${isChecked ? 'text-gray-400 line-through' : 'text-white'}`}>
            {item.title}
          </span>
          {item.status === 'in-process' && (
            <span className="text-xs text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded">
              In Process
            </span>
          )}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400">{getTypeLabel()}</span>
      </div>
    </div>
  );
};


const TrainingSection: React.FC<{ 
  section: TrainingSection; 
  checkedItems: Set<string>; 
  onToggle: (id: string) => void;
}> = ({ section, checkedItems, onToggle }) => {
  const Icon = section.icon;
  const completedCount = section.items.filter(item => checkedItems.has(item.id)).length;
  const totalCount = section.items.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4 border-b border-white/20 pb-4">
        <div className="flex items-center space-x-3">
          <Icon className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">{section.title}</h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-300">{completedCount}/{totalCount}</div>
          <div className="w-16 h-2 bg-white/20 rounded-full mt-1">
            <div 
              className="h-full bg-green-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {section.items.map((item) => (
          <TrainingItemComponent
            key={item.id}
            item={item}
            isChecked={checkedItems.has(item.id)}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

const MakerspaceTraining: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const trainingSections: TrainingSection[] = [
    {
      title: "General Makerspace Training",
      icon: Wrench,
      items: [
        {
          id: "getting-started",
          title: "Makerspace: Getting Started",
          type: "guide",
          url: "https://make.columbia.edu/getting-started-1"
        },
        {
          id: "makerspace-onboarding-video",
          title: "Makerspace Onboarding Video",
          type: "video",
          url: "https://youtu.be/E0Lh9JzMFLg"
        },
        {
          id: "onboarding-quiz",
          title: "Onboarding Quiz",
          type: "quiz",
          url: "https://forms.gle/3429oP6ZM2zBovCc9"
        }
      ]
    },
    {
      title: "Specialized Equipment Training",
      icon: Zap,
      items: [
        {
          id: "3d-printer-videos",
          title: "3D Printer Training Videos",
          type: "video",
          url: "https://www.youtube.com/playlist?list=PLLw34y3rqBBP2Bo_bHXwXfnb55NJsoY4U"
        },
        {
          id: "3d-printer-quiz",
          title: "3D Printer Quiz",
          type: "quiz",
          url: "https://forms.gle/aLzbVogk6JDiSvUH6"
        },
        {
          id: "laser-cutter-video",
          title: "Laser Cutter Video",
          type: "video",
          url: "https://www.youtube.com/watch?v=FAEMEsKSUIE"
        },
        {
          id: "laser-cutter-quiz",
          title: "Laser Cutter Quiz",
          type: "quiz",
          url: "https://forms.gle/USAUSy4kVYeBsDoJA"
        },
        {
          id: "wood-shop-quiz",
          title: "Wood Shop Quiz",
          type: "quiz",
          url: "https://forms.gle/cMnWGiVFQuW2NCLC7"
        },
        {
          id: "embroidery-quiz",
          title: "Embroidery Machine Quiz",
          type: "quiz",
          url: "https://forms.gle/vWUz3frgi7Ze4zVSA"
        }
      ]
    },
  ];

  const totalItems = trainingSections.reduce((sum, section) => sum + section.items.length, 0);
  const completedItems = checkedItems.size;
  const overallProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <section className="px-6 py-20" id="training">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 text-white text-center">
            Makerspace Training
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
           Complete these training modules to access the makerspace equipment!
          </p>
          
          {/* General Resources Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            <a
              href="https://make.columbia.edu/tools-resources"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 p-3 bg-white/10 rounded-lg border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-200 group"
            >
              <Wrench className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
              <span className="text-blue-400 group-hover:text-blue-300 font-medium transition-colors duration-200">
                Columbia Makerspace Info
              </span>
              <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
            </a>
            
            <a
              href="https://design.barnard.edu/equipment-and-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 p-3 bg-white/10 rounded-lg border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-200 group"
            >
              <Zap className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
              <span className="text-purple-400 group-hover:text-purple-300 font-medium transition-colors duration-200">
                Barnard Design Center Info
              </span>
              <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
            </a>
          </div>
          
          {/* Overall Progress */}
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold">Overall Progress</span>
              <span className="text-yellow-400 font-bold">{completedItems}/{totalItems}</span>
            </div>
            <div className="w-full h-4 bg-white/20 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="text-sm text-gray-300 mt-2">
              {Math.round(overallProgress)}% Complete
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-8">
          {trainingSections.map((section, index) => (
            <TrainingSection
              key={index}
              section={section}
              checkedItems={checkedItems}
              onToggle={toggleItem}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MakerspaceTraining;