import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  // ---------------- واجهة المتجر (Public) ----------------
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent) },
  { path: 'shop', loadComponent: () => import('./pages/product-caty/product-caty.component').then((m) => m.ProductCatyComponent) },
  { path: 'product/:id', loadComponent: () => import('./pages/product-detail/product-detail.component').then((m) => m.ProductDetailComponent) },
  { path: 'cart', canActivate: [authGuard], loadComponent: () => import('./pages/cart/cart.component').then((m) => m.CartComponent) },
  { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./pages/checkout/checkout.component').then((m) => m.CheckoutComponent) },

  // ---------------- لوحة الإدارة (Admin) ----------------
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'categories', loadComponent: () => import('./pages/categories-index/categories-index.component').then((m) => m.CategoriesIndexComponent) },
      { path: 'categories/create', loadComponent: () => import('./pages/category-form/category-form.component').then((m) => m.CategoryFormComponent) },
      { path: 'categories/edit/:id', loadComponent: () => import('./pages/category-form/category-form.component').then((m) => m.CategoryFormComponent) },
      { path: 'categories/:id/products', loadComponent: () => import('./pages/category-products/category-products.component').then((m) => m.CategoryProductsComponent) },
      { path: 'products', loadComponent: () => import('./pages/products-index/products-index.component').then((m) => m.ProductsIndexComponent) },
      { path: 'products/create', loadComponent: () => import('./pages/product-form/product-form.component').then((m) => m.ProductFormComponent) },
      { path: 'products/edit/:id', loadComponent: () => import('./pages/product-form/product-form.component').then((m) => m.ProductFormComponent) },
      { path: 'products/:id', loadComponent: () => import('./pages/product-details/product-details.component').then((m) => m.ProductDetailsComponent) },
      { path: 'orders', loadComponent: () => import('./pages/orders-index/orders-index.component').then((m) => m.OrdersIndexComponent) },
      { path: 'orders/:id', loadComponent: () => import('./pages/order-details/order-details.component').then((m) => m.OrderDetailsComponent) },
      { path: 'users', loadComponent: () => import('./pages/users/users.component').then((m) => m.UsersComponent) }
    ]
  },

  { path: '**', redirectTo: '' }
];
