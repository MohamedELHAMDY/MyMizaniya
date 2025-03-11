import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import Fuse from 'fuse.js';

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes: number;
  views: number;
  tags: string[];
  author?: {
    email: string;
  };
  replies_count?: number;
}

interface ForumState {
  posts: ForumPost[];
  searchResults: ForumPost[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  fetchPosts: () => Promise<void>;
  createPost: (post: Partial<ForumPost>) => Promise<void>;
  updatePost: (id: string, updates: Partial<ForumPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  searchPosts: (query: string) => void;
  subscribeToUpdates: () => () => void;
}

const useForumStore = create<ForumState>((set, get) => ({
  posts: [],
  searchResults: [],
  loading: false,
  error: null,
  searchQuery: '',

  fetchPosts: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          author:users(email),
          replies_count:forum_replies(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ posts: data || [], loading: false, error: null });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createPost: async (post) => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert([post])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ posts: [data, ...state.posts], error: null }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  updatePost: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        posts: state.posts.map((post) => (post.id === id ? { ...post, ...data } : post)),
        error: null
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deletePost: async (id) => {
    try {
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== id),
        error: null
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  searchPosts: (query) => {
    const fuse = new Fuse(get().posts, {
      keys: ['title', 'content', 'tags'],
      threshold: 0.3,
    });

    const results = query ? fuse.search(query).map(result => result.item) : get().posts;
    set({ searchResults: results, searchQuery: query });
  },

  subscribeToUpdates: () => {
    const subscription = supabase
      .channel('forum_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_posts'
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          
          switch (eventType) {
            case 'INSERT':
              set((state) => ({ posts: [newRecord, ...state.posts] }));
              break;
            case 'UPDATE':
              set((state) => ({
                posts: state.posts.map((post) =>
                  post.id === oldRecord.id ? { ...post, ...newRecord } : post
                )
              }));
              break;
            case 'DELETE':
              set((state) => ({
                posts: state.posts.filter((post) => post.id !== oldRecord.id)
              }));
              break;
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
}));

export default useForumStore;