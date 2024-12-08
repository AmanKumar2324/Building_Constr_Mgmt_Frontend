import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CustomAlertComponent implements OnInit {
  message: string = '';
  alertType: string = ''; // Can be success, error, or warning

  constructor() { }

  ngOnInit(): void {
  }

  showAlert(message: string, type: string = 'error') {
    this.message = message;
    this.alertType = type;
  }

  closeAlert() {
    this.message = ''; // Hide the alert when close button is clicked
  }
}
