# Map View — Backend Requirements

This document describes the **exact backend changes** required so the demo map view on `/ar/dashboard/properties` works with real API data (without relying on frontend demo fallback).

---

## 1. Frontend Context

- **Page**: `/ar/dashboard/properties` (and `/ar/dashboard/properties/incomplete` for drafts).
- **View**: User can switch to **Map** view (icon in the header). The map shows only properties that have **valid coordinates**.
- **API used**: Same as list/grid:
  - **List**: `GET /properties?page=1` (and filters as query params).
  - **Drafts**: `GET /properties/drafts?page=1`.

The frontend does **not** call a separate “map” endpoint. It uses the same properties list and filters on the client for items that have `latitude` and `longitude`.

---

## 2. Required Response Shape for Map to Work

Each property in the API response **must** expose coordinates in one of these ways (or both for compatibility):

### Option A — Top-level (recommended)

```json
{
  "id": 123,
  "title": "شقة فاخرة",
  "price": 850000,
  "latitude": 24.7136,
  "longitude": 46.6753,
  "featured_image": "...",
  "bedrooms": 3,
  "bathrooms": 2,
  "address": "حي الملقا، الرياض",
  ...
}
```

### Option B — Nested under `location`

```json
{
  "id": 123,
  "title": "شقة فاخرة",
  "price": 850000,
  "location": {
    "latitude": 24.7136,
    "longitude": 46.6753,
    "address": "حي الملقا، الرياض"
  },
  ...
}
```

### Option C — Both (best compatibility)

Return **both** top-level `latitude`/`longitude` **and** `location.latitude`/`location.longitude` so the map works regardless of how the frontend reads the object.

**Important:** The frontend map logic only looks for:

- `property.latitude` and `property.longitude`
- `property.location.latitude` and `property.location.longitude`

It does **not** use `lat`/`lng`. If your backend currently returns `lat`/`lng`, you must either:

- Change the API to return `latitude`/`longitude` (preferred), or  
- Add a thin normalization layer that maps `lat` → `latitude` and `lng` → `longitude` in the response.

---

## 3. Exact Field Rules

| Field | Type | Required for map | Notes |
|-------|------|-------------------|--------|
| `latitude` | **number** | Yes (or inside `location`) | Decimal degrees, e.g. `24.7136`. Not string. |
| `longitude` | **number** | Yes (or inside `location`) | Decimal degrees, e.g. `46.6753`. Not string. |
| `location.latitude` | **number** | Yes (if no top-level) | Same as above. |
| `location.longitude` | **number** | Yes (if no top-level) | Same as above. |
| `location.address` | string | No | Shown in card/popup. |

Properties **without** valid numeric `latitude` and `longitude` are **excluded** from the map (they still appear in grid/list). The frontend checks:

- Value exists and is not `null`/`undefined`
- `!isNaN(lat)` and `!isNaN(lng)`

So ensure coordinates are **numbers** in JSON, not strings (e.g. `"24.7136"` should be `24.7136`).

---

## 4. Backend Edits Checklist

### 4.1 Properties list endpoint

**Endpoint:** `GET /properties` (and any variant used by the dashboard list, e.g. with pagination or filters).

**Change:** For each property in the response, include coordinates in the payload.

- If coordinates are stored in a **properties** table:
  - Add or expose columns: `latitude`, `longitude` (or ensure they are selected and serialized in the JSON).
- If coordinates are stored in a **related** table (e.g. “location” or “address”):
  - Join that table and map its fields into each property object as:
    - `latitude`, `longitude`, and/or  
    - `location: { latitude, longitude, address }`

**Example (conceptual) — Laravel/PHP:**

```php
// In Property resource or controller, when building list response:
'latitude'  => $property->latitude ?? $property->location?->latitude,
'longitude' => $property->longitude ?? $property->location?->longitude,
'location'  => [
    'latitude'  => $property->latitude ?? $property->location?->latitude,
    'longitude' => $property->longitude ?? $property->location?->longitude,
    'address'   => $property->address ?? $property->location?->address,
],
```

Adjust to your actual column/relation names.

### 4.2 Drafts endpoint

**Endpoint:** `GET /properties/drafts` (or equivalent).

**Change:** Same as above. Each draft property in the response must include `latitude` and `longitude` (and/or `location.latitude`, `location.longitude`) if it has coordinates, so they can appear on the map when the user switches to Map view.

### 4.3 Database / storage

- Ensure every property (or its related location record) **can** store:
  - `latitude` (decimal)
  - `longitude` (decimal)
- Use nullable columns if not all properties have a pin.
- Optionally add validation: latitude in `[-90, 90]`, longitude in `[-180, 180]`.

### 4.4 Optional: Normalize `lat`/`lng` to `latitude`/`longitude`

If the backend currently returns only `lat`/`lng` (e.g. from a map provider):

- Either in the API response builder or in a single transformer, add:
  - `latitude` = `lat` (or `location.lat`)
  - `longitude` = `lng` (or `location.lng`)
- Then the frontend map will work without any frontend change.

---

## 5. Summary: Minimal Backend Change

1. **List endpoints** (`GET /properties`, `GET /properties/drafts`) must return, for each property:
   - **Numbers** `latitude` and `longitude`, **and/or**
   - `location` object with **numbers** `latitude` and `longitude`.
2. **Do not** rely on `lat`/`lng` only — the frontend does not use them for the map.
3. **DB**: Store and expose latitude/longitude (nullable if needed).

After these edits, the existing map view on `/ar/dashboard/properties` will show all properties that have valid coordinates, without needing the frontend demo fallback for real data.

---

## 6. Quick Reference — Property object for map

Minimum shape the frontend map uses (other fields can be present):

```json
{
  "id": 123,
  "title": "عنوان الوحدة",
  "price": 850000,
  "address": "العنوان للنص",
  "latitude": 24.7136,
  "longitude": 46.6753,
  "featured_image": "https://...",
  "bedrooms": 3,
  "bathrooms": 2,
  "transaction_type": "sale",
  "status": 1
}
```

Or with nested location:

```json
{
  "id": 123,
  "title": "عنوان الوحدة",
  "price": 850000,
  "address": "العنوان للنص",
  "location": {
    "latitude": 24.7136,
    "longitude": 46.6753,
    "address": "حي الملقا، الرياض"
  },
  "featured_image": "https://...",
  "bedrooms": 3,
  "bathrooms": 2,
  "transaction_type": "sale",
  "status": 1
}
```

---

**Related frontend docs:** `MAP_VIEW_QUICK_START.md`, `MAP_VIEW_IMPLEMENTATION.md`
