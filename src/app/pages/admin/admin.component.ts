import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ComponentFactoryResolver, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { CustomAlertComponent } from "../../shared/custom-alert/custom-alert.component";
import { CustomMessageAlertComponent } from '../../shared/custon-message-alert/custon-message-alert.component';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule, CustomAlertComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart; // Chart.js instance

  colors: string[] = [
    'rgb(205, 193, 255)',
    'rgb(208, 232, 197)',
    'rgb(137, 168, 178)',
    'rgb(179, 200, 207)',
    'rgb(229, 225, 218)',
    // 'rgb(241, 240, 232)',

  ];

  profileButtons = [
    { action: 'viewProfile', label: 'View Profile' },
    { action: 'editProfile', label: 'Edit Profile' }
  ];

  usersButtons = [
    { action: 'addUser', label: 'Add User' },
    { action: 'viewAllUsers', label: 'View All Users' },
    { action: 'viewUserById', label: 'View User By Id' },
    { action: 'removeUser', label: 'Remove User' },
    { action: 'updateUser', label: 'Update User' }
  ];
  projectsButtons = [
    { action: 'addProject', label: 'Add Project' },
    { action: 'viewAllProjects', label: 'View All Projects' },
    { action: 'viewProjectById', label: 'View Project By Id' },
    { action: 'removeProject', label: 'Remove Project' },
    { action: 'updateProject', label: 'Update Project' }
  ];

  vendorsButtons = [
    { action: 'viewAllVendors', label: 'View Vendors' },
    { action: 'addVendor', label: 'Add Vendor' },
    { action: 'updateVendor', label: 'Modify Vendor' },
    { action: 'removeVendor', label: 'Remove Vendor' }
  ];

  expenseButtons = [
    { action: 'addExpense', label: 'Add Expense' },
    { action: 'viewExpence', label: 'View Expense' }
  ];

  reportsButtons = [
    // { action: 'generateReport', label: 'Generate Report' },
    { action: 'viewOverallReports', label: 'View Overall Reports' },
    { action: 'viewReports', label: 'View Project Reports' }
  ];
  isLogoutModalOpen: boolean = false; // Tracks if the logout confirmation modal is open

  drawerOpen: boolean = false; // Tracks if the drawer is open
  currentDrawer: string | null = null; // Tracks the current drawer content

  //Users Section variables
  isShowingUsers: boolean = false; // Tracks if "All Users" table is being displayed
  users: any[] = []; // Stores the user data
  isAddingUser: boolean = false; // Tracks if "Add User" form is being displayed
  isDrawerActionSelected: boolean = false;
  isRemovingUser: boolean = false; // Tracks if "Remove User" form is being displayed
  userIdToRemove: string = ''; // Stores the user ID to be removed
  isUpdatingUser: boolean = false; // Tracks if "Update User" form is being displayed
  updateUserId: number = 0; // Tracks the user ID being updated
  userIdToGet: string = ''; // Stores the user ID to get user data
  user: any = null; // Stores the user details from the API

  // Tracks if the user info form is shown
  isGettingUser: boolean = false;
  currentAction: string | null = null; // Stores the current action ('addUser', 'viewUserById', etc.)

  //Projects Section variable
  projects: any[] = []; // Stores the project data
  isShowingProjects: boolean = false;
  projectIdToRemove: number | null = null;
  isRemovingProject: boolean = false; // Tracks if "Remove User" form is being displayed
  isUpdatingProject: boolean = false; // Tracks if "Update User" form is being displayed
  projectIdToGet: number | null = null; // Stores the project ID to fetch
  project: any = null; // Stores the fetched project details
  errorMessage: string | null = null; // Stores the error message
  isGettingProject: boolean = false;

  //vendors section variable

  vendors: any[] = []; // Stores the vendor data
  isShowingVendors: boolean = false;
  isAddingVendor: boolean = false;
  isUpdatingVendor: boolean = false;
  isRemovingVendor: boolean = false;


  //Project Expensens

  projectId: number | null = null; // Stores the project ID input by the user
  expenses: any[] = []; // Stores the fetched expense data
  isShowingExpensess: boolean = false;
  isAddingExpense: boolean = false; // Tracks if "Add User" form is being displayed


  //Reports
  reports: any[] = []; // Stores the fetched report data
  isGettingReport: boolean = false;
  isGettingOverallReport: boolean = false;

    //Form data for Adding the users
    addUserData: any = {
      roleUserId: 'worker', // Default role user ID
      username: '',
      passwordHash: '',
      role: '',
      email: '',
      phoneNumber: '',
      isActive: true,
    };

    //form data to update the user
    updateUserData: any = {
      userId: 0,
      roleUserId: '',
      username: '',
      passwordHash: '',
      role: '',
      email: '',
      phoneNumber: '',
      isActive: true,
    };

    addProjectData: any = {
      name: '',
      location: '',
      startDate: '',
      endDate: '',
      budget: 0,
      status: 'Ongoing', // Default status
      projectManagerId: '',
    };

    updateProjectData: any = {
      projectId: null,
      name: '',
      location: '',
      startDate: '',
      endDate: '',
      budget: 0,
      status: 'Ongoing', // Default status
      projectManagerId: '',
    };

    addVendorData: any = {
      name: '',
      contactDetails: '',
      materialSupplied: '',
      contractTerms: '',
      deliveryStatus: '',
    };
    
    addExpenseData: any = {
      projectId: null,
      expenseType: '',
      amount: null,
      date: '',
      paymentStatus: 'Successful', // Default value
    };
    
  constructor(private http: HttpClient,private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver) {}

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
  resetAllStates() {
    // Reset Users Section Variables
    this.isShowingUsers = false;
    this.isAddingUser = false;
    this.isRemovingUser = false;
    this.isUpdatingUser = false;
    this.isGettingUser = false;
  
    // Reset Projects Section Variables
    this.isShowingProjects = false;
    this.isRemovingProject = false;
    this.isUpdatingProject = false;
    this.isGettingProject = false;
  
    // Reset Vendors Section Variables
    this.isShowingVendors = false;
    this.isAddingVendor = false;
    this.isUpdatingVendor = false;
    this.isRemovingVendor = false;
  
    // Reset Expenses Section Variables
    this.isShowingExpensess = false;
    this.isAddingExpense = false;
  
    // Reset Reports Section Variables
    this.isGettingReport = false;
    this.isGettingOverallReport = false;
  
    // Reset Miscellaneous Variables
    this.currentAction = null;
    this.isDrawerActionSelected = false;
  }
  //Getting all the users
  showAllUsers() {
    this.isShowingUsers = true; // Show the "All Users" table
    this.fetchUsers(); // Fetch users from API
  }
    // Show the "Add User" form
    showAddUserForm() {
      this.isAddingUser = true; // Show the form
      this.isShowingUsers = false; // Hide the users table
    }
    // Add user API call
  addUser() {
    const apiUrl = 'https://localhost:7185/api/User'; // API endpoint
    this.http.post(apiUrl, this.addUserData).subscribe({
      next: (response) => {
        this.showCustomMessage('User added successfully!','success');
        this.resetAddUserForm(); // Reset the form
      },
      error: (err) => {
        console.error('Error adding user:', err);
        this.showCustomMessage('Failed to add User. Please try again!','error');

      },
    });
  }
  resetAddUserForm() {
    this.addUserData = {
      roleUserId: 'worker',
      username: '',
      passwordHash: '',
      role: '',
      email: '',
      phoneNumber: '',
      isActive: true,
    };
    this.isAddingUser = false; // Hide the form after submission
  }


    // Fetch users from the API
    private fetchUsers() {
      const apiUrl = 'https://localhost:7185/api/User'; // API endpoint
      this.http.get<any[]>(apiUrl).subscribe({
        next: (response) => {
          this.users = response; // Store the user data
          this.showCustomMessage('User List Fetched Successfully!','success');
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          this.showCustomMessage('Error In Fetching User List, Please Try Again!','error');
        },
      });
    }

    //show the remove user form
    showRemoveUserForm() {
      this.isRemovingUser = true; // Show the form
    }
    removeUser() {
      const apiUrl = `https://localhost:7185/api/User/${this.userIdToRemove}`; // API endpoint with user ID
      this.http.delete(apiUrl).subscribe({
        next: (response) => {
          // alert('User removed successfully!'); // Show success notification
          this.showCustomMessage('User removed successfully!', 'success');
          this.resetRemoveUserForm(); // Reset the form
        },
        error: (err) => {
          console.error('Error removing user:', err);
          // alert('Failed to remove user. Please try again.');
          this.showCustomMessage('Error removing user. Please try again!', 'error');
        },
      });
    }
     // Reset the "Remove User" form
  resetRemoveUserForm() {
    this.userIdToRemove = ''; // Clear the user ID field
    this.isRemovingUser = false; // Hide the form
  }
  // Update user API call
  updateUser() {
    // Validate input fields
    if (
      !this.updateUserId || this.updateUserId <= 0 ||
      !this.updateUserData.roleUserId.trim() ||
      !this.updateUserData.username.trim() ||
      !this.updateUserData.passwordHash.trim() ||
      !this.updateUserData.role.trim() ||
      !this.updateUserData.email.trim() ||
      !this.updateUserData.phoneNumber.trim()
    ) {
      // alert('All fields are required, and User ID must be a valid number.');
      this.showCustomMessage('All fields are required and ID must be a valid number!', 'error');
      return;
    }
  
    // Assign the User ID to updateUserData
    this.updateUserData.userId = this.updateUserId;
  
    // Prepare API URL
    const apiUrl = `https://localhost:7185/api/User/${this.updateUserId}`;
    
    // Send the PUT request
    this.http.put(apiUrl, this.updateUserData).subscribe({
      next: (response) => {
        // alert('User updated successfully!');
        this.showCustomMessage('User updated successfully!', 'success');
        this.resetUpdateUserForm();
      },
      error: (err) => {
        console.error('Error updating user:', err);
        // alert('Failed to update user. Please check the input and try again.');
        this.showCustomMessage('Failed to update user.Please try again!', 'error');
      },
    });
  }
  
  
  
  
    // Show the "Update User" form
    showUpdateUserForm() {
      this.isUpdatingUser = true; // Show the form
    }
    // Reset the "Update User" form
    resetUpdateUserForm() {
      this.updateUserId = 0;
      this.updateUserData = {
        userId: 0, // Reset to 0
        roleUserId: '',
        username: '',
        passwordHash: '',
        role: '',
        email: '',
        phoneNumber: '',
        isActive: true,
      };
      this.isUpdatingUser = false; // Hide the form
    }
    
    /****************************************Getting User By Id******************************************************* */
    // Show the "Get User by ID" form
  showGetUserForm() {
    this.isGettingUser = true;
  }
  // Fetch user by ID from the API
  getUserById() {
    if (!this.userIdToGet) {
      this.showCustomMessage('User ID is required!', 'error');
      return;
    }

    const apiUrl = `https://localhost:7185/api/User/${this.userIdToGet}`;
    this.http.get(apiUrl).subscribe({
      next: (response) => {
        this.user = response; // Store the user data in the user object
        console.log('Fetched user:', this.user); // Debugging
        this.showCustomMessage('User fetched successfully!', 'success');
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        // alert('Failed to get user details. Please try again.');
        this.showCustomMessage('Failed to get user details. Please try again.', 'error');
      },
    });
  }
   // Reset form to hide user details after request
   resetGetUserForm() {
    this.userIdToGet = '';
    this.user = null;
    this.isGettingUser = false;
  }
