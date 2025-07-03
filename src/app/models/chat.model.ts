export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  edited?: boolean;
  reactions?: Reaction[];
}

export interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  type: 'direct' | 'group';
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  isTyping?: string[];
}

export interface TypingIndicator {
  roomId: string;
  userId: string;
  userName: string;
}