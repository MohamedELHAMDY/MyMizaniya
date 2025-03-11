import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from 'react-i18next';
import { Github, Google } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, signUp, signInWithGoogle, signInWithGithub, loading } = useAuthStore();
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setError('');
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithGithub();
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">{isLogin ? t('Sign In') : t('Sign Up')}</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {loading && <p>{t('Loading...')}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-morocco-green focus:ring focus:ring-morocco-green focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-morocco-green focus:ring focus:ring-morocco-green focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-morocco-green text-white py-2 px-4 rounded-md hover:bg-morocco-green/90 transition-colors"
          >
            {isLogin ? t('Sign In') : t('Sign Up')}
          </button>
        </form>
        <div className="flex justify-center mt-4">
          <button onClick={() => handleSocialSignIn('google')} className="mx-2">
            <Google />
          </button>
          <button onClick={() => handleSocialSignIn('github')} className="mx-2">
            <Github />
          </button>
        </div>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-sm text-gray-600 hover:text-morocco-green"
        >
          {isLogin ? t("Don't have an account? Sign Up") : t('Already have an account? Sign In')}
        </button>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
    </div>
  );
};