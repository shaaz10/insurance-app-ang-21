# Insurance Application Complete Workflow

## Overview
This document describes the complete end-to-end workflow for insurance requests, policy applications, and claims processing.

## Workflow Stages

### 1. Customer Requests Insurance
**Status:** `pending_agent_assignment`
- Customer submits insurance request through customer dashboard
- Request includes: insurance type, coverage amount, description
- Stored in `insuranceRequests` collection
- Admin receives notification

### 2. Admin Assigns Agent
**Status:** `agent_assigned`
- Admin reviews pending requests
- Assigns appropriate agent based on specialization
- Agent receives notification
- Request moves to agent's queue

### 3. Agent Advises Customer
**Status:** `agent_advising`
- Agent contacts customer
- Recommends suitable insurance plans
- Discusses coverage options and premiums
- Customer decides on plan

### 4. Customer Submits Application
**Status:** `application_submitted`
- Customer fills detailed application form
- Uploads required documents (ID, medical reports, etc.)
- Stored in `policyApplications` collection
- Agent receives notification

### 5. Agent Reviews Application
**Status:** `agent_reviewing`
- Agent verifies all documents
- Checks customer eligibility
- Adds recommendations/notes
- Can request additional documents

### 6. Agent Forwards to Admin
**Status:** `submitted_to_admin`
- Agent approves and forwards application
- Includes agent notes and recommendations
- Admin receives in approval queue

### 7. Admin Approves Policy
**Status:** `approved` → Creates Policy
- Admin reviews application
- Approves coverage and premium
- Creates official policy in `policies` collection
- Policy number generated (POL-YYYY-NNNN)
- Customer and agent notified

### 8. Customer Files Claim
**Status:** `pending_agent_review`
- Customer submits claim with documents
- Stored in `claims` collection
- Agent receives notification

### 9. Agent Reviews Claim
**Status:** `agent_reviewed`
- Agent verifies claim against policy
- Checks customer records
- Adds notes and recommendation
- Forwards to admin

### 10. Admin Approves Claim
**Status:** `approved`
- Admin reviews claim and agent notes
- Approves claim amount
- Creates payment record
- Customer receives payout

### 11. Payment Processing
**Status:** `completed`
- All payments (premiums, claims) go to admin
- Stored in `payments` collection
- Payment tracking and history

## Data Models

### Insurance Request
```json
{
  "id": "1",
  "requestNumber": "REQ-2024-001",
  "customerId": "3",
  "customerName": "Sarah Customer",
  "insuranceType": "Health",
  "status": "pending_agent_assignment | agent_assigned | completed",
  "agentId": null,
  "agentName": null,
  "description": "Customer requirements",
  "requestedCoverage": 500000,
  "requestDate": "2024-01-20T10:00:00.000Z"
}
```

### Policy Application
```json
{
  "id": "1",
  "applicationNumber": "APP-2024-001",
  "requestId": "2",
  "customerId": "3",
  "agentId": "2",
  "insuranceType": "Auto",
  "status": "draft | submitted_to_admin | approved | rejected",
  "recommendedPlan": "Plan name",
  "coverageAmount": 25000,
  "premium": 120,
  "documents": ["file1.pdf", "file2.pdf"],
  "agentNotes": "Agent recommendations",
  "submittedDate": "2024-01-22T11:00:00.000Z"
}
```

### Policy
```json
{
  "id": "1",
  "policyNumber": "POL-2024-001",
  "applicationId": "1",
  "type": "Auto",
  "status": "active | expired | cancelled",
  "customerId": "3",
  "agentId": "2",
  "premium": 1200,
  "coverageAmount": 50000,
  "startDate": "2024-01-01",
  "endDate": "2025-01-01",
  "approvedBy": "1",
  "approvedDate": "2023-12-28T00:00:00.000Z"
}
```

### Claim
```json
{
  "id": "1",
  "claimNumber": "CLM-2024-001",
  "policyId": "1",
  "customerId": "3",
  "agentId": "2",
  "status": "pending_agent_review | agent_reviewed | approved | rejected",
  "type": "Accident",
  "amount": 3500,
  "description": "Claim details",
  "documents": ["file1.pdf"],
  "filedDate": "2024-01-16T10:00:00.000Z",
  "agentNotes": "Agent verification",
  "adminNotes": "Admin decision",
  "approvedAmount": 3500,
  "approvedBy": "1",
  "approvedDate": "2024-01-18T00:00:00.000Z"
}
```

### Payment
```json
{
  "id": "1",
  "paymentNumber": "PAY-2024-001",
  "type": "premium | claim_payout",
  "policyId": "1",
  "claimId": null,
  "customerId": "3",
  "amount": 1200,
  "status": "pending | completed | failed",
  "paymentMethod": "credit_card | bank_transfer",
  "paymentDate": "2024-01-01T00:00:00.000Z"
}
```

## Status Flow

### Insurance Request Statuses:
1. `pending_agent_assignment` → Admin assigns agent
2. `agent_assigned` → Agent contacts customer
3. `completed` → Application submitted

### Application Statuses:
1. `draft` → Customer filling form
2. `submitted_to_agent` → Agent reviewing
3. `submitted_to_admin` → Admin reviewing
4. `approved` → Policy created
5. `rejected` → Application denied

### Claim Statuses:
1. `pending_agent_review` → Agent reviewing
2. `agent_reviewed` → Forwarded to admin
3. `approved` → Payment processed
4. `rejected` → Claim denied

## User Roles & Permissions

### Customer:
- Submit insurance requests
- Fill policy applications
- Upload documents
- File claims
- View own policies and claims
- Make premium payments

### Agent:
- View assigned requests
- Advise customers
- Review applications
- Forward to admin
- Review claims
- Add recommendations

### Admin:
- Assign agents to requests
- Approve/reject applications
- Create policies
- Approve/reject claims
- Process payments
- View all data
- Manage agents

## Implementation Notes

- All data stored in JSON Server (db.json)
- No external backend required
- Real-time updates via polling or manual refresh
- File uploads simulated (store filenames only)
- Payment processing simulated
- Email notifications simulated (console logs)
