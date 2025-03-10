import React from 'react';
import { Book, Video, FileText, ExternalLink } from 'lucide-react';

const LearningSection = () => {
  const resources = [
    {
      type: 'guide',
      title: 'Guide du Budget',
      description: 'Comprendre les bases du budget national',
      icon: Book,
      link: '#'
    },
    {
      type: 'video',
      title: 'Le Processus Budgétaire',
      description: 'Vidéo explicative sur le cycle budgétaire',
      icon: Video,
      link: '#'
    },
    {
      type: 'glossary',
      title: 'Glossaire Budgétaire',
      description: 'Définitions des termes budgétaires',
      icon: FileText,
      link: '#'
    }
  ];

  const courses = [
    {
      title: 'Introduction au Budget National',
      duration: '30 min',
      level: 'Débutant'
    },
    {
      title: 'Analyse des Dépenses Publiques',
      duration: '45 min',
      level: 'Intermédiaire'
    },
    {
      title: 'Participation Citoyenne',
      duration: '25 min',
      level: 'Débutant'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">Espace Apprentissage</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Ressources Éducatives</h3>
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <resource.icon className="w-6 h-6 text-morocco-green mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">{resource.title}</h4>
                  <p className="text-gray-600 text-sm">{resource.description}</p>
                  <a
                    href={resource.link}
                    className="inline-flex items-center text-morocco-green hover:text-morocco-green/80 mt-2 text-sm"
                  >
                    En savoir plus
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Modules de Formation</h3>
          <div className="space-y-4">
            {courses.map((course, index) => (
              <div key={index} className="border rounded-lg p-4 hover:border-morocco-green transition-colors">
                <h4 className="font-semibold">{course.title}</h4>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>{course.duration}</span>
                  <span>•</span>
                  <span>{course.level}</span>
                </div>
                <button className="mt-3 text-morocco-green hover:text-morocco-green/80 text-sm font-medium">
                  Commencer le module
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-morocco-green/5 rounded-lg">
        <h3 className="font-semibold mb-2">Vous ne trouvez pas ce que vous cherchez ?</h3>
        <p className="text-gray-600">
          Consultez notre forum communautaire ou contactez-nous pour plus d'informations.
        </p>
        <div className="mt-4 flex space-x-4">
          <button className="bg-morocco-green text-white px-4 py-2 rounded-md hover:bg-morocco-green/90 transition-colors">
            Forum Communautaire
          </button>
          <button className="border border-morocco-green text-morocco-green px-4 py-2 rounded-md hover:bg-morocco-green/5 transition-colors">
            Nous Contacter
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningSection;