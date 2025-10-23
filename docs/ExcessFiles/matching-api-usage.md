# Matching API Usage Guide

## API Endpoint
```
GET /v1/matching/customers
```

## Response Structure
```json
{
    "success": true,
    "data": [
        {
            "customer_name": null,
            "phone": "966544411548",
            "number_of_requests": 1,
            "number_of_matching_properties": 1
        }
    ]
}
```

## Store Usage

### 1. Import the Store
```javascript
import useStore from "@/context/Store";

const {
  matchingPage: {
    customers,
    loading,
    customerStats,
    error,
  },
  fetchCustomers,
  fetchCustomerStats,
} = useStore();
```

### 2. Fetch Data
```javascript
useEffect(() => {
  const loadData = async () => {
    try {
      await fetchCustomers();
      await fetchCustomerStats();
    } catch (error) {
      console.error("Error loading matching data:", error);
    }
  };

  loadData();
}, []);
```

### 3. Customer Data Structure
Each customer object contains:
- `id`: Customer ID
- `name`: Customer name (from `customer_name`)
- `phone`: Phone number
- `totalPurchases`: Number of requests (from `number_of_requests`)
- `matchingProperties`: Number of matching properties (from `number_of_matching_properties`)
- `rating`: Customer rating (default: 4.5)
- `status`: Customer status (default: "active")
- `assignedAgent`: Assigned agent information

### 4. Statistics Available
- `totalCustomers`: Total number of customers
- `totalRequests`: Total number of requests
- `totalMatchingProperties`: Total matching properties
- `averageMatchingProperties`: Average matching properties per customer
- `activeCustomers`: Number of active customers
- `inactiveCustomers`: Number of inactive customers

### 5. CRUD Operations
```javascript
// Create customer
await createCustomer(customerData);

// Update customer
await updateCustomer(customerId, customerData);

// Delete customer
await deleteCustomer(customerId);
```

### 6. Filtering and Search
```javascript
// Set search term
setSearchTerm("أحمد");

// Set status filter
setStatusFilter("active");

// Set priority filter
setPriorityFilter("high");
```

## Example Component
See `components/matching/matching-customers-example.tsx` for a complete example of how to use the matching API data in a React component.
