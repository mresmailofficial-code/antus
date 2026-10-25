import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  Activity, 
  Community, 
  Memory, 
  ConversationThread, 
  ChatMessage, 
  HumanIntent, 
  JaipurNeighborhood, 
  SavedItem, 
  SafetyReport 
} from '../types';
import { 
  INITIAL_CURRENT_USER, 
  SEED_USERS,
  SEED_ACTIVITIES, 
  SEED_COMMUNITIES, 
  SEED_MEMORIES, 
  SEED_CONVERSATIONS, 
  SEED_CHAT_MESSAGES 
} from '../data/jaipurSeedData';
import confetti from 'canvas-confetti';

interface HumanContextType {
  currentUser: UserProfile;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  isOnboarded: boolean;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  resetOnboarding: () => void;
  
  // Navigation & View
  activeTab: 'home' | 'explore' | 'create' | 'plans' | 'you';
  setActiveTab: (tab: 'home' | 'explore' | 'create' | 'plans' | 'you') => void;
  viewMode: 'iphone' | 'android' | 'web';
  setViewMode: (mode: 'iphone' | 'android' | 'web') => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  
  // Intent & Neighborhood Filters
  selectedIntent: HumanIntent | null;
  setSelectedIntent: (intent: HumanIntent | null) => void;
  selectedNeighborhood: JaipurNeighborhood | 'All';
  setSelectedNeighborhood: (n: JaipurNeighborhood | 'All') => void;

  // Activities
  activities: Activity[];
  selectedActivityDetail: Activity | null;
  setSelectedActivityDetail: (activity: Activity | null) => void;
  activeCoordinationActivity: Activity | null;
  setActiveCoordinationActivity: (activity: Activity | null) => void;
  joinActivity: (activityId: string) => void;
  leaveActivity: (activityId: string) => void;
  createActivity: (newActivity: Omit<Activity, 'id' | 'host' | 'participantIds' | 'isJoined'>) => Activity;

  // Communities
  communities: Community[];
  selectedCommunityDetail: Community | null;
  setSelectedCommunityDetail: (community: Community | null) => void;
  toggleJoinCommunity: (communityId: string) => void;

  // Memories
  memories: Memory[];
  addMemory: (memory: Omit<Memory, 'id'>) => void;

  // Saved Items
  savedItems: SavedItem[];
  toggleSaveItem: (type: 'activity' | 'community' | 'person' | 'place', itemId: string, title: string, subtitle: string, image: string) => void;
  isItemSaved: (itemId: string) => boolean;

  // Chat & Coordination
  conversations: ConversationThread[];
  activeChatThreadId: string | null;
  setActiveChatThreadId: (threadId: string | null) => void;
  messages: { [threadId: string]: ChatMessage[] };
  sendMessage: (threadId: string, content: string) => void;
  openDirectChatWithUser: (user: UserProfile) => void;

  // Proof of Presence
  proofOfPresenceModal: { isOpen: boolean; activity: Activity | null };
  setProofOfPresenceModal: (modal: { isOpen: boolean; activity: Activity | null }) => void;
  confirmAttendance: (activityId: string, didAttend: boolean) => void;

  // Safety & Moderation
  isSafetyCenterOpen: boolean;
  setIsSafetyCenterOpen: (open: boolean) => void;
  safetyReports: SafetyReport[];
  submitSafetyReport: (targetType: 'user' | 'activity' | 'community', targetTitle: string, reason: string, details: string) => void;
  resolveSafetyReport: (reportId: string) => void;

  // Toast notifications
  toast: { title: string; message: string; type?: 'terracotta' | 'success' } | null;
  showToast: (title: string, message: string, type?: 'terracotta' | 'success') => void;
}

const HumanContext = createContext<HumanContextType | undefined>(undefined);

