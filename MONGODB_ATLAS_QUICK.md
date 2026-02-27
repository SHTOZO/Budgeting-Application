# MongoDB Atlas - Quick Setup (5 Minutes)

## 🚀 Get Started Now

### 1. Create Atlas Account
```
Visit: https://www.mongodb.com/cloud/atlas
Sign Up → Confirm Email → Login
```

### 2. Create Free Cluster
```
Click: Create a Deployment
Choose: FREE (M0)
Select: Your Region (e.g., us-east-1)
Click: Create Deployment
⏳ Wait 5-10 minutes
```

### 3. Create Database User
```
Left Menu → Database Access
Click: + Add New Database User
Username: budgetapp
Password: Generate (copy it!)
Click: Add User
```

### 4. Allow Network Access
```
Left Menu → Network Access
Click: + Add IP Address
Click: Allow Access from Anywhere
Confirm: ✅
```

### 5. Get Connection String
```
Click: Databases
Click: Connect (on your cluster)
Click: Drivers
Choose: Node.js
Copy: mongodb+srv://budgetapp:<password>@cluster0.xxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Update .env
```bash
cd server
# Open .env in notepad or editor
```

Replace:
```
MONGODB_URI=mongodb+srv://budgetapp:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/budget-app?retryWrites=true&w=majority
```

**Important:**
- Add `/budget-app` at end (database name)
- Replace `YOUR_PASSWORD_HERE` with the password from step 3
- Replace `cluster0.xxxxx` with your cluster info

### 7. Start Your App!
```bash
npm run dev
# Open http://localhost:3000
```

## ✅ Verify It Works

You should see in terminal:
```
✅ MongoDB connected successfully
✅ Server running on port 5000
```

If you see errors, check:
- [ ] Connection string has correct password
- [ ] Connection string has `/budget-app` at end
- [ ] IP Whitelist allows your connection
- [ ] Cluster is running (green status in Atlas)

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| "Authentication failed" | Check password in connection string |
| "Cannot connect" | Whitelist your IP in Network Access |
| "Connection refused" | Verify cluster is running |
| "MongoNetworkError" | Wait for cluster to fully deploy |

## 📊 MongoDB Atlas Dashboard

Once connected, you can:
- View data in **Collections** view
- Monitor performance in **Performance** tab
- Check backups in **Backups** tab
- Scale up when needed (paid plans available)

## 💡 Tips

- **Free tier limit:** 512MB storage (plenty for development)
- **Backups:** Automatic daily backups included
- **Upgrade later:** Easy upgrade to paid plans
- **Multiple clusters:** Create separate ones for dev/test/production

---

**Need help?** See [MONGODB_ATLAS.md](MONGODB_ATLAS.md) for detailed instructions
