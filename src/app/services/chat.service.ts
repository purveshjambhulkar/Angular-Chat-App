import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatRoom, Message, User, TypingIndicator } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private currentUser: User = {
    id: 'user-1',
    name: 'You',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    status: 'online'
  };

  private users: User[] = [
    this.currentUser,
    {
      id: 'user-2',
      name: 'Alice Johnson',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      status: 'online'
    },
    {
      id: 'user-3',
      name: 'Bob Smith',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      status: 'away'
    },
    {
      id: 'user-4',
      name: 'Carol Davis',
      avatar: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      status: 'offline',
      lastSeen: new Date(Date.now() - 3600000)
    },
    {
      id: 'user-5',
      name: 'David Wilson',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      status: 'online'
    },
    {
      id: 'user-6',
      name: 'Emma Brown',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      status: 'online'
    }
  ];

  private chatRooms: ChatRoom[] = [
    {
      id: 'room-1',
      name: 'Alice Johnson',
      type: 'direct',
      participants: [this.currentUser, this.users[1]],
      messages: [
        {
          id: 'msg-1',
          senderId: 'user-2',
          content: 'Hey! How are you doing today?',
          timestamp: new Date(Date.now() - 3600000),
          type: 'text'
        },
        {
          id: 'msg-2',
          senderId: 'user-1',
          content: 'I\'m doing great! Just working on some new projects. How about you?',
          timestamp: new Date(Date.now() - 3500000),
          type: 'text'
        },
        {
          id: 'msg-3',
          senderId: 'user-2',
          content: 'That sounds exciting! I\'d love to hear more about your projects.',
          timestamp: new Date(Date.now() - 3400000),
          type: 'text'
        },
        {
          id: 'msg-4',
          senderId: 'user-1',
          content: 'Sure! I\'m building a new chat application with Angular. It\'s been really fun to work on.',
          timestamp: new Date(Date.now() - 3300000),
          type: 'text'
        },
        {
          id: 'msg-5',
          senderId: 'user-2',
          content: 'Wow, that\'s amazing! Angular is such a powerful framework. Are you using any specific UI libraries?',
          timestamp: new Date(Date.now() - 1800000),
          type: 'text'
        }
      ],
      unreadCount: 1
    },
    {
      id: 'room-2',
      name: 'Development Team',
      type: 'group',
      avatar: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      participants: [this.currentUser, this.users[1], this.users[2], this.users[4]],
      messages: [
        {
          id: 'msg-6',
          senderId: 'user-2',
          content: 'Good morning team! Ready for today\'s sprint planning?',
          timestamp: new Date(Date.now() - 7200000),
          type: 'text'
        },
        {
          id: 'msg-7',
          senderId: 'user-3',
          content: 'Absolutely! I\'ve prepared the user stories for review.',
          timestamp: new Date(Date.now() - 7100000),
          type: 'text'
        },
        {
          id: 'msg-8',
          senderId: 'user-5',
          content: 'Great! I\'ll share the technical requirements document in a few minutes.',
          timestamp: new Date(Date.now() - 7000000),
          type: 'text'
        },
        {
          id: 'msg-9',
          senderId: 'user-1',
          content: 'Perfect timing! I just finished the mockups for the new features.',
          timestamp: new Date(Date.now() - 6900000),
          type: 'text'
        }
      ],
      unreadCount: 0
    },
    {
      id: 'room-3',
      name: 'Bob Smith',
      type: 'direct',
      participants: [this.currentUser, this.users[2]],
      messages: [
        {
          id: 'msg-10',
          senderId: 'user-3',
          content: 'Hey, do you have a moment to discuss the API integration?',
          timestamp: new Date(Date.now() - 5400000),
          type: 'text'
        },
        {
          id: 'msg-11',
          senderId: 'user-1',
          content: 'Of course! What specific part are you working on?',
          timestamp: new Date(Date.now() - 5300000),
          type: 'text'
        },
        {
          id: 'msg-12',
          senderId: 'user-3',
          content: 'I\'m having some issues with the authentication flow. The tokens seem to expire too quickly.',
          timestamp: new Date(Date.now() - 5200000),
          type: 'text'
        }
      ],
      unreadCount: 0
    },
    {
      id: 'room-4',
      name: 'Design Team',
      type: 'group',
      avatar: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      participants: [this.currentUser, this.users[3], this.users[5]],
      messages: [
        {
          id: 'msg-13',
          senderId: 'user-4',
          content: 'I love the new color scheme we decided on!',
          timestamp: new Date(Date.now() - 4800000),
          type: 'text'
        },
        {
          id: 'msg-14',
          senderId: 'user-6',
          content: 'Yes! The gradient backgrounds really make the interface pop.',
          timestamp: new Date(Date.now() - 4700000),
          type: 'text'
        },
        {
          id: 'msg-15',
          senderId: 'user-1',
          content: 'I agree! The user feedback has been overwhelmingly positive.',
          timestamp: new Date(Date.now() - 4600000),
          type: 'text'
        }
      ],
      unreadCount: 2
    },
    {
      id: 'room-5',
      name: 'Emma Brown',
      type: 'direct',
      participants: [this.currentUser, this.users[5]],
      messages: [
        {
          id: 'msg-16',
          senderId: 'user-6',
          content: 'Thanks for helping me with the CSS animations yesterday!',
          timestamp: new Date(Date.now() - 2400000),
          type: 'text'
        },
        {
          id: 'msg-17',
          senderId: 'user-1',
          content: 'You\'re welcome! The final result looks fantastic.',
          timestamp: new Date(Date.now() - 2300000),
          type: 'text'
        },
        {
          id: 'msg-18',
          senderId: 'user-6',
          content: 'I learned so much about keyframes and transitions. Can\'t wait to apply this knowledge to more projects!',
          timestamp: new Date(Date.now() - 900000),
          type: 'text'
        }
      ],
      unreadCount: 0
    }
  ];

  private chatRoomsSubject = new BehaviorSubject<ChatRoom[]>(this.chatRooms);
  private activeRoomSubject = new BehaviorSubject<ChatRoom | null>(this.chatRooms[0]);
  private typingIndicatorSubject = new BehaviorSubject<TypingIndicator[]>([]);

  constructor() {
    // Update last messages for each room
    this.updateLastMessages();
  }

  getChatRooms(): Observable<ChatRoom[]> {
    return this.chatRoomsSubject.asObservable();
  }

  getActiveRoom(): Observable<ChatRoom | null> {
    return this.activeRoomSubject.asObservable();
  }

  getTypingIndicators(): Observable<TypingIndicator[]> {
    return this.typingIndicatorSubject.asObservable();
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  setActiveRoom(roomId: string): void {
    const room = this.chatRooms.find(r => r.id === roomId);
    if (room) {
      // Mark messages as read
      room.unreadCount = 0;
      this.activeRoomSubject.next(room);
      this.chatRoomsSubject.next([...this.chatRooms]);
    }
  }

  sendMessage(roomId: string, content: string): void {
    const room = this.chatRooms.find(r => r.id === roomId);
    if (room && content.trim()) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: this.currentUser.id,
        content: content.trim(),
        timestamp: new Date(),
        type: 'text'
      };

      room.messages.push(newMessage);
      room.lastMessage = newMessage;
      
      // Simulate response from other users (randomly)
      if (Math.random() > 0.3) {
        setTimeout(() => {
          this.simulateResponse(roomId);
        }, 1000 + Math.random() * 3000);
      }

      this.chatRoomsSubject.next([...this.chatRooms]);
      this.activeRoomSubject.next(room);
    }
  }

  private simulateResponse(roomId: string): void {
    const room = this.chatRooms.find(r => r.id === roomId);
    if (!room) return;

    const otherParticipants = room.participants.filter(p => p.id !== this.currentUser.id);
    if (otherParticipants.length === 0) return;

    const randomParticipant = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    
    const responses = [
      "That's interesting!",
      "I see what you mean.",
      "Thanks for sharing that.",
      "Good point!",
      "I agree with you.",
      "Let me think about that.",
      "That makes sense.",
      "I'll look into it.",
      "Great idea!",
      "Sounds good to me."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const responseMessage: Message = {
      id: `msg-${Date.now()}-response`,
      senderId: randomParticipant.id,
      content: randomResponse,
      timestamp: new Date(),
      type: 'text'
    };

    room.messages.push(responseMessage);
    room.lastMessage = responseMessage;

    // Add unread count if not in active room
    const activeRoom = this.activeRoomSubject.value;
    if (!activeRoom || activeRoom.id !== roomId) {
      room.unreadCount++;
    }

    this.chatRoomsSubject.next([...this.chatRooms]);
    
    // Update active room if it's the same room
    if (activeRoom && activeRoom.id === roomId) {
      this.activeRoomSubject.next(room);
    }
  }

  private updateLastMessages(): void {
    this.chatRooms.forEach(room => {
      if (room.messages.length > 0) {
        room.lastMessage = room.messages[room.messages.length - 1];
      }
    });
  }

  getUserById(userId: string): User | undefined {
    return this.users.find(user => user.id === userId);
  }

  startTyping(roomId: string): void {
    // Simulate typing indicator (in a real app, this would be sent to other users)
    const indicators = this.typingIndicatorSubject.value;
    const existingIndicator = indicators.find(i => i.roomId === roomId && i.userId === this.currentUser.id);
    
    if (!existingIndicator) {
      const newIndicator: TypingIndicator = {
        roomId,
        userId: this.currentUser.id,
        userName: this.currentUser.name
      };
      this.typingIndicatorSubject.next([...indicators, newIndicator]);
    }
  }

  stopTyping(roomId: string): void {
    const indicators = this.typingIndicatorSubject.value;
    const filteredIndicators = indicators.filter(i => !(i.roomId === roomId && i.userId === this.currentUser.id));
    this.typingIndicatorSubject.next(filteredIndicators);
  }
}