import { Routes } from '@angular/router';
import { Login } from './shared/components/login/login';
import { authorizationGuardGuard } from './core/guards/authorization-guard-guard';
import { AdminDashboard } from './shared/components/admin-dashboard/admin-dashboard';
import { EmployeeDashboard } from './shared/components/employee-dashboard/employee-dashboard';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component:Login
    },
    {
        path:'admin_dashboard',
        component:AdminDashboard,
        canActivate:[authorizationGuardGuard],
        children:[
            {
                path:'admin_dashboard',
                component:AdminDashboard
            }
        ]
    },
    {
        path:'employee_dashboard',
        component:EmployeeDashboard,
        canActivate:[authorizationGuardGuard],
        children:[
            {
                path:'employee_dashboard',
                component:EmployeeDashboard
            }
        ]
    }
];
