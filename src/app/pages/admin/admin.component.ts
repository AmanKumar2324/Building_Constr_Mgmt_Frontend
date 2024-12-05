import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  drawerOpen: boolean = false; // Tracks if the drawer is open
  currentDrawer: string | null = null; // Tracks the current drawer content

  // Toggles the drawer and sets the current drawer content
  toggleDrawer(drawer: string) {
    if (this.currentDrawer === drawer) {
      this.drawerOpen = false;
      this.currentDrawer = null;
    } else {
      this.drawerOpen = true;
      this.currentDrawer = drawer;
    }
  }

  // Handle specific actions from the drawer
  handleAction(action: string) {
    console.log(`Action triggered: ${action}`);
    // Add your logic here for the respective actions
  }
}
