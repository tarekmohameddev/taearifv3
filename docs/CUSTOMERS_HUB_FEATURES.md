# Customers Hub – Features Overview

A simple list of all features in the **Customers Hub** module.  
*Reference: [CUSTOMERS_HUB_API.md](./CUSTOMERS_HUB_API.md) · [CUSTOMERS_HUB_FRONTEND_GUIDE.md](./CUSTOMERS_HUB_FRONTEND_GUIDE.md)*

---

## 1. Customer Management

- **List customers** – Paginated list with filters and search
- **View customer** – Get one customer by ID (with optional related data)
- **Create customer** – Add new customer
- **Update customer** – Edit customer info
- **Update stage** – Move customer through lifecycle stages (with notes)
- **Delete customer** – Soft delete (or permanent for admin)

---

## 2. Customer Lifecycle (9 Stages)

- New lead → Qualified → Property matching → Site visit → Negotiation → Contract prep → Down payment → Closing → Post-sale

---

## 3. Actions / Requests Center

- **List actions** – Filter by status, type, priority, due date, assigned person, etc.
- **View action** – Get one action with customer and notes
- **Create action** – New request/task for a customer
- **Update action** – Change priority, due date, assignee
- **Complete action** – Mark done with outcome and notes
- **Dismiss action** – Cancel with reason
- **Snooze action** – Postpone until a date
- **Add note** – Add note to an action

---

## 4. Action Types

- New inquiry, Callback request, Property match, Follow-up, Document required, Payment due, Site visit, WhatsApp incoming, AI recommended

---

## 5. Bulk Operations (Actions)

- Bulk complete
- Bulk dismiss
- Bulk snooze
- Bulk assign (to employee)
- Bulk update (e.g. priority)

---

## 6. Statistics & Analytics

- **Actions stats** – Counts by status (pending, overdue, today, completed, etc.)
- **Customer stats** – Counts by stage, source, and other dimensions

---

## 7. Filters & Search

- **Filter options** – Get available values for dropdowns (stages, sources, cities, etc.)
- **Search customers** – Search by name, phone, email
- **Customer list filters** – Stage, source, priority, assignee, budget, property type, areas, city, tags, date ranges
- **Action list filters** – Status, type, priority, due date, city, budget, property type, assignee

---

## 8. Relationships (per Customer)

- **Property interests** – Add/link properties the customer is interested in
- **Interactions** – Log calls, WhatsApp, email, meetings
- **Appointments** – Add and manage appointments
- **Reminders** – Add reminders
- **Documents** – Upload and manage documents

---

## 9. Employee & Assignment

- **List employees** – Get employees for assignment dropdowns
- **Assign customer** – Assign or reassign customer to an employee
- **Assign action** – Assign action to an employee (single or bulk)

---

## 10. Auth & Permissions

- JWT authentication for all API calls
- Role-based access: Admin, Sales Manager, Sales Agent, Viewer
- Permissions: read/write/delete customers, read/write actions, limited bulk for agents

---

## 11. AI Insights

- AI insights: next best action, churn risk, property matches, predicted close date, recommended follow-up, engagement level, conversion probability, sentiment

---

## 12. Real-time (optional)

- WebSocket for live updates: new/updated actions, customer stage/assignment changes, stats refresh

---

## 13. Frontend Pages (from Frontend Guide)

- **Dashboard entry** – `/dashboard/customers-hub` (redirect)
- **Requests center** – `/dashboard/customers-hub/requests` (actions list, stats, complete/dismiss/snooze/assign)
- **Customers list** – `/dashboard/customers-hub/list` (customers table/grid/map, filters, pagination, add/edit)

---

*Last updated: February 2026*
