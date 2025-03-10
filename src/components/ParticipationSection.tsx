import React from 'react';
import { MessageSquare, ThumbsUp } from 'lucide-react';

const ParticipationSection = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <MessageSquare className="w-6 h-6 text-emerald-600 mr-2" />
        <h3 className="text-xl font-semibold">Espace Participation Citoyenne</h3>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-3">Sondage en cours</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-3">Quelles sont vos priorités budgétaires pour 2024 ?</p>
          <div className="space-y-2">
            {[
              "Éducation et formation",
              "Santé publique",
              "Infrastructure et transport",
              "Développement rural"
            ].map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" name="priority" id={`option-${index}`} className="text-emerald-600" />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
          </div>
          <button className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700">
            Voter
          </button>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Discussions Récentes</h4>
        <div className="space-y-3">
          {[
            {
              title: "Impact du budget sur l'éducation",
              comments: 24,
              likes: 45
            },
            {
              title: "Projets d'infrastructure régionaux",
              comments: 18,
              likes: 32
            }
          ].map((topic, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{topic.title}</span>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {topic.comments}
                </span>
                <span className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {topic.likes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParticipationSection;