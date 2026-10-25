export type JaipurNeighborhood = 
  | 'C-Scheme'
  | 'Malviya Nagar'
  | 'Raja Park'
  | 'Vaishali Nagar'
  | 'MI Road / Pink City'
  | 'Jawahar Circle'
  | 'Tonk Road';

export type HumanIntent = 
  | 'talk'       // ❤️ Talk – “I want someone to talk to.”
  | 'connect'    // 🤝 Connect – “I want to meet people.”
  | 'create'     // 🎭 Create – “I want to create something.”
  | 'experience' // 🎉 Experience – “I want to do something fun.”
  | 'grow'       // 🌱 Grow – “I want to learn.”
  | 'belong'     // 🏠 Belong – “I want to find my community.”
  | 'play'       // 🏃 Play – “I want to get active.”
  | 'surprise';  // ✨ Surprise me – “Show me something unexpected.”

export type ActivityCategory = 
  | 'Photography'
  | 'Sports & Fitness'
  | 'Music'
  | 'Art & Design'
  | 'Books & Writing'
  | 'Food & Cooking'
  | 'Tech & Startups'
  | 'Travel & Heritage'
  | 'Learning';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  headline?: string;
  bio: string;
  city: string; // Jaipur
  neighborhood: JaipurNeighborhood;
  interests: string[];
  peoplePreferences: string[];
  intents: string[];
  isVerified: boolean;
  attendanceRate: number; // e.g. 98%
  completedActivitiesCount: number;
  reliabilityBadge: string;
  joinedCommunities: string[];
  isCurrentUser?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  intent: HumanIntent;
  category: ActivityCategory;
  neighborhood: JaipurNeighborhood;
  venueName: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  startTime: string; // ISO date string or formatted time
  displayDate: string; // e.g., "Today · 6:30 PM" or "Saturday · 6:00 PM"
  durationMinutes: number;
  capacity: number;
  participantIds: string[];
  host: UserProfile;
  isPaid: boolean;
  priceINR: number;
  experienceLevel: 'Beginner friendly' | 'All levels' | 'Intermediate' | 'Advanced';
  whatToBring: string[];
  meetingPointDetails: string;
  safetyNotice: string;
  coverImage: string;
  communityId?: string;
  communityName?: string;
  isJoined?: boolean;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  neighborhood?: JaipurNeighborhood;
  coverImage: string;
  memberCount: number;
  isVerified: boolean;
  rules: string[];
  organizer: UserProfile;
  upcomingActivityIds: string[];
  isMember?: boolean;
  announcements: {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    timeAgo: string;
  }[];
}

export interface Memory {
  id: string;
  activityTitle: string;
  activityId?: string;
  neighborhood: JaipurNeighborhood;
  dateString: string;
  story: string;
  photos: string[];
  voiceNoteDuration?: string;
  participants: {
    name: string;
    avatar: string;
  }[];
  privacy: 'only_me' | 'friends' | 'community' | 'public';
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isHost?: boolean;
  isAnnouncement?: boolean;
  reactions?: { [emoji: string]: number };
}

export interface ConversationThread {
  id: string;
  type: 'direct' | 'activity' | 'community';
  title: string;
  subtitle?: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  contextReason?: string; // e.g. "You both love photography & C-Scheme cafes"
  activityId?: string;
  participantCount?: number;
}

export interface SafetyReport {
  id: string;
  reporterName: string;
  targetType: 'user' | 'activity' | 'community';
  targetTitle: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved';
  timestamp: string;
}

export interface SavedItem {
  id: string;
  type: 'activity' | 'community' | 'person' | 'place';
  itemId: string;
  title: string;
  subtitle: string;
  image: string;
  savedAt: string;
}
