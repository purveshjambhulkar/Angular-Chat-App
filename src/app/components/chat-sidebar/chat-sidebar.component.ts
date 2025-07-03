import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { ChatRoom, User } from '../../models/chat.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="user-profile">
          <img [src]="currentUser.avatar" [alt]="currentUser.name" class="user-avatar">
          <div class="user-info">
            <h3>{{ currentUser.name }}</h3>
            <span class="status" [class]="currentUser.status">{{ currentUser.status }}</span>
          </div>
        </div>
        <button class="new-chat-btn" title="New Chat">
          <i class="fas fa-plus"></i>
        </button>
      </div>

      <div class="search-container">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search conversations..." class="search-input">
        </div>
      </div>

      <div class="chat-list">
        <div 
          *ngFor="let room of chatRooms$ | async; trackBy: trackByRoomId"
          class="chat-item"
          [class.active]="(activeRoom$ | async)?.id === room.id"
          (click)="selectRoom(room.id)"
        >
          <div class="chat-avatar-container">
            <img 
              [src]="getRoomAvatar(room)" 
              [alt]="room.name" 
              class="chat-avatar"
            >
            <div 
              *ngIf="getRoomStatus(room) === 'online'" 
              class="status-indicator online"
            ></div>
          </div>
          
          <div class="chat-info">
            <div class="chat-header">
              <h4 class="chat-name">{{ room.name }}</h4>
              <span class="chat-time">{{ formatTime(room.lastMessage?.timestamp) }}</span>
            </div>
            <div class="chat-preview">
              <p class="last-message">
                <span *ngIf="room.lastMessage?.senderId === currentUser.id" class="you-prefix">You: </span>
                {{ room.lastMessage?.content || 'No messages yet' }}
              </p>
              <div *ngIf="room.unreadCount > 0" class="unread-badge">
                {{ room.unreadCount }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 320px;
      height: 100vh;
      background: white;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    }

    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .user-info h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .status {
      font-size: 12px;
      text-transform: capitalize;
      opacity: 0.9;
    }

    .status.online { color: #10b981; }
    .status.away { color: #f59e0b; }
    .status.offline { color: #ef4444; }

    .new-chat-btn {
      width: 36px;
      height: 36px;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .new-chat-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .search-container {
      padding: 16px 20px;
      border-bottom: 1px solid #f3f4f6;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-box i {
      position: absolute;
      left: 12px;
      color: #9ca3af;
      font-size: 14px;
    }

    .search-input {
      width: 100%;
      padding: 10px 12px 10px 36px;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      font-size: 14px;
      background: #f9fafb;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .chat-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }

    .chat-item {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }

    .chat-item:hover {
      background: #f9fafb;
    }

    .chat-item.active {
      background: #f0f4ff;
      border-left-color: #667eea;
    }

    .chat-avatar-container {
      position: relative;
      margin-right: 12px;
    }

    .chat-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }

    .status-indicator {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
    }

    .status-indicator.online {
      background: #10b981;
    }

    .chat-info {
      flex: 1;
      min-width: 0;
    }

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .chat-name {
      font-size: 15px;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .chat-time {
      font-size: 12px;
      color: #6b7280;
    }

    .chat-preview {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .last-message {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 180px;
    }

    .you-prefix {
      color: #667eea;
      font-weight: 500;
    }

    .unread-badge {
      background: #ef4444;
      color: white;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        position: absolute;
        z-index: 1000;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .sidebar.open {
        transform: translateX(0);
      }
    }
  `]
})
export class ChatSidebarComponent implements OnInit {
  chatRooms$: Observable<ChatRoom[]>;
  activeRoom$: Observable<ChatRoom | null>;
  currentUser: User;

  constructor(private chatService: ChatService) {
    this.chatRooms$ = this.chatService.getChatRooms();
    this.activeRoom$ = this.chatService.getActiveRoom();
    this.currentUser = this.chatService.getCurrentUser();
  }

  ngOnInit(): void {}

  selectRoom(roomId: string): void {
    this.chatService.setActiveRoom(roomId);
  }

  getRoomAvatar(room: ChatRoom): string {
    if (room.type === 'group') {
      return room.avatar || 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1';
    } else {
      const otherParticipant = room.participants.find(p => p.id !== this.currentUser.id);
      return otherParticipant?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1';
    }
  }

  getRoomStatus(room: ChatRoom): string {
    if (room.type === 'group') {
      return 'online';
    } else {
      const otherParticipant = room.participants.find(p => p.id !== this.currentUser.id);
      return otherParticipant?.status || 'offline';
    }
  }

  formatTime(timestamp: Date | undefined): string {
    if (!timestamp) return '';
    
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return timestamp.toLocaleDateString();
  }

  trackByRoomId(index: number, room: ChatRoom): string {
    return room.id;
  }
}