# Budgeting App - Setup Guide

## Prerequisites Installation

### 1. Install Node.js

Visit [nodejs.org](https://nodejs.org) and download the **LTS (Long Term Support)** version.

- Download the Windows installer
- Run the installer and follow the prompts
- Accept all default options
- This will install both Node.js and npm

Verify installation:
```bash
node --version
npm --version
```

### 2. Set Up MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended)
**Free tier with 512MB storage - No installation needed!**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a free M0 cluster
4. Create database user and get connection string
5. See [MONGODB_ATLAS.md](MONGODB_ATLAS.md) for detailed steps

#### Option B: Local MongoDB (Requires Download)
- Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- Choose Windows MSI
- Run installer with default settings
- MongoDB will start automatically as a Windows service
- Use connection string: `mongodb://localhost:27017/budget-app`

## Project Setup

### 1. Navigate to Project
```bash
cd "c:\Users\osama\Documents\Budget"
```

### 2. Install Dependencies

**Install root dependencies:**
```bash
npm install
```

**Install server dependencies:**
```bash
cd server
npm install
cd ..
```

**Install client dependencies:**
```bash
cd client
npm install
cd ..
```

### 3. Configure Environment Variables

**Server configuration:**
```bash
cd server
copy .env.example .env
```

Edit `server/.env`:

**If using MongoDB Atlas (recommended):**
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/budget-app?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

**If using Local MongoDB:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/budget-app
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

💡 See [MONGODB_ATLAS.md](MONGODB_ATLAS.md) for step-by-step MongoDB Atlas setup

**Client configuration:**
```bash
cd ..\client
copy .env.example .env
# Verify REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode (Recommended)

From the project root, run both server and client together:
```bash
npm run dev
```

This will:
- Start the Express server on `http://localhost:5000`
- Start the React dev server on `http://localhost:3000`
- Both run concurrently

### Alternative: Run Separately

**Terminal 1 - Start Server:**
```bash
npm run server
```

**Terminal 2 - Start Client:**
```bash
npm run client
```

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, change `server/server.js`:
```javascript
const PORT = process.env.PORT || 5001; // Change to 5001
```

### MongoDB Connection Issues
- Check MongoDB is running (Windows Services → MongoDB Server)
- Verify connection string in `.env`
- Try: `mongodb://localhost:27017/budget-app`

### Node Modules Issues
```bash
# Clear installation
rm -r node_modules package-lock.json
npm install
```

## First Use

1. Open `http://localhost:3000` in your browser
2. Click "Register" to create an account
3. After login:
   - Click "+ Add Category" to create expense categories
   - Click "+ Create Budget" to start a new budget
   - Add budget categories with allocated amounts
   - Log expenses as you make purchases
   - Monitor spending against limits

## API Testing

Test API endpoints using Postman or cURL:

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Copy the token from response and use for other requests:
```bash
curl -X GET http://localhost:5000/api/budgets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Next Steps

- Customize styling in React components
- Add charts/visualizations
- Set up recurring expenses
- Add email notifications
- Deploy to production (Heroku, Vercel, etc.)

## Support

For issues:
1. Check console errors (F12 in browser)
2. Check terminal output
3. Verify all prerequisites are installed
4. Ensure MongoDB is running
5. Clear browser cache and try again
