import React, { useState, useEffect } from 'react';
import { BarChart3, Users, BrainCircuit, LogOut } from 'lucide-react';
import DashboardChart from './components/DashboardChart';
import NewsSection from './components/NewsSection';
import ParticipationSection from './components/ParticipationSection';
import ChatbotSection from './components/ChatbotSection';
import LearningSection from './components/LearningSection';
import ForumSection from './components/ForumSection';
import { AuthModal } from './components/AuthModal';
import { useAuthStore } from './stores/authStore';
import { supabase } from './lib/supabase';
import FeatureCard from './components/FeatureCard';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from 'react-i18next';

function App() {
  const [language, setLanguage] = useState('fr');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, setUser, signOut } = useAuthStore();
  const { t } = useTranslation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [setUser]);

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-gradient-to-r from-morocco-green to-morocco-red text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{t('Mizaniyatona')}</h1>
            <nav className="hidden md:flex space-x-6 items-center">
              <LanguageSelector setLanguage={setLanguage} language={language} />
              {user ? (
                <button onClick={signOut} className="flex items-center hover:text-emerald-200">
                  <LogOut className="mr-1" />
                  {t('Sign Out')}
                </button>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-emerald-200">
                  {t('Sign In / Sign Up')}
                </button>
              )}
              <a href="#dashboard" className="hover:text-emerald-200">{t('Dashboard')}</a>
              <a href="#forum" className="hover:text-emerald-200">{t('Forum')}</a>
              <a href="#learning" className="hover:text-emerald-200">{t('Learning')}</a>
              <a href="#participation" className="hover:text-emerald-200">{t('Participation')}</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8 text-morocco-green" />}
            title={t('Interactive Visualization')}
            description={t('Explore regional budget data through dynamic graphs')}
          />
          <FeatureCard
            icon={<BrainCircuit className="w-8 h-8 text-morocco-red" />}
            title={t('AI Assistant')}
            description={t('Ask questions about the budget and get instant answers')}
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-morocco-green" />}
            title={t('Citizen Participation')}
            description={t('Express your priorities and participate in budget discussions')}
          />
        </div>

        <section id="dashboard" className="mb-16 border-2 border-blue-500 p-4">
          <h2 className="text-2xl font-bold mb-6">{t('Budget Dashboard')}</h2>
          <DashboardChart />
        </section>

        <ForumSection />
        <LearningSection />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <NewsSection />
          <ParticipationSection />
        </div>

        <ChatbotSection />
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default App;