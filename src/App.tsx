import React, { useState, useEffect } from 'react';
import { BarChart3, Users, BrainCircuit, UserCircle } from 'lucide-react';
import DashboardChart from './components/DashboardChart';
import NewsSection from './components/NewsSection';
import ParticipationSection from './components/ParticipationSection';
import ChatbotSection from './components/ChatbotSection';
import LearningSection from './components/LearningSection';
import ForumSection from './components/ForumSection';
import { AuthModal } from './components/AuthModal';
import { useAuthStore } from './stores/authStore';
import { supabase } from './lib/supabase';
import FeatureCard from './components/FeatureCard'; // Import the FeatureCard component

function App() {
  const [language, setLanguage] = useState('fr');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, setUser, signOut } = useAuthStore();

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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-gradient-to-r from-morocco-green to-morocco-red text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Mizaniyatona</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#dashboard" className="hover:text-emerald-200">Tableau de bord</a>
              <a href="#forum" className="hover:text-emerald-200">Forum</a>
              <a href="#learning" className="hover:text-emerald-200">Apprentissage</a>
              <a href="#participation" className="hover:text-emerald-200">Participation</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <FeatureCard 
            icon={<BarChart3 className="w-8 h-8 text-morocco-green" />}
            title="Visualisation Interactive"
            description="Explorez les données budgétaires régionales du Maroc à travers des graphiques dynamiques"
          />
          <FeatureCard 
            icon={<BrainCircuit className="w-8 h-8 text-morocco-red" />}
            title="Assistant IA"
            description="Posez vos questions sur le budget et obtenez des réponses instantanées"
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 text-morocco-green" />}
            title="Participation Citoyenne"
            description="Exprimez vos priorités et participez aux discussions budgétaires"
          />
        </div>

        {/* Dashboard Section */}
        <section id="dashboard" className="mb-16 border-2 border-blue-500 p-4">
          <h2 className="text-2xl font-bold mb-6">Tableau de Bord Budgétaire</h2>
          <DashboardChart />
        </section>

        {/* Forum, Learning, and Other Sections */}
        <ForumSection />
        <LearningSection />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <NewsSection />
          <ParticipationSection />
        </div>

        {/* Chatbot Section */}
        <ChatbotSection />
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default App;
