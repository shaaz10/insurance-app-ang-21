# 🔐 Authentication & Policy Request Flow - Implementation Guide

## Issues Fixed

### 1. ✅ **Authentication Persistence**
**Problem:** User had to sign in again when navigating to Home page
**Solution:** 
- Updated `NavbarComponent` to read from `AuthService.getCurrentUser()`
- Auth data is stored in localStorage by AuthService
- Navbar now automatically detects logged-in users across all pages

**How it works:**
```typescript
ngOnInit() {
  const currentUser = this.authService.getCurrentUser();
  if (currentUser) {
    this.currentUserName = currentUser.name;
    this.currentUserRole = currentUser.role;
  }
}
```

### 2. 🔄 **Policy Request Flow** (To Be Implemented)

**User Journey:**
1. Customer browses policies on `/browse-policies`
2. Clicks "Get Quote" on a policy
3. If NOT logged in → Redirect to `/register` with policy info
4. If logged in → Create insurance request in JSON server
5. Request appears in Admin Dashboard for agent assignment

**Implementation Steps:**

#### Step 1: Update Browse Policies Component
```typescript
requestQuote(product: InsuranceProduct) {
  const currentUser = this.authService.getCurrentUser();
  
  if (!currentUser) {
    // Redirect to register with product info
    this.router.navigate(['/register'], {
      queryParams: { 
        product: product.id, 
        type: product.type,
        returnUrl: '/customer'
      }
    });
  } else {
    // Create insurance request
    this.createInsuranceRequest(product);
  }
}

createInsuranceRequest(product: InsuranceProduct) {
  const request = {
    requestNumber: `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    customerId: currentUser.id,
    customerName: currentUser.name,
    insuranceType: product.type,
    status: 'pending_agent_assignment',
    requestedCoverage: product.coverageRange,
    requestDate: new Date().toISOString(),
    description: `Request for ${product.name}`
  };
  
  this.http.post('http://localhost:3000/insuranceRequests', request)
    .subscribe(() => {
      alert('Insurance request submitted! An agent will contact you soon.');
      this.router.navigate(['/customer']);
    });
}
```

#### Step 2: Update Register Component
```typescript
ngOnInit() {
  // Check for product query params
  this.route.queryParams.subscribe(params => {
    if (params['product']) {
      this.selectedProduct = params['product'];
      this.selectedType = params['type'];
      this.returnUrl = params['returnUrl'] || '/customer';
    }
  });
}

onSubmit() {
  // After successful registration
  if (this.selectedProduct) {
    // Auto-create insurance request
    this.createInsuranceRequest();
  } else {
    this.router.navigate([this.returnUrl]);
  }
}
```

#### Step 3: Add Request Insurance Page (Customer Dashboard)
Create a dedicated page for customers to view and manage their requests:

```typescript
// customer-requests.component.ts
export class CustomerRequestsComponent implements OnInit {
  requests: InsuranceRequest[] = [];
  
  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.http.get(`http://localhost:3000/insuranceRequests?customerId=${currentUser.id}`)
      .subscribe(data => this.requests = data);
  }
}
```

## Data Flow

### Authentication Flow:
```
Login → AuthService.login() → 
  Store in localStorage (currentUser, token) → 
  Navigate to role-based dashboard → 
  NavbarComponent reads from AuthService → 
  User stays logged in across navigation
```

### Policy Request Flow:
```
Browse Policies → Click "Get Quote" →
  Check if logged in:
    YES → Create insuranceRequest in JSON server →
          Admin sees in dashboard →
          Admin assigns agent →
          Agent contacts customer
    NO  → Redirect to register →
          After registration, auto-create request
```

## JSON Server Endpoints

### Insurance Requests:
- **GET** `/insuranceRequests` - Get all requests
- **GET** `/insuranceRequests?customerId=X` - Get customer's requests
- **GET** `/insuranceRequests?status=pending_agent_assignment` - Get pending requests
- **POST** `/insuranceRequests` - Create new request
- **PUT** `/insuranceRequests/:id` - Update request (assign agent, etc.)

### Example Request Object:
```json
{
  "id": "1",
  "requestNumber": "REQ-2024-001",
  "customerId": "3",
  "customerName": "Sarah Customer",
  "insuranceType": "health",
  "status": "pending_agent_assignment",
  "agentId": null,
  "agentName": null,
  "requestedCoverage": 500000,
  "requestDate": "2024-01-20T10:00:00Z",
  "description": "Request for Comprehensive Health Insurance"
}
```

## Testing Steps

### Test Authentication Persistence:
1. Login as customer
2. Navigate to Home (/)
3. ✅ User should still be logged in (name shows in navbar)
4. Navigate to Browse Policies
5. ✅ User should still be logged in
6. Click "My Dashboard"
7. ✅ Should navigate without re-login

### Test Policy Request Flow:
1. **As Guest:**
   - Go to Browse Policies
   - Click "Get Quote" on any policy
   - Should redirect to Register with product info
   - Complete registration
   - Should auto-create insurance request
   - Should see request in customer dashboard

2. **As Logged-in Customer:**
   - Go to Browse Policies
   - Click "Get Quote" on any policy
   - Should create insurance request immediately
   - Should see success message
   - Should redirect to customer dashboard
   - Request should appear in "My Requests" section

3. **As Admin:**
   - Login as admin
   - Go to Admin Dashboard
   - Should see new request in "Pending Requests"
   - Click "Assign Agent"
   - Select an agent
   - Request status should update

## Next Steps

1. ✅ Fix authentication persistence (DONE)
2. 🔄 Implement policy request flow in Browse Policies
3. 🔄 Add "My Requests" section to Customer Dashboard
4. 🔄 Update Register component to handle product params
5. 🔄 Test complete end-to-end flow

---

**Status:** Authentication Fixed ✅ | Policy Request Flow In Progress 🔄
**Last Updated:** 2024-01-24