export const HumanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial stored states
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    const saved = localStorage.getItem('human_onboarded');
    return saved ? JSON.parse(saved) : false;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('human_current_user');
    return saved ? JSON.parse(saved) : INITIAL_CURRENT_USER;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'create' | 'plans' | 'you'>('home');
  const [viewMode, setViewMode] = useState<'iphone' | 'android' | 'web'>('iphone');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  const [selectedIntent, setSelectedIntent] = useState<HumanIntent | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<JaipurNeighborhood | 'All'>('All');

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('human_activities');
    return saved ? JSON.parse(saved) : SEED_ACTIVITIES;
  });

  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem('human_communities');
    return saved ? JSON.parse(saved) : SEED_COMMUNITIES;
  });

  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('human_memories');
    return saved ? JSON.parse(saved) : SEED_MEMORIES;
  });

  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    const saved = localStorage.getItem('human_saved_items');
    return saved ? JSON.parse(saved) : [
      {
        id: 'save_1',
        type: 'activity',
        itemId: 'act_4',
        title: 'Silent Reading & Gentle Book Discussion',
        subtitle: 'Stepout Cafe, C-Scheme',
        image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80',
        savedAt: '2 days ago'
      }
    ];
  });

  const [conversations, setConversations] = useState<ConversationThread[]>(() => {
    const saved = localStorage.getItem('human_conversations');
    return saved ? JSON.parse(saved) : SEED_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<{ [threadId: string]: ChatMessage[] }>(() => {
    const saved = localStorage.getItem('human_messages');
    return saved ? JSON.parse(saved) : SEED_CHAT_MESSAGES;
  });

  const [selectedActivityDetail, setSelectedActivityDetail] = useState<Activity | null>(null);
  const [activeCoordinationActivity, setActiveCoordinationActivity] = useState<Activity | null>(null);
  const [selectedCommunityDetail, setSelectedCommunityDetail] = useState<Community | null>(null);
  const [activeChatThreadId, setActiveChatThreadId] = useState<string | null>(null);

  const [isSafetyCenterOpen, setIsSafetyCenterOpen] = useState<boolean>(false);
  const [safetyReports, setSafetyReports] = useState<SafetyReport[]>([
    {
      id: 'rep_1',
      reporterName: 'Anonymous Member',
      targetType: 'activity',
      targetTitle: 'Night Stargazing at Sambhar',
      reason: 'Safety question',
      details: 'Inquiring if high clearance vehicle is strictly required for the salt flats.',
      status: 'pending',
      timestamp: 'Yesterday at 3:15 PM',
    }
  ]);

  const [proofOfPresenceModal, setProofOfPresenceModal] = useState<{ isOpen: boolean; activity: Activity | null }>({
    isOpen: false,
    activity: null,
  });

  const [toast, setToast] = useState<{ title: string; message: string; type?: 'terracotta' | 'success' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('human_onboarded', JSON.stringify(isOnboarded));
  }, [isOnboarded]);

  useEffect(() => {
    localStorage.setItem('human_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('human_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('human_communities', JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem('human_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('human_saved_items', JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    localStorage.setItem('human_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('human_messages', JSON.stringify(messages));
  }, [messages]);

  const showToast = (title: string, message: string, type: 'terracotta' | 'success' = 'terracotta') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.title === title ? null : prev));
    }, 4000);
  };

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    const updated = {
      ...currentUser,
      ...data,
      isCurrentUser: true,
    };
    setCurrentUser(updated);
    setIsOnboarded(true);
    showToast('Welcome to Jaipur', `You're ready to explore ${updated.neighborhood}!`, 'success');
  };

  const resetOnboarding = () => {
    setIsOnboarded(false);
    setActiveTab('home');
  };

  const joinActivity = (activityId: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          if (act.isJoined) return act;
          const updatedParticipantIds = [...act.participantIds, currentUser.id];
          return {
            ...act,
            isJoined: true,
            participantIds: updatedParticipantIds,
          };
        }
        return act;
      })
    );

    // Update selected activity if open
    if (selectedActivityDetail?.id === activityId) {
      setSelectedActivityDetail((prev) =>
        prev
          ? {
              ...prev,
              isJoined: true,
              participantIds: [...prev.participantIds, currentUser.id],
            }
          : null
      );
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D95338', '#E06D53', '#D9943B', '#FAF8F5'],
      });
    } catch {
      // Ignore in non-window envs
    }

    showToast("You're going!", "Added to your plans. We'll remind you before it starts.", 'success');
  };

  const leaveActivity = (activityId: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          return {
            ...act,
            isJoined: false,
            participantIds: act.participantIds.filter((id) => id !== currentUser.id),
          };
        }
        return act;
      })
    );

    if (selectedActivityDetail?.id === activityId) {
      setSelectedActivityDetail((prev) =>
        prev
          ? {
              ...prev,
              isJoined: false,
              participantIds: prev.participantIds.filter((id) => id !== currentUser.id),
            }
          : null
      );
    }
    showToast('Activity left', 'Your spot has been freed for someone else.');
  };

  const createActivity = (
    newActivityData: Omit<Activity, 'id' | 'host' | 'participantIds' | 'isJoined'>
  ): Activity => {
    const id = `act_created_${Date.now()}`;
    const newActivity: Activity = {
      ...newActivityData,
      id,
      host: currentUser,
      participantIds: [currentUser.id],
      isJoined: true,
    };

    setActivities((prev) => [newActivity, ...prev]);

    // Create a coordination thread for it
    const newThreadId = `thread_${id}`;
    const newThread: ConversationThread = {
      id: newThreadId,
      type: 'activity',
      title: `${newActivity.title} Coordination`,
      subtitle: `${newActivity.venueName} · ${newActivity.displayDate}`,
      avatar: newActivity.coverImage,
      lastMessage: `${currentUser.name}: Welcome! I will be hosting this activity.`,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      activityId: id,
      participantCount: 1,
      contextReason: 'Activity Coordination Space',
    };

    setConversations((prev) => [newThread, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newThreadId]: [
        {
          id: `msg_init_${Date.now()}`,
          threadId: newThreadId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          content: `Welcome to ${newActivity.title}! I'm hosting this at ${newActivity.venueName}. Let me know if you have any questions before we meet.`,
          timestamp: 'Just now',
          isHost: true,
        },
      ],
    }));

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D95338', '#E06D53', '#D9943B'],
      });
    } catch {
      // ignore
    }

    showToast('Activity Published!', 'People in Jaipur can now discover and join your activity.', 'success');
    return newActivity;
  };

  const toggleJoinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          const willJoin = !c.isMember;
          return {
            ...c,
            isMember: willJoin,
            memberCount: willJoin ? c.memberCount + 1 : c.memberCount - 1,
          };
        }
        return c;
      })
    );

    const comm = communities.find((c) => c.id === communityId);
    if (comm) {
      const willJoin = !comm.isMember;
      showToast(
        willJoin ? `Joined ${comm.name}` : `Left ${comm.name}`,
        willJoin ? 'You will see their upcoming activities and announcements.' : 'Community removed from your list.',
        willJoin ? 'success' : 'terracotta'
      );
    }
  };

  const addMemory = (memoryData: Omit<Memory, 'id'>) => {
    const newMemory: Memory = {
      ...memoryData,
      id: `mem_${Date.now()}`,
    };
    setMemories((prev) => [newMemory, ...prev]);

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.5 },
        colors: ['#D95338', '#E06D53', '#D9943B'],
      });
    } catch {
      // ignore
    }

    showToast('You made a memory.', 'Saved privately to your memory timeline.', 'success');
  };

  const toggleSaveItem = (
    type: 'activity' | 'community' | 'person' | 'place',
    itemId: string,
    title: string,
    subtitle: string,
    image: string
  ) => {
    const existing = savedItems.find((s) => s.itemId === itemId);
    if (existing) {
      setSavedItems((prev) => prev.filter((s) => s.itemId !== itemId));
      showToast('Item removed', 'Removed from your saved list.');
    } else {
      const newItem: SavedItem = {
        id: `save_${Date.now()}`,
        type,
        itemId,
        title,
        subtitle,
        image,
        savedAt: 'Just now',
      };
      setSavedItems((prev) => [newItem, ...prev]);
      showToast('Saved to You', 'Accessible whenever you want.', 'success');
    }
  };

  const isItemSaved = (itemId: string): boolean => {
    return savedItems.some((s) => s.itemId === itemId);
  };

  const sendMessage = (threadId: string, content: string) => {
    if (!content.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      threadId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content,
      timestamp: 'Just now',
    };

    setMessages((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            lastMessage: `${currentUser.name}: ${content}`,
            lastMessageTime: 'Just now',
          };
        }
        return thread;
      })
    );

    // Realistic auto-reply simulation after 1.5s if talking to Kabir or Meera
    if (threadId === 'thread_direct_kabir') {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          threadId,
          senderId: 'user_kabir',
          senderName: 'Kabir Mehta',
          senderAvatar: SEED_USERS[1].avatar,
          content: "Absolutely! Let's definitely catch up at Tapri tomorrow after the walk.",
          timestamp: 'Just now',
        };
        setMessages((prev) => ({
          ...prev,
          [threadId]: [...(prev[threadId] || []), replyMsg],
        }));
      }, 1400);
    }
  };

  const openDirectChatWithUser = (user: UserProfile) => {
    const existingThread = conversations.find(
      (c) => c.type === 'direct' && c.title.toLowerCase() === user.name.toLowerCase()
    );

    if (existingThread) {
      setActiveChatThreadId(existingThread.id);
      setActiveTab('plans'); // Messages lives in plans/coordination
    } else {
      const newThreadId = `thread_direct_${user.id}`;
      const newThread: ConversationThread = {
        id: newThreadId,
        type: 'direct',
        title: user.name,
        subtitle: user.headline || user.neighborhood,
        avatar: user.avatar,
        lastMessage: 'Started conversation',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        contextReason: `You both share interest in ${user.interests.slice(0, 2).join(' & ')}`,
      };
      setConversations((prev) => [newThread, ...prev]);
      setActiveChatThreadId(newThreadId);
      setActiveTab('plans');
    }
  };

  const confirmAttendance = (activityId: string, didAttend: boolean) => {
    setProofOfPresenceModal({ isOpen: false, activity: null });
    if (didAttend) {
      updateCurrentUser({
        completedActivitiesCount: currentUser.completedActivitiesCount + 1,
        attendanceRate: Math.min(100, currentUser.attendanceRate + 1),
      });

      // Suggest creating a memory
      const targetActivity = activities.find((a) => a.id === activityId);
      if (targetActivity) {
        addMemory({
          activityTitle: targetActivity.title,
          activityId: targetActivity.id,
          neighborhood: targetActivity.neighborhood,
          dateString: 'Today',
          story: `Showed up at ${targetActivity.venueName} for ${targetActivity.title}. Great people and genuine conversations in ${targetActivity.neighborhood}!`,
          photos: [targetActivity.coverImage],
          participants: [
            { name: currentUser.name, avatar: currentUser.avatar },
            { name: targetActivity.host.name, avatar: targetActivity.host.avatar },
          ],
          privacy: 'friends',
        });
      }
      showToast('Attendance Verified', 'Your reliability score has been updated.', 'success');
    } else {
      showToast('Thanks for confirming', 'Helps keep our real-world records honest.');
    }
  };

  const submitSafetyReport = (
    targetType: 'user' | 'activity' | 'community',
    targetTitle: string,
    reason: string,
    details: string
  ) => {
    const report: SafetyReport = {
      id: `rep_${Date.now()}`,
      reporterName: currentUser.name,
      targetType,
      targetTitle,
      reason,
      details,
      status: 'pending',
      timestamp: 'Just now',
    };
    setSafetyReports((prev) => [report, ...prev]);
    showToast('Report Submitted', 'Our Jaipur safety team reviews reports within 2 hours.');
  };

  const resolveSafetyReport = (reportId: string) => {
    setSafetyReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
    );
    showToast('Report Resolved', 'Action logged in audit trail.');
  };

  return (
    <HumanContext.Provider
      value={{
        currentUser,
        updateCurrentUser,
        isOnboarded,
        completeOnboarding,
        resetOnboarding,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        isAdminMode,
        setIsAdminMode,
        selectedIntent,
        setSelectedIntent,
        selectedNeighborhood,
        setSelectedNeighborhood,
        activities,
        selectedActivityDetail,
        setSelectedActivityDetail,
        activeCoordinationActivity,
        setActiveCoordinationActivity,
        joinActivity,
        leaveActivity,
        createActivity,
        communities,
        selectedCommunityDetail,
        setSelectedCommunityDetail,
        toggleJoinCommunity,
        memories,
        addMemory,
        savedItems,
        toggleSaveItem,
        isItemSaved,
        conversations,
        activeChatThreadId,
        setActiveChatThreadId,
        messages,
        sendMessage,
        openDirectChatWithUser,
        proofOfPresenceModal,
        setProofOfPresenceModal,
        confirmAttendance,
        isSafetyCenterOpen,
        setIsSafetyCenterOpen,
        safetyReports,
        submitSafetyReport,
        resolveSafetyReport,
        toast,
        showToast,
      }}
    >
      {children}
    </HumanContext.Provider>
  );
};

export const useHuman = (): HumanContextType => {
  const context = useContext(HumanContext);
  if (!context) {
    throw new Error('useHuman must be used within a HumanProvider');
  }
  return context;
};
