import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('liferpg_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear it
      localStorage.removeItem('liferpg_token');
    }
    return Promise.reject(error);
  }
);

// API Service functions
export const api = {
  // Direct HTTP methods
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  patch: apiClient.patch.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),

  // Auth
  signup: (data: { email: string; password: string; characterName?: string; theme?: string }) =>
    apiClient.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/auth/me'),

  // Quests
  getQuests: (params?: { category?: string; status?: string }) =>
    apiClient.get('/quests', { params }),
  getQuestById: (id: number) => apiClient.get(`/quests/${id}`),
  createQuest: (data: {
    title: string;
    description?: string;
    category?: string;
    difficulty?: string;
    priority?: string;
    due_date?: string | null;
  }) => apiClient.post('/quests', data),
  updateQuest: (id: number, data: any) => apiClient.patch(`/quests/${id}`, data),
  deleteQuest: (id: number) => apiClient.delete(`/quests/${id}`),
  completeQuest: (id: number) => apiClient.post(`/quests/${id}/complete`),

  // Character
  getCharacter: () => apiClient.get('/character'),
  updateCharacter: (data: { name?: string; title?: string; avatar_url?: string }) =>
    apiClient.patch('/character', data),
  getTransactions: () => apiClient.get('/character/transactions'),

  // Theme
  updateTheme: (theme: string) => apiClient.patch('/user/theme', { theme }),

  // Achievements
  getAchievements: () => apiClient.get('/achievements'),

  // Rewards Store
  getRewards: () => apiClient.get('/rewards'),
  purchaseReward: (rewardId: number) => apiClient.post(`/rewards/${rewardId}/purchase`),
  claimReward: (userRewardId: number) => apiClient.post(`/rewards/claims/${userRewardId}`),

  // World Boss
  getBoss: (theme?: string) => apiClient.get('/boss', { params: theme ? { theme } : undefined }),
  attackBoss: (damage?: number, bossId?: number) => apiClient.post('/boss/attack', { damage, bossId }),


  // Skill Tree
  getSkills: () => apiClient.get('/skills'),
  unlockSkill: (skillId: number) => apiClient.post(`/skills/${skillId}/unlock`),
};
