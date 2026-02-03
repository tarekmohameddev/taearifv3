# Customers Hub – Frontend Developer Guide

**Version:** 1.0.0  
**Last Updated:** February 2, 2026  
**Companion Doc:** [CUSTOMERS_HUB_API.md](./CUSTOMERS_HUB_API.md) (backend API contract)

This guide explains how to integrate the Customers Hub frontend with the backend API: where to call APIs, how to map responses to your store, and how to handle errors and loading states.

---

## Table of Contents

1. [Overview](#overview)
2. [API Client Setup](#api-client-setup)
3. [TypeScript Types](#typescript-types)
4. [API Service Layer](#api-service-layer)
5. [Store Integration](#store-integration)
6. [Page-by-Page Integration](#page-by-page-integration)
7. [Requests Center Page](#requests-center-page)
8. [Customers List Page](#customers-list-page)
9. [Error Handling](#error-handling)
10. [Loading & Optimistic Updates](#loading--optimistic-updates)
11. [Pagination & Filters](#pagination--filters)
12. [Real-time Updates (WebSocket)](#real-time-updates-websocket)
13. [File Upload](#file-upload)
14. [Replacing Mock Data Checklist](#replacing-mock-data-checklist)
15. [Testing & Debugging](#testing--debugging)

---

## Overview

### Current State

- **Store:** `context/store/unified-customers.ts` – Zustand store with `customers`, `actions`, filters, pagination.
- **Mock data:** `lib/mock/customers-hub-data.ts` – used on requests page and list.
- **API client:** `lib/axiosInstance.js` – axios instance with auth and error interceptors.
- **Types:** `types/unified-customer.ts` – `UnifiedCustomer`, `CustomerAction`, filters, etc.

### Integration Goal

1. Replace mock data with real API calls.
2. Keep existing UI and store shape; only change **where** data comes from (API instead of mock).
3. Use a small **API service layer** so all API URLs and response mapping live in one place.

### Data Flow (High Level)

```
User opens page
    → Page/component calls store method (e.g. fetchCustomers, fetchActions)
    → Store calls API service (e.g. customersApi.list, actionsApi.list)
    → API service uses axiosInstance (baseURL + token from AuthContext)
    → Response mapped to UnifiedCustomer[] / CustomerAction[]
    → Store setState (setCustomers, setActions, setStatistics, etc.)
    → UI re-renders from store
```

---

## API Client Setup

### Existing Setup

You already have:

- **Base URL:** `process.env.NEXT_PUBLIC_Backend_URL` (e.g. `https://api.taearif.com/api` or `http://localhost:3000/api`).
- **Auth:** `Authorization: Bearer <token>` from `useAuthStore.getState().userData?.token`.
- **Axios instance:** `lib/axiosInstance.js` – use this for **all** Customers Hub API calls.

Do **not** create a second axios instance for customers-hub; reuse this one so auth and error handling stay consistent.

### API Version Prefix

Backend uses versioned base path (e.g. `/v1`). Your `baseURL` might already include it, or you add it in the service layer.

**Option A – baseURL includes version:**
```env
NEXT_PUBLIC_Backend_URL=https://api.taearif.com/api/v1
```

**Option B – add prefix in service:**
```typescript
const API_PREFIX = '/v1';
axiosInstance.get(`${API_PREFIX}/customers`, { params });
```

Use the same convention as the rest of your app (e.g. properties, auth).

### Optional: Organization / Locale Headers

If the backend expects them (see [CUSTOMERS_HUB_API.md](./CUSTOMERS_HUB_API.md)):

```typescript
// In your API service or a small helper
axiosInstance.defaults.headers.common['X-Organization-ID'] = orgId; // from auth or context
// If you need locale for API
axiosInstance.defaults.headers.common['Accept-Language'] = locale; // e.g. 'ar'
```

Add these only if your backend contract requires them.

---

## TypeScript Types

### Use Existing Types

All request/response shapes should align with:

- **File:** `types/unified-customer.ts`
- **Main types:** `UnifiedCustomer`, `CustomerAction`, `CustomerFilters`, `CustomerStatistics`, `CustomerActionType`, `CustomerActionStatus`, `Priority`, `CustomerSource`, etc.

Do **not** redefine these; import from `@/types/unified-customer`.

### API Response Wrapper

Backend returns a consistent envelope. Add a small type for it:

```typescript
// types/api.ts or at top of your customers-hub API service

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
  meta?: { timestamp: string; requestId?: string };
}

// List responses with pagination
export interface PaginatedData<T> {
  [key: string]: T[] | Pagination | undefined; // e.g. customers or actions
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

Use `ApiResponse<...>` when typing `response.data` so you can safely access `response.data.data` and `response.data.data.pagination`.

---

## API Service Layer

### Purpose

- Single place for all Customers Hub endpoints.
- Build query params from your store filters/pagination.
- Map backend response → your store types (`UnifiedCustomer[]`, `CustomerAction[]`, etc.).
- Throw or return errors in a consistent shape for the store to handle.

### Suggested Location

- `services/customers-hub/customersApi.ts` – customers CRUD + list.
- `services/customers-hub/actionsApi.ts` – actions/requests CRUD + list + bulk.
- `services/customers-hub/statisticsApi.ts` – stats (optional, can live in customersApi).
- `services/customers-hub/index.ts` – re-export.

If you prefer a single file: `services/customers-hub/api.ts`.

### Example: Customers API Service

```typescript
// services/customers-hub/customersApi.ts

import axiosInstance from '@/lib/axiosInstance';
import type { UnifiedCustomer, CustomerFilters } from '@/types/unified-customer';
import type { ApiResponse, Pagination } from '@/types/api';

const BASE = '/v1/customers'; // or your actual base path

export interface ListCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  stage?: string[];
  source?: string[];
  priority?: string[];
  assignedEmployeeId?: string[];
  leadScoreMin?: number;
  leadScoreMax?: number;
  budgetMin?: number;
  budgetMax?: number;
  propertyType?: string[];
  city?: string[];
  tags?: string[];
  createdFrom?: string;
  createdTo?: string;
  lastContactFrom?: string;
  lastContactTo?: string;
  sortBy?: 'name' | 'createdAt' | 'leadScore' | 'lastContactAt' | 'dealValue';
  sortOrder?: 'asc' | 'desc';
}

function toQueryParams(filters: CustomerFilters & { page?: number; limit?: number; sortBy?: string; sortOrder?: string }): Record<string, string | number | undefined> {
  const params: Record<string, string | number | undefined> = {};
  if (filters.page != null) params.page = filters.page;
  if (filters.limit != null) params.limit = filters.limit;
  if (filters.search) params.search = filters.search;
  if (filters.stage?.length) params.stage = filters.stage;
  if (filters.source?.length) params.source = filters.source;
  if (filters.priority?.length) params.priority = filters.priority;
  if (filters.assignedEmployee?.length) params.assignedEmployeeId = filters.assignedEmployee;
  if (filters.leadScoreMin != null) params.leadScoreMin = filters.leadScoreMin;
  if (filters.leadScoreMax != null) params.leadScoreMax = filters.leadScoreMax;
  if (filters.budgetMin != null) params.budgetMin = filters.budgetMin;
  if (filters.budgetMax != null) params.budgetMax = filters.budgetMax;
  if (filters.propertyType?.length) params.propertyType = filters.propertyType;
  if (filters.preferredAreas?.length) params.preferredAreas = filters.preferredAreas;
  if (filters.tags?.length) params.tags = filters.tags;
  if (filters.createdFrom) params.createdFrom = filters.createdFrom;
  if (filters.createdTo) params.createdTo = filters.createdTo;
  if (filters.lastContactFrom) params.lastContactFrom = filters.lastContactFrom;
  if (filters.lastContactTo) params.lastContactTo = filters.lastContactTo;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;
  return params;
}

export const customersApi = {
  async list(params: ListCustomersParams): Promise<{ customers: UnifiedCustomer[]; pagination: Pagination }> {
    const { data } = await axiosInstance.get<ApiResponse<{ customers: UnifiedCustomer[]; pagination: Pagination }>>(BASE, {
      params: toQueryParams(params as any),
    });
    if (!data.success || !data.data) throw new Error('Invalid response');
    return data.data;
  },

  async getById(id: string, include?: string[]): Promise<UnifiedCustomer> {
    const { data } = await axiosInstance.get<ApiResponse<{ customer: UnifiedCustomer }>>(`${BASE}/${id}`, {
      params: include?.length ? { include: include.join(',') } : undefined,
    });
    if (!data.success || !data.data.customer) throw new Error('Customer not found');
    return data.data.customer;
  },

  async create(payload: Partial<UnifiedCustomer>): Promise<UnifiedCustomer> {
    const { data } = await axiosInstance.post<ApiResponse<{ customer: UnifiedCustomer }>>(BASE, payload);
    if (!data.success || !data.data.customer) throw new Error('Create failed');
    return data.data.customer;
  },

  async update(id: string, updates: Partial<UnifiedCustomer>): Promise<UnifiedCustomer> {
    const { data } = await axiosInstance.put<ApiResponse<{ customer: UnifiedCustomer }>>(`${BASE}/${id}`, updates);
    if (!data.success || !data.data.customer) throw new Error('Update failed');
    return data.data.customer;
  },

  async updateStage(id: string, toStage: string, notes?: string): Promise<void> {
    await axiosInstance.patch(`${BASE}/${id}/stage`, { toStage, notes });
  },

  async delete(id: string, permanent?: boolean): Promise<void> {
    await axiosInstance.delete(`${BASE}/${id}`, { params: { permanent } });
  },
};
```

### Example: Actions API Service

```typescript
// services/customers-hub/actionsApi.ts

import axiosInstance from '@/lib/axiosInstance';
import type { CustomerAction } from '@/types/unified-customer';
import type { ApiResponse, Pagination } from '@/types/api';

const BASE = '/v1/customers/actions';

export interface ListActionsParams {
  page?: number;
  limit?: number;
  customerId?: string;
  status?: string[];
  type?: string[];
  priority?: string[];
  source?: string[];
  assignedTo?: string[];
  dueDate?: 'all' | 'overdue' | 'today' | 'week' | 'no_date';
  city?: string[];
  state?: string[];
  budgetMin?: number;
  budgetMax?: number;
  propertyType?: string[];
  search?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export const actionsApi = {
  async list(params: ListActionsParams): Promise<{ actions: CustomerAction[]; pagination: Pagination }> {
    const { data } = await axiosInstance.get<ApiResponse<{ actions: CustomerAction[]; pagination: Pagination }>>(BASE, { params });
    if (!data.success || !data.data) throw new Error('Invalid response');
    return data.data;
  },

  async getById(id: string): Promise<CustomerAction> {
    const { data } = await axiosInstance.get<ApiResponse<{ action: CustomerAction }>>(`${BASE}/${id}`);
    if (!data.success || !data.data.action) throw new Error('Action not found');
    return data.data.action;
  },

  async complete(id: string, body?: { outcome?: string; notes?: string }): Promise<CustomerAction> {
    const { data } = await axiosInstance.post<ApiResponse<{ action: CustomerAction }>>(`${BASE}/${id}/complete`, body ?? {});
    if (!data.success || !data.data.action) throw new Error('Complete failed');
    return data.data.action;
  },

  async dismiss(id: string, body?: { reason?: string; notes?: string }): Promise<void> {
    await axiosInstance.post(`${BASE}/${id}/dismiss`, body ?? {});
  },

  async snooze(id: string, snoozedUntil: string, notes?: string): Promise<void> {
    await axiosInstance.post(`${BASE}/${id}/snooze`, { snoozedUntil, notes });
  },

  async addNote(id: string, content: string): Promise<void> {
    await axiosInstance.post(`${BASE}/${id}/notes`, { content });
  },

  async bulkComplete(actionIds: string[], notes?: string): Promise<{ completedCount: number }> {
    const { data } = await axiosInstance.post<ApiResponse<{ completedCount: number }>>(`${BASE}/bulk/complete`, { actionIds, notes });
    if (!data.success) throw new Error('Bulk complete failed');
    return data.data;
  },

  async bulkDismiss(actionIds: string[], reason?: string): Promise<void> {
    await axiosInstance.post(`${BASE}/bulk/dismiss`, { actionIds, reason });
  },

  async bulkSnooze(actionIds: string[], snoozedUntil: string): Promise<void> {
    await axiosInstance.post(`${BASE}/bulk/snooze`, { actionIds, snoozedUntil });
  },

  async bulkAssign(actionIds: string[], assignedTo: string, assignedToName: string): Promise<void> {
    await axiosInstance.post(`${BASE}/bulk/assign`, { actionIds, assignedTo, assignedToName });
  },

  async bulkUpdatePriority(actionIds: string[], priority: string): Promise<void> {
    await axiosInstance.post(`${BASE}/bulk`, {
      actionIds,
      operation: 'update',
      updates: { priority },
    });
  },
};
```

### Example: Statistics API

```typescript
// services/customers-hub/statisticsApi.ts

import axiosInstance from '@/lib/axiosInstance';
import type { CustomerStatistics } from '@/types/unified-customer';
import type { ApiResponse } from '@/types/api';

export const statisticsApi = {
  async getActionsStats(params?: { assignedTo?: string; dateFrom?: string; dateTo?: string }) {
    const { data } = await axiosInstance.get<ApiResponse<{ stats: any }>>('/v1/customers/actions/stats', { params });
    if (!data.success) throw new Error('Failed to fetch action stats');
    return data.data.stats;
  },

  async getCustomerStats(params?: { dateFrom?: string; dateTo?: string }) {
    const { data } = await axiosInstance.get<ApiResponse<{ stats: CustomerStatistics }>>('/v1/customers/stats', { params });
    if (!data.success) throw new Error('Failed to fetch customer stats');
    return data.data.stats;
  },
};
```

You can add more methods (filters options, employees list, etc.) following the same pattern and the [CUSTOMERS_HUB_API.md](./CUSTOMERS_HUB_API.md) contract.

---

## Store Integration

### Where to Call the API

- Keep **all** API calls inside the store (or inside small hooks that call the store). Pages/components should only call store methods like `fetchCustomers()`, `fetchActions()`, `completeAction(id)`, etc.
- This keeps UI free of URLs and response shapes; the store remains the single source of truth.

### Updating `fetchCustomers` in `unified-customers.ts`

Replace the stub with real API + your filters/pagination:

```typescript
// In context/store/unified-customers.ts

import { customersApi } from '@/services/customers-hub/customersApi';
import { actionsApi } from '@/services/customers-hub/actionsApi';
import { statisticsApi } from '@/services/customers-hub/statisticsApi';

// Inside the store definition:

fetchCustomers: async () => {
  const userData = useAuthStore.getState().userData;
  if (!userData?.token) {
    set({ error: 'يجب تسجيل الدخول' });
    return;
  }

  const { filters, currentPage, pageSize, sortBy, sortOrder } = get();
  set({ isLoading: true, error: null });

  try {
    const { customers, pagination } = await customersApi.list({
      page: currentPage,
      limit: pageSize,
      search: get().searchTerm || undefined,
      stage: filters.stage,
      source: filters.source,
      priority: filters.priority,
      assignedEmployeeId: filters.assignedEmployee,
      leadScoreMin: filters.leadScoreMin,
      leadScoreMax: filters.leadScoreMax,
      budgetMin: filters.budgetMin,
      budgetMax: filters.budgetMax,
      propertyType: filters.propertyType,
      preferredAreas: filters.preferredAreas,
      city: filters.city,
      tags: filters.tags,
      createdFrom: filters.createdFrom,
      createdTo: filters.createdTo,
      lastContactFrom: filters.lastContactFrom,
      lastContactTo: filters.lastContactTo,
      sortBy,
      sortOrder,
    });

    get().setCustomers(customers);
    set({
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
      totalPages: pagination.totalPages,
      totalCustomers: pagination.totalItems,
      lastFetched: Date.now(),
    });
  } catch (err: any) {
    const message = err.response?.data?.error?.message || err.message || 'فشل تحميل العملاء';
    set({ error: message });
  } finally {
    set({ isLoading: false });
  }
},
```

### New Store Methods for Actions (Requests Center)

Add (or extend) these in the store so the Requests page can use the API:

```typescript
// Fetch actions (for requests center)
fetchActions: async (params?: {
  status?: string[];
  type?: string[];
  priority?: string[];
  dueDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const userData = useAuthStore.getState().userData;
  if (!userData?.token) return;

  set({ isLoading: true, error: null });
  try {
    const { actions, pagination } = await actionsApi.list({
      status: params?.status ?? ['pending', 'in_progress'],
      type: params?.type,
      priority: params?.priority,
      dueDate: params?.dueDate,
      search: params?.search,
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
    });
    set({
      actions,
      filteredActions: actions,
      lastFetched: Date.now(),
    });
  } catch (err: any) {
    const message = err.response?.data?.error?.message || err.message || 'فشل تحميل الطلبات';
    set({ error: message });
  } finally {
    set({ isLoading: false });
  }
},

// Fetch action statistics (for the stats bar on requests page)
fetchActionsStats: async () => {
  try {
    const stats = await statisticsApi.getActionsStats();
    // Store in state, e.g. set({ actionsStats: stats });
    // Use the same shape your UI expects (pending, inbox, followups, overdue, today, completed).
  } catch (err) {
    console.error('Failed to fetch action stats', err);
  }
},
```

### Wiring Mutations to the API

For single action updates, call the API then update the store so the UI stays in sync:

- **completeAction(actionId):**  
  `await actionsApi.complete(actionId);` then update local `actions` (set status to `completed`, set `completedAt`, etc.) or refetch the list.
- **dismissAction(actionId):**  
  `await actionsApi.dismiss(actionId);` then update local `actions`.
- **snoozeAction(actionId, until):**  
  `await actionsApi.snooze(actionId, until);` then update local `actions`.
- **addActionNote(actionId, note):**  
  `await actionsApi.addNote(actionId, note);` then update the action’s notes in the store or refetch.

Same idea for bulk: call `actionsApi.bulkComplete`, `bulkDismiss`, etc., then either update the store from the response or refetch the actions list.

---

## Page-by-Page Integration

### Entry Points

| Route | Purpose | Data to load |
|-------|--------|--------------|
| `/ar/dashboard/customers-hub` | Redirect | None (redirects to requests) |
| `/ar/dashboard/customers-hub/requests` | Requests center | Actions + stats + customers (for cards) |
| `/ar/dashboard/customers-hub/list` | Customers list/table/grid/map | Customers + stats + filters options |

### When to Fetch

- **On mount:** Call `fetchActions()` (and optionally `fetchActionsStats()`) on the requests page; call `fetchCustomers()` (and customer stats if needed) on the list page.
- **On filter/sort/pagination change:** Call the same fetch again with updated params (the store should already hold the new filters/pagination, so `fetchCustomers()` / `fetchActions()` can read from `get()`).
- **After mutations:** Either update the store from the API response or refetch the list so counts and lists stay correct.

---

## Requests Center Page

### File

`app/dashboard/customers-hub/requests/page.tsx` (and the component `RequestsCenterPage`).

### Current Behavior

- Uses `useUnifiedCustomersStore`: `actions`, `customers`, `completeAction`, `dismissAction`, `snoozeAction`, bulk methods, `getCustomerById`, `getCompletedActions`, `addActionNote`, `restoreAction`.
- On mount it currently fills the store with mock customers and derived actions.

### Change to API

1. **On mount:**  
   - Call `fetchActions()` (and optionally `fetchActionsStats()`).  
   - If the list endpoint returns only action IDs and names, and you need full customer for cards, either:  
     - Load customers in a separate call (e.g. by IDs from actions), or  
     - Use an endpoint that returns actions with embedded customer summary (if the backend provides it).
2. **Tabs:**  
   - Keep filtering on the client for “inbox” / “followups” / “all” / “completed” if the backend returns all pending+in_progress and completed; or ask the backend for a `tab` or `type` filter and pass it in `fetchActions({ type: [...] })`.
3. **Filters (source, priority, due date, city, etc.):**  
   - Either send them in `fetchActions(params)` and do server-side filtering, or keep loading a larger set and filter client-side. Prefer server-side for large lists.
4. **Complete / Dismiss / Snooze / Assign / Priority:**  
   - Call the corresponding store method; inside the store, call `actionsApi.*` then update `actions` (or refetch).
5. **Bulk operations:**  
   - Same: store method → `actionsApi.bulkComplete` / `bulkDismiss` / etc. → update store or refetch.

### Example: Requests Page useEffect

```typescript
// In app/dashboard/customers-hub/requests/page.tsx or inside RequestsCenterPage

useEffect(() => {
  fetchActions({ status: ['pending', 'in_progress'] });
  fetchActionsStats();
}, []);

// When user changes filters, call again with new params (e.g. from local state)
useEffect(() => {
  fetchActions({
    status: ['pending', 'in_progress'],
    type: selectedTypes.length ? selectedTypes : undefined,
    priority: selectedPriorities.length ? selectedPriorities : undefined,
    dueDate: dueDateFilter !== 'all' ? dueDateFilter : undefined,
    search: searchQuery || undefined,
    city: selectedCities.length ? selectedCities : undefined,
    state: selectedStates.length ? selectedStates : undefined,
    budgetMin: budgetMin ? Number(budgetMin) : undefined,
    budgetMax: budgetMax ? Number(budgetMax) : undefined,
    propertyType: selectedPropertyTypes.length ? selectedPropertyTypes : undefined,
  });
}, [selectedTypes, selectedPriorities, dueDateFilter, searchQuery, selectedCities, selectedStates, budgetMin, budgetMax, selectedPropertyTypes]);
```

---

## Customers List Page

### File

`components/customers-hub/page/EnhancedCustomersHubPage.tsx` and the list route (e.g. `app/dashboard/customers-hub/list/page.tsx` if it exists).

### Current Behavior

- Uses `customers`, `filters`, `setFilters`, `viewMode`, `getPendingActionsCount`, etc. from the store.
- Data is currently from mock or from whatever was loaded on the requests page.

### Change to API

1. **On mount:**  
   - Call `fetchCustomers()`.  
   - Optionally load customer stats for the dashboard cards (`statisticsApi.getCustomerStats()` or equivalent) and put them in the store.
2. **When user changes filters or sort:**  
   - Update the store (`setFilters`, `setSortBy`, `setSortOrder`, etc.) then call `fetchCustomers()` again. The store’s `fetchCustomers` already reads `filters`, `currentPage`, `pageSize`, `sortBy`, `sortOrder` from `get()`.
3. **Pagination:**  
   - When user changes page/size, update `currentPage` / `pageSize` in the store and call `fetchCustomers()`.
4. **Add/Edit customer:**  
   - After create/update API success, either push/update the customer in the store or call `fetchCustomers()` so the list and counts stay correct.

---

## Error Handling

### What You Already Have

- `lib/axiosInstance.js` response interceptor sets `error.response`, `error.serverError`, `error.clientError`, `error.networkError` so you can show a single message in the UI.

### In the Store

- In every `fetch*` and mutation, use `try/catch`.
- In `catch`, read a user-facing message and call `set({ error: message })`.
- Optionally map backend `error.response?.data?.error?.code` to Arabic messages (e.g. `VALIDATION_ERROR` → "البيانات المدخلة غير صحيحة").

Example:

```typescript
catch (err: any) {
  const apiError = err.response?.data?.error;
  const message =
    apiError?.message ||
    err.clientError?.message ||
    err.networkError?.message ||
    err.message ||
    'حدث خطأ غير متوقع';
  set({ error: message });
}
```

### In the UI

- Use `error` from the store to show a toast or an inline alert (e.g. above the table).
- Clear `error` when the user retries or when a new request starts: `set({ error: null })` at the beginning of `fetchCustomers` / `fetchActions`.

### 401 / Session Expired

- Your axios interceptor already handles 401. Ensure that on 401 the app redirects to login or refreshes the token; then the user can retry. No need to duplicate 401 handling in every store method if the interceptor handles it globally.

---

## Loading & Optimistic Updates

### Loading

- Store has `isLoading`. Set it to `true` at the start of `fetchCustomers` / `fetchActions` and to `false` in `finally`.
- In the UI, show skeletons or a spinner when `isLoading` is true (you already have loading patterns elsewhere in the app).

### Optimistic Updates (Actions)

- For “complete” / “dismiss” / “snooze”, you can:
  - **Option A:** Update the store immediately (optimistic), then call the API; on failure, revert and set `error`.
  - **Option B:** Call the API first, then update the store on success (simpler, recommended until you need snappier UX).
- For bulk operations, Option B is usually enough: call API, then refetch the list or update the list from the response.

---

## Pagination & Filters

### Customers List

- Store: `currentPage`, `pageSize`, `totalPages`, `totalCustomers`.
- Build params from store: `page: currentPage`, `limit: pageSize`, plus all filter fields from `filters` and `sortBy` / `sortOrder`.
- After `customersApi.list()`, set `pagination` into the store as in the [Store Integration](#store-integration) example.

### Requests List

- You can keep a local `page` in the requests page state and pass it to `fetchActions({ page, limit })`. If the backend supports cursor-based pagination, you can store `nextCursor` in the store or in component state and pass it in the next request.

### Filters

- Keep filter state in the store (customers) or in the Requests page (actions filters). When filters change, call `fetchCustomers()` or `fetchActions()` with the new params so the backend does the filtering.

---

## Real-time Updates (WebSocket)

If the backend exposes WebSocket events (see [CUSTOMERS_HUB_API.md](./CUSTOMERS_HUB_API.md) – Real-time Updates):

1. **Connect:** When the user is on the requests or list page, open a WebSocket connection (e.g. `wss://api.taearif.com/v1/ws?token=<JWT>`).
2. **Subscribe:** Send `subscribe` with channels like `actions`, `customers`, `stats`.
3. **On event:**  
   - `action.created` / `action.updated` → update `actions` in the store (add or replace by id) and optionally refresh stats.  
   - `customer.stage_changed` / `customer.assigned` → update the corresponding customer in the store.  
   - `stats.updated` → update whatever state you use for the stats bar.
4. **Cleanup:** On page unmount, close the WebSocket.

Implement this in a small hook (e.g. `useCustomersHubWebSocket`) that uses the store and the same JWT you use for axios. Until the backend supports it, you can skip this and rely on refetch on focus or manual refresh.

---

## File Upload

For “Upload document” (e.g. customer document), the API expects `multipart/form-data` (see [CUSTOMERS_HUB_API.md](./CUSTOMERS_HUB_API.md)).

- Use `FormData`: append `file`, `name`, `type`, `description`, `tags`.
- Send with axios:

```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('name', name);
formData.append('type', type);
if (description) formData.append('description', description);
if (tags?.length) formData.append('tags', JSON.stringify(tags));

await axiosInstance.post(`/v1/customers/${customerId}/documents`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

- On success, update the customer’s `documents` in the store or refetch the customer.

---

## Replacing Mock Data Checklist

Use this to switch from mock to API without missing a spot.

### Requests Page (`/ar/dashboard/customers-hub/requests`)

- [ ] Remove `setCustomers(mockCustomers)` and `setActions(incomingActions)` from the page’s `useEffect`.
- [ ] Add `fetchActions()` and optionally `fetchActionsStats()` on mount.
- [ ] Implement `fetchActions` in the store using `actionsApi.list()` (and map response to `actions`).
- [ ] Implement `fetchActionsStats` and store result for the stats bar.
- [ ] Wire `completeAction`, `dismissAction`, `snoozeAction` to `actionsApi.complete/dismiss/snooze` then update store.
- [ ] Wire bulk operations to `actionsApi.bulk*` then update store or refetch.
- [ ] Wire `addActionNote` to `actionsApi.addNote` and update action notes in store.
- [ ] Ensure “Quick view” customer is loaded from store (`getCustomerById`) or, if missing, from `customersApi.getById(action.customerId)`.
- [ ] If the backend returns actions with embedded customer snippet, use that for cards and avoid loading all customers separately.

### Customers List Page (`/ar/dashboard/customers-hub/list` or main hub view)

- [ ] On mount, call `fetchCustomers()` (and customer stats if needed).
- [ ] Implement `fetchCustomers` in the store using `customersApi.list()` and map response + pagination into the store.
- [ ] When filters/sort/pagination change, call `fetchCustomers()` again.
- [ ] Remove any dependency on mock data for this page.

### Shared

- [ ] Add `services/customers-hub/*` and optional `types/api.ts` as above.
- [ ] Ensure `lib/axiosInstance.js` baseURL and auth are correct for your environment.
- [ ] Add error message display (toast or inline) from store `error`.
- [ ] Add loading states from store `isLoading` where lists are rendered.
- [ ] (Optional) Add WebSocket client when backend supports it.

---

## Testing & Debugging

### API Base URL

- Development: set `NEXT_PUBLIC_Backend_URL` to your local or staging API (e.g. `http://localhost:4000/api/v1`).
- Verify in Network tab that requests go to the expected host and path.

### Auth

- Ensure the user is logged in and `useAuthStore.getState().userData?.token` is set before opening the customers-hub or requests page.
- If you get 401, check token expiry and refresh logic in your auth flow.

### Inspecting Responses

- Use the backend contract in [CUSTOMERS_HUB_API.md](./CUSTOMERS_HUB_API.md) to confirm response shape.
- In your API service, log `response.data` in development if needed (e.g. to see pagination field names: `pagination` vs `meta`).
- If the backend uses different key names (e.g. `data.items` instead of `data.customers`), map them once in the API service so the rest of the app keeps using `UnifiedCustomer[]` and `CustomerAction[]`.

### Common Issues

- **CORS:** If the API is on another origin, the backend must allow your frontend origin and credentials.
- **Duplicate slashes or wrong path:** Your axios instance may strip `/api`; ensure the final URL is exactly what the backend expects (e.g. `/v1/customers`, not `/api/v1/customers` if baseURL already ends with `/api`).
- **RTL and Arabic:** Your UI is already RTL; API request bodies can stay in English keys; use `name` (Arabic) and `nameEn` from the API for display.

---

## Quick Reference: API → Store Mapping

| Backend endpoint | Store method / state | When to call |
|------------------|---------------------|--------------|
| `GET /v1/customers` | `fetchCustomers()` → `setCustomers`, pagination | List page mount, filter/sort/page change |
| `GET /v1/customers/:id` | `getCustomerById` (from cache) or fetch and cache | Detail, quick view |
| `POST /v1/customers` | `addCustomer` then refetch or push to list | After create customer |
| `PUT /v1/customers/:id` | `updateCustomer(id, updates)` | After edit customer |
| `PATCH /v1/customers/:id/stage` | `updateCustomerStage(id, stage, notes)` | After stage change |
| `GET /v1/customers/actions` | `fetchActions()` → `setActions` | Requests page mount, filter change |
| `GET /v1/customers/actions/stats` | `fetchActionsStats()` → e.g. `setActionsStats` | Requests page mount, after mutations |
| `POST /v1/customers/actions/:id/complete` | `completeAction(id)` | Single complete |
| `POST /v1/customers/actions/:id/dismiss` | `dismissAction(id)` | Single dismiss |
| `POST /v1/customers/actions/:id/snooze` | `snoozeAction(id, until)` | Single snooze |
| `POST /v1/customers/actions/bulk/complete` | `completeMultipleActions(ids)` | Bulk complete |
| Same for bulk dismiss/snooze/assign | Corresponding store methods | Bulk toolbar |

---

**Document Version:** 1.0.0  
**Last Updated:** February 2, 2026  
**Companion:** [CUSTOMERS_HUB_API.md](./CUSTOMERS_HUB_API.md) (backend contract)
