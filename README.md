# Budgeting Web App

A simple full-stack budgeting application built with React, Express, and MongoDB.

## Features

- **User Authentication**: Register and login with JWT
- **Budget Management**: Create budgets with categories and spending limits
- **Expense Tracking**: Add, edit, and delete expenses
- **Real-time Tracking**: Monitor spending against budget limits
- **Category Management**: Create custom expense categories

## Tech Stack

- **Frontend**: React, React Router, Context API, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB Atlas (Cloud) or Local MongoDB

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root package.json with concurrently
└── README.md
```

## Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas URI)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd Budget
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Setup Server**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT_SECRET
   ```

4. **Setup Client**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Edit .env with your API URL (e.g., http://localhost:5000)
   ```

## Running the Application

### Development Mode (Both client and server)
```bash
npm run dev
```

This will:
- Start the Express server on `http://localhost:5000`
- Start the React dev server on `http://localhost:3000`

### Running Separately

**Server only:**
```bash
npm run server
```

**Client only:**
```bash
npm run client
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login

### Budgets
- `GET /api/budgets` - List all budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets/:id` - Get specific budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Expenses
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/:id` - Get specific expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Usage

1. **Register**: Create a new account on the login page
2. **Create Budget**: Add a new budget with a total amount and period
3. **Add Categories**: Set up expense categories with allocated amounts
4. **Track Expenses**: Log expenses and view your spending against limits

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/budget-app?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

**MongoDB Atlas Setup:** See [MONGODB_ATLAS.md](MONGODB_ATLAS.md) for detailed instructions

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Future Enhancements

- Charts and reports
- Budget notifications/alerts
- Import/export functionality
- Recurring expenses
- Mobile app
- Cloud storage integration

## License

MIT
