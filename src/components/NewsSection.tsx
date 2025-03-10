import React from 'react';
import { Newspaper } from 'lucide-react';

const NewsSection = () => {
  const news = [
    {
      title: "Présentation du PLF 2024",
      date: "15 Oct 2023",
      description: "Le projet de loi de finances 2024 prévoit une croissance de 3,7%"
    },
    {
      title: "Réforme de la compensation",
      date: "12 Oct 2023",
      description: "Nouveau système de ciblage des aides directes aux ménages"
    },
    {
      title: "Investissements régionaux",
      date: "10 Oct 2023",
      description: "Augmentation des budgets d'investissement dans les régions"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Newspaper className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-xl font-semibold">Actualités Budgétaires</h3>
      </div>
      
      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-gray-800">{item.title}</h4>
              <span className="text-sm text-gray-500">{item.date}</span>
            </div>
            <p className="text-gray-600 mt-1">{item.description}</p>
          </div>
        ))}
      </div>
      
      <button className="mt-6 w-full bg-blue-50 text-blue-600 py-2 rounded-md hover:bg-blue-100">
        Voir toutes les actualités
      </button>
    </div>
  );
};

export default NewsSection;