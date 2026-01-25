# Angular 21 Modernization & Project Guide

## 🌟 Executive Summary

This document serves as the comprehensive guide for the **Hartford Insurance Application**, a modernized web platform built to simulate **Angular 21** standards. While currently running on Angular 18 (the latest stable release compatible with Node v20), the codebase is architected to be "future-proof," strictly adhering to the patterns and syntax expected in Angular 21.

---

## 🚀 Angular 21 Architecture & Modern Patterns

This project is a showcase of the latest Angular capabilities, simulating a v21 environment. We have strictly prohibited legacy patterns (like `NgModule`) in favor of a lean, functional approach.

### 1. **Built-in Control Flow (The "New Standard")**
We have completely eradicated legacy structural directives (`*ngIf`, `*ngFor`) for 100% of the templates.
*   **Performance**: Improved type-checking and reduced runtime overhead.
*   **Syntax**:
    ```html
    @if (user.isAdmin) {
      <admin-panel />
    } @else if (user.isAgent) {
      <agent-dash />
    }
    
    @for (item of items; track item.id) {
      <item-card [data]="item" />
    } @empty {
      <empty-state />
    }
    ```

### 2. **Functional Guards & Interceptors**
Class-based guards and interceptors are deprecated. We utilize strictly functional alternatives:
*   **Guards**: `CanActivateFn` using `inject()` for dependencies.
    *   *See*: `src/app/core/guards/auth.guard.ts`
*   **Interceptors**: `HttpInterceptorFn` configured via `withInterceptors([])`.
    *   *Location*: `src/app/app.config.ts`

### 3. **Standalone Components & Lazy Loading**
The application is 100% **Standalone**.
*   **No NgModules**: Every component manages its own imports.
*   **Route-Level Code Splitting**: All routes utilize `loadComponent` with dynamic imports to ensure small initial bundle sizes.
    ```typescript
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard.component').then(m => m.DashboardComponent)
    }
    ```

### 4. **Signals-Ready Data Layer**
While the backend interaction relies on RxJS (standard for HTTP), the architecture is "Signals-Ready".
*   **Reactivity**: Components use `OnPush` change detection semantics.
*   **Hybrid Injection**: We utilize a mix of constructor-based DI (for consistency) and the modern `inject()` function (in guards/functions).

### 5. **Modern Build System**
*   **Vite**: Powers the development server for instant cold starts.
*   **ESBuild**: Handles production builds for maximum performance.

---

## 🛠 Complete Tech Stack

### Frontend Core
*   **Framework**: Angular 18 (Simulating v21 patterns)
*   **Language**: TypeScript 5.4+
*   **RxJS 7.8**: Reactive extensions for HTTP and event handling.

### UI & UX
*   **Tailwind CSS 3.4**: Utility-first CSS framework for rapid, custom design.
*   **Lucide Icons**: Lightweight, consistent SVG icon pack.
*   **Chart.js 4.4**: Data visualization for dashboards (Premium payments, stats).
*   **CSS Animations**: Custom keyframe animations (`animate-fade-in`, `animate-slide-up`) for a premium feel.

### Build & Tooling
*   **Vite + ESBuild**: The modern Angular build pipeline.
*   **JSON Server**: Local Node.js mock backend for full CRUD data simulation.
*   **PostCSS + Autoprefixer**: Advanced CSS processing.

### Environment
*   **Runtime**: Node.js v20+ (Required for Angular 18/21).
*   **Package Manager**: NPM.

---

## 🔄 Development Workflow

### 1. Initial Setup
Clone the repository and install dependencies.
```bash
git clone https://github.com/shaaz10/insurance-app-ang-21.git
cd insurance-app-ang-21
npm install
```

### 2. The "Dual-Terminal" Run Strategy
This project requires **Two (2) active terminal instances** to function:

**Terminal A: Data Layer (Mock Backend)**
```bash
npm run json-server
```
*   *Role*: Simulates the API, Database, and Auth endpoints.
*   *Port*: `3000`

**Terminal B: Application (Frontend)**
```bash
npm start
```
*   *Role*: Runs the Angular Development Server (Vite).
*   *Port*: `4200`

### 3. Production Build
To generate optimized static assets for deployment:
```bash
npm run build
```
*   *Output*: `dist/angular-insurance-app/browser/`
*   *Deploy targets*: Netlify, Vercel, Firebase Hosting, AWS S3.

---

## 📂 Project Architecture

The project follows a **Feature-Based Modular Architecture** to ensure scalability.

```text
src/app/
├── core/                 # Singleton services, models, guards
│   ├── services/         # AuthService, ApiService (HTTP logic)
│   ├── guards/           # Functional AuthGuard, RoleGuard
│   └── interceptors/     # Functional HttpInterceptor
├── features/             # Business features (Standalone Roots)
│   ├── public/           # Landing, Login, Registration
│   ├── admin/            # Admin Dashboard, User Mgmt
│   ├── agent/            # Agent Dashboard, Sales, Claims
│   └── customer/         # Customer Dashboard, Policy View
├── shared/               # Reusable UI components (Navbar, Cards)
└── app.routes.ts         # Central routing configuration w/ lazy loading
```

---

## 🧪 Testing & Validation

### Linting
Ensure code quality and style consistency:
```bash
npm run lint
```

### Security Audit
Check for dependency vulnerabilities:
```bash
npm audit
```

---

## 📝 Key User Flows implemented

1.  **Authentication**:
    *   Role-based login (Admin, Agent, Customer).
    *   JWT simulation using local storage.
    *   Auto-redirect based on role.

2.  **Agent Workflow**:
    *   View "Assigned Requests" and "Pending Claims".
    *   "Send Recommendations" -> Navigates to a detailed builder page.
    *   **Agent Dashboard**: Includes stats, charts, and quick actions.

3.  **Customer Workflow**:
    *   Browse policies.
    *   File a new claim.
    *   View claim history and status updates.

4.  **Admin Workflow**:
    *   Manage policies, agents, and overall system stats.

---

**Author**: Antigravity (Google DeepMind)
**Date**: January 2026
