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
import FeatureCard from './components/FeatureCard';

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

    return () => subscription.unsubscribe();
  }, [setUser]); // Add setUser to dependency array

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-gradient-to-r from-morocco-green to-morocco-red text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.unsplash.com/photo-1558246385-c14b48911485?auto=format&fit=crop&w=48&h=32" 
                alt="Drapeau du Maroc" 
                className="h-8 w-auto"
              />
              <h1 className="text-3xl font-bold">Mizaniyatona</h1>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <a href="#dashboard" className="hover:text-emerald-200">Tableau de bord</a>
                <a href="#forum" className="hover:text-emerald-200">Forum</a>
                <a href="#learning" className="hover:text-emerald-200">Apprentissage</a>
                <a href="#participation" className="hover:text-emerald-200">Participation</a>
              </nav>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setLanguage('fr')}
                    className={`px-2 py-1 rounded ${language === 'fr' ? 'bg-white/20' : ''}`}
                  >
                    FR
                  </button>
                  <button 
                    onClick={() => setLanguage('ar')}
                    className={`px-2 py-1 rounded ${language === 'ar' ? 'bg-white/20' : ''}`}
                  >
                    عربية
                  </button>
                  <button 
                    onClick={() => setLanguage('ber')}
                    className={`px-2 py-1 rounded ${language === 'ber' ? 'bg-white/20' : ''}`}
                  >
                    ⵜⴰⵎⴰⵣⵉⵖⵜ
                  </button>
                </div>
                {user ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 hover:bg-white/20 rounded-full p-2">
                      <UserCircle className="w-6 h-6" />
                      <span className="text-sm">{user.email}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                      <div className="py-1">
                        <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Profile
                        </a>
                        <a href="/preferences" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Préférences
                        </a>
                        <button
                          onClick={() => signOut()}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md transition-colors"
                  >
                    Connexion
                  </button>
                )}
              </div>
            </div>
          </div>
          <p className="mt-4 text-xl">Plateforme de transparence budgétaire du Maroc</p>
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
        <section id="dashboard" className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Tableau de Bord Budgétaire</h2>
          <DashboardChart />
        </section>

        {/* Forum Section */}
        <section id="forum" className="mb-16">
          <ForumSection />
        </section>

        {/* Learning Section */}
        <section id="learning" className="mb-16">
          <LearningSection />
        </section>

        {/* News and Participation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <NewsSection />
          <ParticipationSection />
        </div>

        {/* Chatbot Section */}
        <ChatbotSection />
      </main>

      <footer className="bg-morocco-green text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Mizaniyatona</h3>
              <p>Promouvoir la transparence budgétaire et la participation citoyenne au Maroc.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens Rapides</h4>
              <ul className="space-y-2">
                <li><a href="#dashboard" className="hover:text-emerald-200">Tableau de bord</a></li>
                <li><a href="#forum" className="hover:text-emerald-200">Forum</a></li>
                <li><a href="#learning" className="hover:text-emerald-200">Apprentissage</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p>contact@mizaniyatona.ma</p>
              <p>Suivez-nous sur les réseaux sociaux</p>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default App;