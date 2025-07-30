import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authorizationGuardGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = localStorage.getItem('login_token');
  const router = inject(Router)
  if(isLoggedIn !== null){
    return true;
  }else{
    router.navigateByUrl('/login');
    return false;
  }
};
