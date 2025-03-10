import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Share2, Flag, Clock, Users, Search } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';
import useForumStore from '../hooks/useForumStore';
import { useAuthStore } from '../stores/authStore';

const ForumSection = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: [] });
  const [sharePostId, setSharePostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    posts,
    searchResults,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    searchPosts,
    subscribeToUpdates
  } = useForumStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPosts();
    const unsubscribe = subscribeToUpdates();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    searchPosts(searchQuery);
  }, [searchQuery, posts]);

  const handleNewPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await createPost({
      title: newPost.title,
      content: newPost.content,
      tags: newPost.tags,
      user_id: user.id
    });

    setShowNewPostForm(false);
    setNewPost({ title: '', content: '', tags: [] });
  };

  const handleLike = async (postId: string, currentLikes: number) => {
    if (!user) return;
    await updatePost(postId, { likes: currentLikes + 1 });
  };

  const displayPosts = searchQuery ? searchResults : posts;
  const shareUrl = 'https://mizaniyatona.ma/forum';
  const shareTitle = 'Mizaniyatona - Forum Budgétaire';

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-8">Erreur: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Forum Communautaire</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-morocco-green"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={() => setShowNewPostForm(true)}
            className="bg-morocco-green text-white px-4 py-2 rounded-md hover:bg-morocco-green/90 transition-colors"
          >
            Nouvelle Discussion
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          {['discussions', 'populaire', 'récent'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 -mb-px ${
                activeTab === tab
                  ? 'border-b-2 border-morocco-green text-morocco-green font-semibold'
                  : 'text-gray-500 hover:text-morocco-green'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {displayPosts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4 hover:border-morocco-green transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold hover:text-morocco-green cursor-pointer">
                  {post.title}
                </h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {post.author?.email}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {format(new Date(post.created_at), 'dd MMM yyyy', { locale: fr })}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSharePostId(sharePostId === post.id ? null : post.id)}
                  className="p-2 text-gray-600 hover:text-morocco-green rounded-full hover:bg-gray-100"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-morocco-green rounded-full hover:bg-gray-100">
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {sharePostId === post.id && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Partager</h4>
                <div className="flex space-x-2">
                  <FacebookShareButton url={shareUrl} quote={shareTitle}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={shareUrl} title={shareTitle}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <LinkedinShareButton url={shareUrl} title={shareTitle}>
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                  <WhatsappShareButton url={shareUrl} title={shareTitle}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
              <button
                onClick={() => handleLike(post.id, post.likes)}
                className="flex items-center space-x-1 hover:text-morocco-green"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-morocco-green">
                <MessageSquare className="w-4 h-4" />
                <span>{post.replies_count} réponses</span>
              </button>
              <span className="flex items-center space-x-1">
                <span>{post.views} vues</span>
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-morocco-green hover:text-white cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showNewPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Nouvelle Discussion</h3>
            <form onSubmit={handleNewPost}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-morocco-green focus:ring focus:ring-morocco-green focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu
                </label>
                <MDEditor
                  value={newPost.content}
                  onChange={(value) => setNewPost({ ...newPost, content: value || '' })}
                  preview="edit"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={newPost.tags.join(', ')}
                  onChange={(e) => setNewPost({
                    ...newPost,
                    tags: e.target.value.split(',').map(tag => tag.trim())
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-morocco-green focus:ring focus:ring-morocco-green focus:ring-opacity-50"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-morocco-green text-white px-4 py-2 rounded-md hover:bg-morocco-green/90 transition-colors"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumSection;