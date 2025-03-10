import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OpenAI from 'openai';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const ChatbotSection = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Reset messages when language changes
    setMessages([{ id: 1, text: t('chatbot.welcome'), isUser: false }]);
  }, [i18n.language, t]);

  const generateResponse = async (userMessage: string) => {
    setIsTyping(true);
    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant specialized in Moroccan budget data. 
                     Respond in ${i18n.language === 'fr' ? 'French' : i18n.language === 'ar' ? 'Arabic' : 'Tamazight'}.
                     Keep responses concise and focused on budget-related information.`
          },
          { role: "user", content: userMessage }
        ],
        model: "gpt-3.5-turbo",
      });

      return completion.choices[0]?.message?.content || "Je ne peux pas répondre pour le moment.";
    } catch (error) {
      console.error('Error generating response:', error);
      return "Désolé, je rencontre des difficultés techniques.";
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const botResponse = await generateResponse(input);
    
    const botMessage: Message = {
      id: messages.length + 2,
      text: botResponse,
      isUser: false
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const suggestions = t('chatbot.suggestions', { returnObjects: true }) as string[];

  return (
    <>
      <button 
        className="fixed bottom-4 right-4 bg-morocco-red text-white p-4 rounded-full shadow-lg hover:bg-morocco-green transition-colors z-50"
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir le chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl z-50">
          <div className="flex items-center justify-between bg-morocco-green text-white p-4 rounded-t-lg">
            <h3 className="font-semibold">Assistant Budgétaire</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-morocco-red text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chatbot.placeholder')}
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-morocco-green"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                className="bg-morocco-green text-white px-4 py-2 rounded-lg hover:bg-morocco-green/90 disabled:opacity-50"
                disabled={isTyping}
              >
                Envoyer
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInput(suggestion)}
                  className="text-sm bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1"
                  disabled={isTyping}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotSection;