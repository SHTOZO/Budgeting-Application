# API Documentation

Base URL: `http://localhost:5000/api`

All authenticated endpoints require an `Authorization` header:
```
Authorization: Bearer {token}
```

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Login
**POST** `/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response: Same as register

### Get Current User
**GET** `/auth/me`

Response:
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "settings": {
      "currency": "USD",
      "theme": "light"
    }
  }
}
```

## Budget Endpoints

### Get All Budgets
**GET** `/budgets`

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "name": "Monthly Budget",
      "description": "February 2026 budget",
      "totalAmount": 5000,
      "period": "monthly",
      "startDate": "2026-02-01T00:00:00.000Z",
      "endDate": "2026-02-28T00:00:00.000Z",
      "categories": [
        {
          "categoryId": "507f1f77bcf86cd799439013",
          "allocatedAmount": 1000,
          "spent": 450
        }
      ],
      "createdAt": "2026-02-23T10:00:00.000Z",
      "updatedAt": "2026-02-23T10:00:00.000Z"
    }
  ]
}
```

### Create Budget
**POST** `/budgets`

Request body:
```json
{
  "name": "Monthly Budget",
  "description": "February 2026 budget",
  "totalAmount": 5000,
  "period": "monthly",
  "startDate": "2026-02-01",
  "endDate": "2026-02-28"
}
```

### Get Specific Budget
**GET** `/budgets/{budgetId}`

Response includes budget details and all associated expenses

### Update Budget
**PUT** `/budgets/{budgetId}`

Request body: Same as create (only provided fields are updated)

### Delete Budget
**DELETE** `/budgets/{budgetId}`

Deletes budget and all associated expenses

### Add Category to Budget
**POST** `/budgets/{budgetId}/categories`

Request body:
```json
{
  "categoryId": "507f1f77bcf86cd799439013",
  "allocatedAmount": 1000
}
```

## Category Endpoints

### Get All Categories
**GET** `/categories`

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "name": "Food",
      "color": "#ef4444",
      "icon": "🍔",
      "createdAt": "2026-02-23T10:00:00.000Z",
      "updatedAt": "2026-02-23T10:00:00.000Z"
    }
  ]
}
```

### Create Category
**POST** `/categories`

Request body:
```json
{
  "name": "Food",
  "color": "#ef4444",
  "icon": "🍔"
}
```

### Update Category
**PUT** `/categories/{categoryId}`

Request body: Only provided fields are updated

### Delete Category
**DELETE** `/categories/{categoryId}`

## Expense Endpoints

### Get Expenses
**GET** `/expenses?budgetId=xxx&categoryId=yyy`

Query parameters:
- `budgetId` (optional): Filter by budget
- `categoryId` (optional): Filter by category

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439011",
      "budgetId": "507f1f77bcf86cd799439012",
      "categoryId": "507f1f77bcf86cd799439013",
      "amount": 25.50,
      "description": "Lunch at restaurant",
      "date": "2026-02-23T12:00:00.000Z",
      "tags": ["lunch", "restaurant"],
      "createdAt": "2026-02-23T12:05:00.000Z",
      "updatedAt": "2026-02-23T12:05:00.000Z"
    }
  ]
}
```

### Create Expense
**POST** `/expenses`

Request body:
```json
{
  "budgetId": "507f1f77bcf86cd799439012",
  "categoryId": "507f1f77bcf86cd799439013",
  "amount": 25.50,
  "description": "Lunch at restaurant",
  "date": "2026-02-23",
  "tags": ["lunch", "restaurant"]
}
```

### Update Expense
**PUT** `/expenses/{expenseId}`

Request body: Only provided fields are updated

### Delete Expense
**DELETE** `/expenses/{expenseId}`

## Error Responses

### Validation Error
Status: 400
```json
{
  "success": false,
  "message": "Email already exists"
}
```

### Authentication Error
Status: 401
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### Not Found
Status: 404
```json
{
  "success": false,
  "message": "Budget not found"
}
```

### Server Error
Status: 500
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Testing with Postman

1. Open Postman
2. Create a new request
3. Register a user: **POST** `http://localhost:5000/api/auth/register`
4. Copy the token from response
5. For other requests, add header: `Authorization: Bearer {token}`

Or use the environments feature to store token as variable:
- In POST auth/login, create environment variable: `{{token}}` = `{{response.body.token}}`
- Use `{{token}}` in Authorization header for all other requests
