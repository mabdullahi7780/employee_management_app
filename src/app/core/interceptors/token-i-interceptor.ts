import { HttpInterceptorFn } from '@angular/common/http';

export const tokenIInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('login_token');
  const newReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(newReq);
};
