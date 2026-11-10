/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { DataProvider, useData } from './context/DataContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { BoardEditorView } from './components/boards/BoardEditorView';
import { DreamRoomsView } from './components/rooms/DreamRoomsView';
import { DreamGarden } from './components/features/DreamGarden';
import { DreamDependencyMap } from './components/features/DreamDependencyMap';
import { DreamDriftDetector } from './components/features/DreamDriftDetector';
import { DreamMemoryWall } from './components/features/DreamMemoryWall';
import { AchievementRoom } from './components/features/AchievementRoom';

import { AiActionConverterModal } from './components/ai/AiActionConverterModal';
import { ThemeStudioModal } from './components/features/ThemeStudioModal';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingTour } from './components/accessibility/OnboardingTour';

const MainAppContent: React.FC = () => {
  const { currentView, isAiModalOpen, closeAiModal, aiInitialPrompt } = useData();

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div>
        <Navbar />
        <main className="w-full">
          {currentView === 'landing' && <LandingPage />}
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'board-editor' && <BoardEditorView />}
          {currentView === 'rooms' && <DreamRoomsView />}
          {currentView === 'garden' && <DreamGarden />}
          {currentView === 'dependencies' && <DreamDependencyMap />}
          {currentView === 'drift' && <DreamDriftDetector />}
          {currentView === 'memories' && <DreamMemoryWall />}
          {currentView === 'achievements' && <AchievementRoom />}
        </main>
      </div>

      <Footer />

      {/* Global Modals */}
      <AiActionConverterModal
        isOpen={isAiModalOpen}
        onClose={closeAiModal}
        initialPrompt={aiInitialPrompt}
      />
      <ThemeStudioModal />
      <AuthModal />
      <OnboardingTour />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AccessibilityProvider>
          <DataProvider>
            <MainAppContent />
          </DataProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
