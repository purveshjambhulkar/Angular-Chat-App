import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatSidebarComponent } from './components/chat-sidebar/chat-sidebar.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChatSidebarComponent, ChatWindowComponent],
  template: `
    <div class="app-container">
      <app-chat-sidebar></app-chat-sidebar>
      <app-chat-window></app-chat-window>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      background: #f9fafb;
    }

    @media (max-width: 768px) {
      .app-container {
        position: relative;
      }
    }
  `]
})
export class AppComponent {
  title = 'ChatApp';
}