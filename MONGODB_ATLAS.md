# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Sign Up**
3. Fill out the form:
   - Email
   - Password
   - First & Last Name
4. Accept terms and click **Create your Atlas account**

## Step 2: Create a Cluster

1. After signing in, you'll see the **Create a Deployment** screen
2. Choose **FREE** tier (M0)
3. Select your preferred region (closest to you)
4. Click **Create Deployment**
5. Wait for cluster to be created (5-10 minutes)

## Step 3: Create a Database User

1. Go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Enter username: `budgetapp` (or your choice)
5. Generate password (copy it somewhere safe)
6. Click **Add User**

## Step 4: Add IP Access

1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
4. Click **Confirm**

## Step 5: Get Connection String

1. Go to **Databases** (left sidebar)
2. Click **Connect** on your cluster
3. Click **Drivers**
4. Choose **Node.js** version 4.1 or later
5. Copy the connection string
6. It looks like: `mongodb+srv://budgetapp:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

## Step 6: Update Your .env File

1. Open `server/.env`
2. Replace `MONGODB_URI` with your connection string
3. Replace `<password>` with your actual password from Step 3

Example:
```
MONGODB_URI=mongodb+srv://budgetapp:MySecurePassword123@cluster0.abc123.mongodb.net/budget-app?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
PORT=5000
```

**Important:** 
- Add the database name to the end: `/budget-app`
- Replace `<password>` with your actual password
- Don't share your connection string!

## Step 7: Verify Connection

1. From project root, start the server:
```bash
cd server
npm start
```

2. You should see:
```
MongoDB connected successfully
Server running on port 5000
```

## Troubleshooting

### "MongoNetworkError"
- Check IP is whitelisted in Network Access
- Verify password is correct
- Make sure MongoDB Atlas cluster is running

### "Authentication failed"
- Verify username and password in connection string
- Check if special characters are URL-encoded
- Try copying connection string again

### "Cannot connect to MongoDB"
- Ensure internet connection
- Check if cluster is still running in Atlas dashboard
- Restart the server

## Tips

- **Free Tier Limits:** M0 clusters have 512MB storage
- **Daily Backups:** Atlas automatically backs up your data
- **Monitoring:** Check cluster metrics in Atlas dashboard
- **Scaling:** Upgrade to paid tier if you need more storage later

## Production Best Practices

- ✅ Use strong passwords (20+ characters)
- ✅ Create separate database users for each environment
- ✅ Use IP whitelisting instead of "Allow from Anywhere" in production
- ✅ Enable MFA on your Atlas account
- ✅ Never commit .env file to git
