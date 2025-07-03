import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatRoom, Message, User } from '../../models/chat.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-window" *ngIf="activeRoom$ | async as room; else noRoomSelected">
      <div class="chat-header">
        <div class="room-info">
          <img [src]="getRoomAvatar(room)" [alt]="room.name" class="room-avatar">
          <div class="room-details">
            <h3>{{ room.name }}</h3>
            <p class="room-status">
              <span *ngIf="room.type === 'direct'">
                {{ getRoomStatusText(room) }}
              </span>
              <span *ngIf="room.type === 'group'">
                {{ room.participants.length }} members
              </span>
            </p>
          </div>
        </div>
        <div class="chat-actions">
          <button class="action-btn" title="Voice Call">
            <i class="fas fa-phone"></i>
          </button>
          <button class="action-btn" title="Video Call">
            <i class="fas fa-video"></i>
          </button>
          <button class="action-btn" title="More Options">
            <i class="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>

      <div class="messages-container" #messagesContainer>
        <div class="messages-list">
          <div 
            *ngFor="let message of room.messages; trackBy: trackByMessageId"
            class="message-wrapper"
            [class.own-message]="message.senderId === currentUser.id"
          >
            <div class="message-bubble" [class.own]="message.senderId === currentUser.id">
              <div *ngIf="message.senderId !== currentUser.id" class="sender-info">
                <img [src]="getSenderAvatar(message.senderId)" [alt]="getSenderName(message.senderId)" class="sender-avatar">
                <span class="sender-name">{{ getSenderName(message.senderId) }}</span>
              </div>
              <div class="message-content">
                <p>{{ message.content }}</p>
              </div>
              <div class="message-time">
                {{ formatMessageTime(message.timestamp) }}
                <i *ngIf="message.senderId === currentUser.id" class="fas fa-check message-status"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="message-input-container">
        <div class="input-wrapper">
          <button class="attachment-btn" title="Attach File">
            <i class="fas fa-paperclip"></i>
          </button>
          <input 
            type="text" 
            [(ngModel)]="newMessage" 
            (keydown.enter)="sendMessage()"
            (input)="onTyping()"
            placeholder="Type a message..."
            class="message-input"
            #messageInput
          >
          <button class="emoji-btn" title="Add Emoji">
            <i class="fas fa-smile"></i>
          </button>
          <button 
            class="send-btn" 
            (click)="sendMessage()"
            [disabled]="!newMessage.trim()"
            title="Send Message"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>

    <ng-template #noRoomSelected>
      <div class="no-room-selected">
        <div class="welcome-content">
          <i class="fas fa-comments welcome-icon"></i>
          <h2>Welcome to ChatApp</h2>
          <p>Select a conversation to start chatting</p>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .chat-window {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: white;
    }

    .chat-header {
      padding: 16px 24px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .room-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .room-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .room-details h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }

    .room-status {
      margin: 0;
      font-size: 12px;
      color: #6b7280;
    }

    .chat-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      width: 36px;
      height: 36px;
      border: none;
      background: #f3f4f6;
      color: #6b7280;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px 24px;
      background: #f9fafb;
    }

    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message-wrapper {
      display: flex;
      flex-direction: column;
    }

    .message-wrapper.own-message {
      align-items: flex-end;
    }

    .message-bubble {
      max-width: 70%;
      background: white;
      border-radius: 18px;
      padding: 12px 16px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      animation: fadeIn 0.3s ease;
    }

    .message-bubble.own {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .sender-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .sender-avatar {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      object-fit: cover;
    }

    .sender-name {
      font-size: 12px;
      font-weight: 600;
      color: #667eea;
    }

    .message-content p {
      margin: 0;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .message-time {
      font-size: 11px;
      color: #9ca3af;
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
      justify-content: flex-end;
    }

    .message-bubble.own .message-time {
      color: rgba(255, 255, 255, 0.7);
    }

    .message-status {
      font-size: 10px;
    }

    .message-input-container {
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
      background: white;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f3f4f6;
      border-radius: 24px;
      padding: 8px 16px;
    }

    .attachment-btn, .emoji-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: #6b7280;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .attachment-btn:hover, .emoji-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .message-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 14px;
      padding: 8px 0;
      outline: none;
    }

    .message-input::placeholder {
      color: #9ca3af;
    }

    .send-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .send-btn:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .no-room-selected {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f9fafb;
    }

    .welcome-content {
      text-align: center;
      color: #6b7280;
    }

    .welcome-icon {
      font-size: 64px;
      margin-bottom: 16px;
      color: #d1d5db;
    }

    .welcome-content h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #374151;
    }

    .welcome-content p {
      font-size: 16px;
      margin: 0;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .chat-header {
        padding: 12px 16px;
      }

      .messages-container {
        padding: 12px 16px;
      }

      .message-input-container {
        padding: 12px 16px;
      }

      .message-bubble {
        max-width: 85%;
      }
    }
  `]
})
export class ChatWindowComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  activeRoom$: Observable<ChatRoom | null>;
  currentUser: User;
  newMessage: string = '';
  private shouldScrollToBottom = false;

  constructor(private chatService: ChatService) {
    this.activeRoom$ = this.chatService.getActiveRoom();
    this.currentUser = this.chatService.getCurrentUser();
  }

  ngOnInit(): void {
    this.activeRoom$.subscribe(() => {
      this.shouldScrollToBottom = true;
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.chatService.getActiveRoom().subscribe(room => {
        if (room) {
          this.chatService.sendMessage(room.id, this.newMessage);
          this.newMessage = '';
          this.shouldScrollToBottom = true;
        }
      }).unsubscribe();
    }
  }

  onTyping(): void {
    this.chatService.getActiveRoom().subscribe(room => {
      if (room) {
        this.chatService.startTyping(room.id);
        // Stop typing after 3 seconds of inactivity
        setTimeout(() => {
          this.chatService.stopTyping(room.id);
        }, 3000);
      }
    }).unsubscribe();
  }

  getRoomAvatar(room: ChatRoom): string {
    if (room.type === 'group') {
      return room.avatar || 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1';
    } else {
      const otherParticipant = room.participants.find(p => p.id !== this.currentUser.id);
      return otherParticipant?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1';
    }
  }

  getRoomStatusText(room: ChatRoom): string {
    if (room.type === 'group') return '';
    
    const otherParticipant = room.participants.find(p => p.id !== this.currentUser.id);
    if (!otherParticipant) return '';

    switch (otherParticipant.status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'offline':
        if (otherParticipant.lastSeen) {
          const now = new Date();
          const diff = now.getTime() - otherParticipant.lastSeen.getTime();
          const hours = Math.floor(diff / 3600000);
          const days = Math.floor(diff / 86400000);
          
          if (hours < 1) return 'Last seen recently';
          if (hours < 24) return `Last seen ${hours}h ago`;
          return `Last seen ${days}d ago`;
        }
        return 'Offline';
      default:
        return '';
    }
  }

  getSenderAvatar(senderId: string): string {
    const user = this.chatService.getUserById(senderId);
    return user?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1';
  }

  getSenderName(senderId: string): string {
    const user = this.chatService.getUserById(senderId);
    return user?.name || 'Unknown User';
  }

  formatMessageTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return timestamp.toLocaleDateString();
  }

  trackByMessageId(index: number, message: Message): string {
    return message.id;
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
}