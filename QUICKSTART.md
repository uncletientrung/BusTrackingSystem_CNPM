# Quick Start Guide - Bus Tracking System with XAMPP

This is a quick start guide to get the Bus Tracking System running with XAMPP in 5 minutes.

## Step 1: Install XAMPP (2 minutes)

1. Download XAMPP from: https://www.apachefriends.org/
2. Install and start XAMPP Control Panel
3. Start **Apache** and **MySQL** services

## Step 2: Setup Database (1 minute)

1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "Import" tab
3. Choose the file: `backend-example/schema.sql`
4. Click "Go" to import

✅ This creates the database and test users:
- Admin: `admin@bustrack.com` / `password123`
- Driver: `driver@bustrack.com` / `password123`
- Parent: `parent@bustrack.com` / `password123`

## Step 3: Setup Backend (30 seconds)

Copy the `backend-example` folder to XAMPP's htdocs:

**Windows:**
```
Copy entire folder: backend-example
To: C:\xampp\htdocs\bus-tracking-api\
```

**Mac/Linux:**
```bash
sudo cp -r backend-example /Applications/XAMPP/htdocs/bus-tracking-api/
```

## Step 4: Setup Frontend (1 minute)

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` if your XAMPP uses a different port (default is 80).

## Step 5: Run the Application (30 seconds)

```bash
cd frontend
npm run dev
```

Open browser: http://localhost:5173

## Test the Connection

1. Go to login page
2. Use: `admin@bustrack.com` / `password123`
3. If login works, XAMPP connection is successful! 🎉

## Troubleshooting

### Can't connect to backend?
- Check XAMPP Control Panel - Apache should be green/running
- Check MySQL is running in XAMPP
- Verify backend folder is at: `C:\xampp\htdocs\bus-tracking-api\`

### Port 80 already in use?
1. In XAMPP Control Panel, click Config → Service and Port Settings
2. Change Apache port to 8080
3. Update `frontend/.env`: `VITE_API_BASE_URL=http://localhost:8080`
4. Update `frontend/vite.config.js` proxy target: `http://localhost:8080`

### CORS errors?
- Make sure you're accessing frontend via `http://localhost:5173`
- Check browser console for specific error messages

## Next Steps

- Read [XAMPP_SETUP.md](XAMPP_SETUP.md) for detailed configuration
- Read [backend-example/README.md](backend-example/README.md) for API documentation
- Start developing your features!

## Project URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost/bus-tracking-api/api/
- **phpMyAdmin**: http://localhost/phpmyadmin
- **XAMPP Dashboard**: http://localhost/dashboard

---

Need more help? Check the full documentation in [XAMPP_SETUP.md](XAMPP_SETUP.md)
