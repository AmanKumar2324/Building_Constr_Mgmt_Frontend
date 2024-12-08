import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custon-message-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custon-message-alert.component.html',
  styleUrl: './custon-message-alert.component.css',
  template:`
    <div class="custom-message-alert" [ngClass]="type">
      {{ message }}
    </div>
  `,
})
export class CustomMessageAlertComponent implements OnInit {
  @Input() message: string = ''; // The message to display
  @Input() type: 'success' | 'error' | 'info' = 'info'; // Alert type

  ngOnInit() {
    // Auto-destroy the alert after 3 seconds
    setTimeout(() => {
      const alertElement = document.querySelector('.custom-message-alert');
      if (alertElement) {
        alertElement.remove();
      }
    }, 3000);
  }
}