/*******************************************Fetch all the projects********************************************************************* */
  //Getting all the Projects
  showAllProjects() {
    this.isShowingProjects = true; // Show the "All Projects" table
    this.fetchAllProjects(); // Fetch users from API
  }
    

 // Fetch all projects from the API
 fetchAllProjects() {
  const apiUrl = 'https://localhost:7185/api/Project'; // API endpoint for projects
  this.http.get<any[]>(apiUrl).subscribe({
    next: (response) => {
      this.projects = response; // Store the fetched project data
      console.log('Projects fetched successfully:', this.projects); // Debugging
      this.showCustomMessage('Projects fetched successfully!', 'success');
    },
    error: (err) => {
      console.error('Error fetching projects:', err);
      this.showCustomMessage('Failed to fetch projects. Please try again!', 'error');
    },
  });
}
//add Project

addProject() {
  const apiUrl = 'https://localhost:7185/api/Project'; // API endpoint for adding projects
  this.http.post(apiUrl, this.addProjectData).subscribe({
    next: (response) => {
      this.showCustomMessage('Project added successfully!', 'success');
      this.resetAddProjectForm(); // Reset the form after submission
      this.fetchAllProjects(); // Refresh the project list
    },
    error: (err) => {
      console.error('Error adding project:', err); // Log error for debugging
      this.showCustomMessage('Failed to add project. Please try again!', 'error');
    },
  });
}

