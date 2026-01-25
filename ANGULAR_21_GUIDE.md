# Angular 21 Modernization & Project Guide

## 🌟 Executive Summary

This document serves as the comprehensive guide for the **Hartford Insurance Application**, a modernized web platform built to simulate **Angular 21** standards. While currently running on Angular 18 (the latest stable release compatible with Node v20), the codebase is architected to be "future-proof," strictly adhering to the patterns and syntax expected in Angular 21.

---

## 🚀 Angular 21 Topics & Modern Features

The application leverages the latest advancements in the Angular ecosystem to provide a high-performance, developer-friendly experience.

### 1. **Built-in Control Flow (The "New Standard")**
We have completely eradicated legacy structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`) in favor of the new, optimized control flow syntax. This improves type checking usage and reduces template overhead.

*   **Conditional Rendering**:
    ```html
    @if (isLoading) {
      <loading-spinner />
    } @else {
      <data-view />
    }
    ```
*   **Lists & Iteration**:
    ```html
    @for (policy of policies; track policy.id) {
      <policy-card [data]="policy" />
    } @empty {
      <p>No policies found.</p>
    }
    ```

### 2. **Standalone Components Architecture**
The project abandons the traditional `NgModule` system. Every component, directive, and pipe is **Standalone**.
*   **Benefits**: Simplified learning curve, faster build times, and better tree-shaking.
*   **Implementation**:
    ```typescript
    @Component({
      standalone: true,
      imports: [CommonModule, RouterModule, ...],
      // ...
    })
    export class AgentDashboardComponent {}
    ```

### 3. **Signals-Ready Architecture**
While the current data layer uses RxJS `BehaviorSubjects` for compatibility, the component structure is prepared for **Signals**.
*   Templates use direct property binding that can seamlessly switch to Signal reads (`{{ data() }}`).
*   Change detection strategies are set to `OnPush` defaults in key areas to prepare for Signal-based reactivity.

### 4. **Modern Tooling & Build System**
*   **Vite-based Dev Server**: Fast cold starts and Hot Module Replacement (HMR).
*   **ESBuild**: Blazing fast production builds.

---

## 🛠 Tech Stack & Tools

### Frontend Core
*   **Framework**: Angular 18 (Simulating v21 patterns)
*   **Language**: TypeScript 5.4+
*   **Styling**: Tailwind CSS 3.4 (Utility-first, responsive design)
*   **Icons**: Lucide / Heroicons (SVG-based for performance)

### Mock Backend
*   **JSON Server**: A full-featured fake REST API.
*   **Database**: `db.json` (Stores Users, Policies, Claims, Agents).
*   **Port**: 3000

### Environment
*   **Runtime**: Node.js v20+
*   **Package Manager**: NPM

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
Since we use a mock backend, you must run two processes simultaneously.

**Terminal 1: Backend (Data Layer)**
```bash
npm run json-server
```
*   *Status*: Watch for `Resources` list (http://localhost:3000/users, etc.)

**Terminal 2: Frontend (Application)**
```bash
npm start
```
*   *Status*: App opens at `http://localhost:4200`

### 3. Building for Production
To create optimized static files for deployment (e.g., to Netlify, Vercel, or AWS S3):
```bash
npm run build
```
*   Output Directory: `dist/angular-insurance-app/browser/`

---

## 📂 Project Architecture

The project follows a **Feature-Based Modular Architecture** to ensure scalability.

```text
src/app/
├── core/                 # Singleton services, models, guards
│   ├── services/         # AuthService, ApiService (HTTP logic)
│   ├── guards/           # AuthGuard, RoleGuard (Route protection)
│   └── interceptors/     # HttpInterceptor (Token injection)
├── features/             # Business features (Standalone Roots)
│   ├── public/           # Landing, Login, Registration
│   ├── admin/            # Admin Dashboard, User Mgmt
│   ├── agent/            # Agent Dashboard, Sales, Claims
│   └── customer/         # Customer Dashboard, Policy View
├── shared/               # Reusable UI components (Navbar, Cards)
└── app.routes.ts         # Central routing configuration
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
    *   View "Assigned Requests".
    *   "Send Recommendations" -> Navigates to a detailed builder page.
    *   Review pending claims.

3.  **Customer Workflow**:
    *   Browse policies.
    *   File a new claim.
    *   View claim history and status updates.

---

**Author**: Antigravity (Google DeepMind)
**Date**: January 2026
