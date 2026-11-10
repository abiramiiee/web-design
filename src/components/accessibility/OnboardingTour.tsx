import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles, Box, Sprout, Palette, CheckCircle } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useData } from '../../context/DataContext';

export const OnboardingTour: React.FC = () => {
  const { isOnboardingOpen, closeOnboarding } = useAccessibility();
  const { setCurrentView } = useData();

  const [step, setStep] = useState(0);

  if (!isOnboardingOpen) return null;

  const tourSteps = [
    {
      title: 'Welcome to DreamBoard AI! 🎨',
      description: 'Dream It. Design It. Grow Into It. An innovative dream visualization and goal planning platform designed in a tactile 3D Clay World style.',
      icon: '✨',
      view: 'landing' as const,
      tip: 'Notice our soft clay borders, warm studio reflections, and accessible typography.',
    },
    {
      title: 'Interactive 3D Miniature Clay Rooms 🏰',
      description: 'Explore rooms designed for Education, Career, Travel, Creativity, and Health. Rotate, zoom in, and click miniature clay props to inspect milestones.',
      icon: '🗿',
      view: 'rooms' as const,
      tip: 'You can customize room wall and floor colors or toggle to 2D mode for low-power devices.',
    },
    {
      title: 'AI Dream-to-Action Converter 🔮',
      description: 'Speak or type any dream in natural language. Powered by Gemini 3.8 Flash, DreamBoard AI extracts milestones, hours, habits, and 3 alternative pathways.',
      icon: '🎙️',
      view: 'dashboard' as const,
      tip: 'Click the "+ AI Planner" button anytime in the top navigation or use your microphone.',
    },
    {
      title: 'The Dream Garden & Memory Wall 🌸',
      description: 'Every milestone you conquer blossoms into colorful 3D sunflowers, bonsai trees, and tulips in the garden. Save certificates and photo memories on your Wall.',
      icon: '🌻',
      view: 'garden' as const,
      tip: 'You can switch between Simple Friendly Mode and Advanced Pro Mode in the header.',
    },
  ];

  const currentStep = tourSteps[step];

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
      setCurrentView(tourSteps[step + 1].view);
    } else {
      closeOnboarding();
      setCurrentView('dashboard');
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
      setCurrentView(tourSteps[step - 1].view);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-6 md:p-8 rounded-3xl clay-card bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900 shadow-2xl space-y-6 text-left">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentStep.icon}</span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Step {step + 1} of {tourSteps.length}
            </span>
          </div>
          <button onClick={closeOnboarding} className="p-1 rounded-xl text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
            {currentStep.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-slate-800/80 border border-purple-100 dark:border-purple-900 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <span>{currentStep.tip}</span>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          {tourSteps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                step === i ? 'w-6 bg-purple-600' : 'w-2 bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="px-4 py-2 text-xs font-bold text-gray-500 disabled:opacity-30 cursor-pointer flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="clay-button-primary px-6 py-2.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>{step === tourSteps.length - 1 ? 'Start Dreaming!' : 'Next Tip'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