resetAddProjectForm() {
  this.addProjectData = {
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    budget: 0,
    status: 'Ongoing',
    projectManagerId: '',
  };
  this.currentAction = null; // Reset the action to hide the form
}
//show the remove user form
showRemoveProjectForm() {
  this.isRemovingProject = true; // Show the form
}
removeProject() {
  if (!this.projectIdToRemove || this.projectIdToRemove <= 0) {
    this.showCustomMessage('Please enter a valid Project ID!', 'error');
    return;
  }

  const apiUrl = `https://localhost:7185/api/Project/${this.projectIdToRemove}`; // API endpoint with Project ID
  this.http.delete(apiUrl).subscribe({
    next: () => {
      this.showCustomMessage('Project removed successfully!', 'success');
      this.resetRemoveProjectForm();
      this.fetchAllProjects(); // Refresh the project list
    },
    error: (err) => {
      console.error('Error removing project:', err);
      this.showCustomMessage('Failed to remove project. Please try again!', 'error');
    },
  });
}
resetRemoveProjectForm() {
  this.projectIdToRemove = null; // Clear the input
  this.currentAction = null; // Reset the current action
}

updateProject() {
  if (!this.updateProjectData.projectId) {
    this.showCustomMessage('Please enter a valid Project ID', 'error');
    return;
  }

  const apiUrl = `https://localhost:7185/api/Project/${this.updateProjectData.projectId}`; // API endpoint with Project ID
  this.http.put(apiUrl, this.updateProjectData).subscribe({
    next: () => {
      this.showCustomMessage('Project updated successfully!', 'success');
      this.resetUpdateProjectForm();
      this.fetchAllProjects(); // Refresh the project list
    },
    error: (err) => {
      console.error('Error updating project:', err);
      this.showCustomMessage('Failed to update project. Please try again!', 'error');
    },
  });
}
resetUpdateProjectForm() {
  this.updateProjectData = {
    projectId: null,
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    budget: 0,
    status: 'Ongoing',
    projectManagerId: '',
  };
  this.currentAction = null; // Reset the action to hide the form
}
   // Show the "Update Project" form
   showUpdateProjectForm() {
    this.isUpdatingProject = true; // Show the form
  }

  showGetProjectForm() {
    this.isGettingProject = true;
  }



  getProjectById() {
    if (!this.projectIdToGet || this.projectIdToGet <= 0) {
      this.errorMessage = 'Please enter a valid Project ID.';
      this.project = null;
      return;
    }
  
    const apiUrl = `https://localhost:7185/api/Project/${this.projectIdToGet}`; // API endpoint with Project ID
    this.http.get(apiUrl).subscribe({
      next: (response) => {
        this.project = response; // Store the project details
        this.showCustomMessage('Showing available project!', 'success');
        this.errorMessage = null; // Clear any previous error messages
      },
      error: (err) => {
        // console.error('Error fetching project:', err);
        this.showCustomMessage('Error fetching the projecct. Please try again!', 'error');
        if (err.status === 404) {
          this.errorMessage = `Project with ID ${this.projectIdToGet} does not exist.`;
        } else {
          this.errorMessage = 'An error occurred while fetching the project. Please try again.';
        }
        this.project = null; // Clear previous project data
      },
    });
  }
  resetGetProjectForm() {
    this.projectIdToGet = null;
    this.project = null;
    this.errorMessage = null;
  }
  

  // *********************************************Vendor section**********************************************
