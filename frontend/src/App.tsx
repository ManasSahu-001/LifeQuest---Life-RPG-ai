import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { ToastProvider } from './context/ToastContext.js';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout.js';
import { GameLayout } from './components/layout/GameLayout.js';

// Public Pages
import { LandingPage } from './pages/public/LandingPage.js';
import { FeaturesPage } from './pages/public/FeaturesPage.js';
import { HowItWorksPage } from './pages/public/HowItWorksPage.js';
import { AboutPage } from './pages/public/AboutPage.js';
import { FAQPage } from './pages/public/FAQPage.js';
import { LoginPage } from './pages/public/LoginPage.js';
import { SignupPage } from './pages/public/SignupPage.js';

// Authenticated Game Pages
import { DashboardPage } from './pages/app/DashboardPage.js';
import { QuestsPage } from './pages/app/QuestsPage.js';
import { CharacterPage } from './pages/app/CharacterPage.js';
import { CityPage } from './pages/app/CityPage.js';
import { InventoryPage } from './pages/app/InventoryPage.js';
import { AchievementsPage } from './pages/app/AchievementsPage.js';
import { BossPage } from './pages/app/BossPage.js';
import { CampaignsPage } from './pages/app/CampaignsPage.js';
import { JourneyPage } from './pages/app/JourneyPage.js';
import { TreasuryPage } from './pages/app/TreasuryPage.js';

import { ParticleCanvas } from './components/shared/ParticleCanvas.js';
import { ThemeSelector } from './components/shared/ThemeSelector.js';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <ParticleCanvas />
          <ThemeSelector />
          <BrowserRouter>
            <Routes>
              {/* Public SEO Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </Route>

              {/* Authenticated Game Routes */}
              <Route path="/app" element={<GameLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="quests" element={<QuestsPage />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="journey" element={<JourneyPage />} />
                <Route path="city" element={<CityPage />} />
                <Route path="treasury" element={<TreasuryPage />} />
                <Route path="character" element={<CharacterPage />} />
                <Route path="stats" element={<CharacterPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="achievements" element={<AchievementsPage />} />
                <Route path="boss" element={<BossPage />} />
              </Route>

              {/* Fallback Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
