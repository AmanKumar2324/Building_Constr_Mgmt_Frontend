import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { ArchitectComponent } from './pages/architect/architect.component';
import { EngineerComponent } from './pages/engineer/engineer.component';
import { LoginComponent } from './pages/login/login.component';
import { ProjectManagerComponent } from './pages/project-manager/project-manager.component';
import { SiteSupervisorComponent } from './pages/site-supervisor/site-supervisor.component';
import { WorkerComponent } from './pages/worker/worker.component';

export const routes: Routes = [
    {path:'', redirectTo: '/login', pathMatch: 'full'},
    {path:'login', component:LoginComponent},
    { path: 'admin', component: AdminComponent, canActivate: [RoleGuard], data: { role: 'Admin' } },
    { path: 'project-manager', component: ProjectManagerComponent, canActivate: [RoleGuard], data: { role: 'Project Manager' } },
    { path: 'engineer', component: EngineerComponent, canActivate: [RoleGuard], data: { role: 'Engineer' } },
    { path: 'architect', component: ArchitectComponent, canActivate: [RoleGuard], data: { role: 'Architect' } },
    { path: 'site-supervisor', component: SiteSupervisorComponent, canActivate: [RoleGuard], data: { role: 'Site Supervisor' } },
    { path: 'worker', component: WorkerComponent, canActivate: [RoleGuard], data: { role: 'Worker' } },
    { path: '**', redirectTo: 'login' },
];