//Getting all the vendors

  fetchAllVendors() {
    const apiUrl = 'https://localhost:7185/api/Vendor'; // API endpoint for fetching vendors
    this.http.get<any[]>(apiUrl).subscribe({
      next: (response) => {
        this.vendors = response; // Store the vendor data
        console.log('Vendors fetched successfully:', this.vendors); // Debugging
        this.showCustomMessage('Vendors fetched successfully!', 'success');
      },
      error: (err) => {
        console.error('Error fetching vendors:', err);
        this.showCustomMessage('Failed to fetch vendors. Please try again!', 'error');
      },
    });
  }
  showAllVendors() {
    this.isShowingVendors = true; // Show the "All Users" table
    this.fetchAllVendors(); // Fetch users from API
  }

  //Adding the vendor

  addVendor() {
    const apiUrl = 'https://localhost:7185/api/Vendor'; // API endpoint for adding a vendor
    this.http.post(apiUrl, this.addVendorData).subscribe({
      next: () => {
        this.showCustomMessage('Vendor added successfully!', 'success');
        this.resetAddVendorForm(); // Reset the form after submission
        this.fetchAllVendors(); // Refresh the vendor list
      },
      error: (err) => {
        console.error('Error adding vendor:', err);
        this.showCustomMessage('Failed to add vendor. Please try again', 'error');
      },
    });
  }

  resetAddVendorForm() {
    this.addVendorData = {
      name: '',
      contactDetails: '',
      materialSupplied: '',
      contractTerms: '',
      deliveryStatus: '',
    };
    this.currentAction = null; // Reset the current action
  }
  
  showAddVendorForm() {
    this.isAddingVendor = true; // Show the form
    this.isShowingVendors = false; // Hide the users table
  }

  //Update the status of vendor
  updateVendorStatusData: any = {
    vendorId: null,
    deliveryStatus: 'Delivered', // Default value
  };
  

  updateVendorStatus() {
    // Ensure the vendorId is valid
    if (!this.updateVendorStatusData.vendorId || this.updateVendorStatusData.vendorId <= 0) {
      this.statusMessage = 'Please enter a valid Vendor ID.';
      return;
    }
  
    const apiUrl = `https://localhost:7185/api/Vendor/${this.updateVendorStatusData.vendorId}/status`;
  
    // Prepare the payload to send both vendorId and deliveryStatus
    const payload = {
      vendorId: this.updateVendorStatusData.vendorId,
      deliveryStatus: this.updateVendorStatusData.deliveryStatus
    };
  
    // Send the request with the appropriate content-type
    this.http.patch(apiUrl, payload, {
      headers: { 'Content-Type': 'application/json' }, // Use application/json to send the payload as JSON
      responseType: 'text', // Expecting a text response (empty 204 response)
    }).subscribe({
      next: () => {
        this.statusMessage = 'Vendor delivery status updated successfully!';
        this.showCustomMessage('Vendor updated successfully!', 'success');
        this.resetUpdateVendorStatusForm(); // Reset the form
      },
      error: (err) => {
        console.error('Error updating vendor status:', err);
        this.showCustomMessage('Error updating vendor!', 'error');
        if (err.status === 404) {
          this.statusMessage = `Vendor with ID ${this.updateVendorStatusData.vendorId} not found.`;
        } else {
          this.statusMessage = 'Failed to update vendor status. Please try again.';
        }
      },
    });
  }
  resetUpdateVendorStatusForm() {
    this.updateVendorStatusData = {
      vendorId: null,
      deliveryStatus: 'Delivered',
    };
    this.statusMessage = null;
    this.currentAction = null; // Reset the current action
  }
  
  showUpdateVendorForm() {
    this.isUpdatingVendor = true; // Show the form
  }
  

  //Remove vendor

  removeVendorData: any = {
    vendorId: null,
  };
  
  statusMessage: string | null = null; // Stores success or error messages
  
  removeVendor() {
    if (!this.removeVendorData.vendorId || this.removeVendorData.vendorId <= 0) {
      this.statusMessage = 'Please enter a valid Vendor ID.';
      return;
    }
  
    const apiUrl = `https://localhost:7185/api/Vendor/${this.removeVendorData.vendorId}`;
  
    // Send DELETE request to remove vendor
    this.http.delete(apiUrl).subscribe({
      next: () => {
        this.statusMessage = 'Vendor removed successfully!';
  
        // Show confirmation message (using alert or MatSnackBar)
        this.showConfirmationMessage('Vendor removed successfully!');
  
        this.resetRemoveVendorForm(); // Reset the form after successful deletion
      },
      error: (err) => {
        console.error('Error removing vendor:', err);
        this.statusMessage = 'Failed to remove vendor. Please try again.';
      },
    });
  }
  
  // Method to show confirmation message
  showConfirmationMessage(message: string) {
    // Using alert (basic method)
    this.showCustomMessage(message, 'success');
  }
  
  
  resetRemoveVendorForm() {
    this.removeVendorData = {
      vendorId: null,
    };
    this.statusMessage = null;
    this.currentAction = null; // Reset the current action
  }
  
  showRemoveVendorForm() {
    this.isRemovingVendor = true; // Show the form
  }
  

  // ********************************************Expenses Section**********************************

  fetchExpensesByProject() {
    // Check if the Project ID is valid before proceeding
    if (this.projectId === null || this.projectId === undefined || this.projectId <= 0) {
      this.showCustomMessage('Please enter a valid Project ID!', 'error');
      return;
    }
  
    const apiUrl = `https://localhost:7185/api/Finance/by-project/${this.projectId}`;
  
    // Send GET request to fetch expenses for the given project ID
    this.http.get<any[]>(apiUrl).subscribe({
      next: (response) => {
        this.expenses = response; // Store the fetched expenses
        console.log('Expenses fetched successfully:', this.expenses);
        this.showCustomMessage('Showing available expenses!', 'success');
      },
      error: (err) => {
        console.error('Error fetching expenses:', err);
        this.showCustomMessage('Failed to fetch expenses. Try again!', 'error');
      },
    });
  }
  

  resetExpensesView() {
    this.projectId = null;
    this.expenses = [];
  }
  
  showAllExpenses() {
    this.isShowingExpensess = true; // Show the "All Users" table
    this.fetchExpensesByProject(); // Fetch users from API
  }
  

  //Adding the expenses

  addExpense() {
    if (
      !this.addExpenseData.projectId ||
      !this.addExpenseData.expenseType.trim() ||
      !this.addExpenseData.amount ||
      !this.addExpenseData.date ||
      !this.addExpenseData.paymentStatus.trim()
    ) {
      this.showCustomMessage('All fields are required!', 'error');
      return;
    }
  
    const apiUrl = 'https://localhost:7185/api/Finance';
  
    this.http.post(apiUrl, this.addExpenseData).subscribe({
      next: (response) => {
        this.showCustomMessage('Expense added successfully!', 'success');
        this.resetAddExpenseForm();
      },
      error: (err) => {
        console.error('Error adding expense:', err);
        this.showCustomMessage('Failed to add expense. Please try again!', 'error');
      },
    });
  }

  resetAddExpenseForm() {
    this.addExpenseData = {
      projectId: null,
      expenseType: '',
      amount: null,
      date: '',
      paymentStatus: 'Successful',
    };
    this.currentAction = null; // Reset the current action
  }
  showAddExpenseForm() {
    this.isAddingExpense = true; // Show the form
    this.isShowingExpensess = false; // Hide the users table
  }



  // *****************************************Reports Section****************************************
  fetchReportByProjectId() {
    if (!this.projectId || this.projectId <= 0) {
      this.showCustomMessage('Please enter a valid Project ID', 'error');
      return;
    }
  
    const apiUrl = `https://localhost:7185/api/Report/by-project/${this.projectId}`;
  
    this.http.get<any[]>(apiUrl).subscribe({
      next: (response) => {
        this.reports = response; // Store the fetched reports
        console.log('Reports fetched successfully:', this.reports);
        this.showCustomMessage('Showing available reports!', 'success');
      },
      error: (err) => {
        console.error('Error fetching reports:', err);
        this.showCustomMessage('Failed to fetch reports. Pelase try again!', 'error');
      },
    });
  }
  

  resetReportView() {
    this.projectId = null;
    this.reports = [];
  }
  
  showGetReportForm() {
    this.isGettingReport = true;
  }
  showGetOverallReportForm() {
    this.isGettingOverallReport = true;
  }
  
  // Fetch project statuses and render the chart
  fetchProjectStatuses() {
    const apiUrl = 'https://localhost:7185/api/Project/statuses';
    this.http.get<any[]>(apiUrl).subscribe({
      next: (projects) => {
        const statusCounts = this.getStatusCounts(projects);
        this.renderPieChart(statusCounts);
      },
      error: (err) => {
        console.error('Error fetching project statuses:', err);
        alert('Failed to load project statuses. Please try again.');
      }
    });
  }
    // Helper function to calculate counts for each status
    getStatusCounts(projects: any[]): { [status: string]: number } {
      return projects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {});
    }
  
    // Render the Pie Chart
    renderPieChart(statusCounts: { [status: string]: number }) {
      if (this.chart) {
        this.chart.destroy(); // Destroy the old chart instance
      }
  
      const labels = Object.keys(statusCounts);
      const data = Object.values(statusCounts);
  
      this.chart = new Chart(this.pieChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: ['rgb(205, 193, 255)', 'rgb(208, 232, 197)', 'rgb(137, 168, 178)'], // Colors for statuses
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    }
  

/********************************************Handling all the actions****************************************************************** */
  // Handle specific actions from the drawer
  handleAction(action: string) {
    console.log(`Action triggered: ${action}`);
    this.isDrawerActionSelected = true;
    // Add your logic here for the respective actions
    this.resetAllStates();
    if (action === 'viewAllUsers') {
      this.showAllUsers(); // Trigger the "View All Users" action
    }
    else if (action === 'addUser') {
      this.isAddingUser = true;
      this.showAddUserForm();
    }
    else if (action === 'removeUser') {
      this.showRemoveUserForm();
    }
    else if (action === 'updateUser') {
      this.showUpdateUserForm();
    }
    else if(action === 'viewUserById' )
    {
      this.showGetUserForm();
    }
    else if (action === 'viewAllProjects') {
      this.showAllProjects(); // Fetch all projects when this action is triggered
    }
    else if (action === 'addProject') {
      this.currentAction = 'addProject'; // Show the Add Project form
    }
    else if (action === 'removeProject') {
      this.showRemoveProjectForm();
      console.log('Remove Project form opened');
    }
    else  if (action === 'updateProject') {
      this.showUpdateProjectForm();
      console.log('Update Project form opened');
    }
    else if (action === 'viewProjectById') {
      this.showGetProjectForm(); // Reset form when opening "Get Project by ID"
    }
    else if (action === 'viewAllVendors') {
      this.showAllVendors(); // Fetch all vendors when this action is triggered
    }
    else if (action === 'addVendor') {
      console.log('Add Vendor form opened');
      this.isAddingVendor = true;
      this.showAddVendorForm();
    }
    else if (action === 'updateVendor') {
      console.log('Update Vendor Delivery Status form opened');
      this.showUpdateVendorForm();
      this.resetUpdateVendorStatusForm();
    }
    else if (action === 'removeVendor') {
      console.log('Remove Vendor form opened');
      this.showRemoveVendorForm();
      this.resetRemoveVendorForm();
    }
    else 
    if (action === 'viewExpence') {
      console.log('View Expenses by Project form opened');
      this.showAllExpenses();
      this.resetExpensesView(); // Reset the state when the action is triggered
    }
    else if (action === 'addExpense') {
      console.log('Add Expense form opened');
      this.isAddingExpense = true;
      this.resetAddExpenseForm();
    }
    else if (action === 'viewReports') {
      console.log('View Report by Project ID form opened');
      this.showGetReportForm();
      this.resetReportView();
    }
    else if (action === 'logout') {
      this.logout(); // Call the logout method
    }else  if (action === 'viewOverallReports') {
      this.showGetOverallReportForm();
      // this.fetchProjectStatuses(); // Fetch data and render the chart
    }
    
  }
  resetDefaultMessage() {
    this.isDrawerActionSelected = false; // Show default message again when necessary
  }

  //Logout
  isAlertVisible = false; // To control visibility of the custom alert
  logout() {
    this.isAlertVisible = true; // Show the custom alert
  }
  onLogoutConfirm() {
    this.isAlertVisible = false;
    localStorage.clear(); // Clear local storage
    window.location.href = '/login'; // Redirect to the login page
  }

  onLogoutCancel() {
    this.isAlertVisible = false; // Close the custom alert
  }

  // logout() {
  //   // Confirm logout action
  //   const confirmed = confirm('Are you sure you want to logout?');
  //   if (confirmed) {
  //     localStorage.clear(); // Clear local storage
  //     alert('You have been logged out successfully!');
  //     window.location.href = '/login'; // Redirect to the login page
  //   }
  // }
  
  showCustomMessage(message: string, type: 'success' | 'error' | 'info') {
    // Clear existing alerts
    this.viewContainerRef.clear();

    // Dynamically create the alert component
    const factory = this.componentFactoryResolver.resolveComponentFactory(CustomMessageAlertComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);

    // Pass data to the alert component
    componentRef.instance.message = message;
    componentRef.instance.type = type;
  }

  //Pdf download functionality
  // Method to generate and download the PDF
  downloadUserListAsPDF() {
    const doc = new jsPDF(); // Create a new PDF document

    // Add a title
    doc.setFontSize(18);
    doc.text('User List', 14, 20);

    // Prepare the table data
    const tableData = this.users.map((user) => [
      user.userId,
      user.roleUserId,
      user.username,
      user.role,
      user.email,
      user.phoneNumber,
      user.isActive ? 'Active' : 'Inactive',
    ]);

    // Add the table using autoTable
    autoTable(doc, {
      head: [['User ID', 'Role User ID', 'Username', 'Role', 'Email', 'Phone Number', 'Status']],
      body: tableData,
      startY: 30, // Position below the title
      theme: 'striped',
    });

    // Save the PDF
    doc.save('user-list.pdf');
  }

}
