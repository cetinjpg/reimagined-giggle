export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  discordId?: string;
  rank: string;
  badge: string;
  workTime: number;
  salary: number;
  avatar?: string;
  joinDate: Date;
  lastPromotion?: Date;
  isActive: boolean;
}

export interface PromotionData {
  userName: string;
  workTime: number;
  badge: string;
  rank: string;
  currentWorkTime?: number;
}

export interface PromotionResult {
  success: boolean;
  message: string;
  nextRank?: string;
  badge?: string;
  requiredTime?: number;
  remainingTime?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  category: string;
  avatar: string;
  rank: string;
  discordId?: string;
}

export interface Award {
  id: string;
  title: string;
  winner: string;
  votes: number;
  totalVotes: number;
  percentage: number;
}

export interface Supporter {
  id: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'emerald' | 'platinum' | 'ruby' | 'jade';
  contribution: number;
}

export interface DiscordActivity {
  id: string;
  userId: string;
  type: 'promotion' | 'salary' | 'join' | 'leave' | 'achievement';
  message: string;
  timestamp: Date;
}

export type Theme = 'light' | 'dark';

export interface AppState {
  user: User | null;
  theme: Theme;
  isAuthenticated: boolean;
  currentPage: string;
  sidebarCollapsed: boolean;
}