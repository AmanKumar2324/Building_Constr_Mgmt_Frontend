// custom-alert.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CustomAlertComponent {
  @Input() title: string = 'Alert';
  @Input() message: string = '';
  @Input() showCancel: boolean = false; // For confirm dialogs
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
