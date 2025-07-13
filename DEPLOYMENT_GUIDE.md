# Prok Professional Networking - Deployment Guide

## 🚀 Deployment Status: READY

### ✅ Current Setup
- **Backend**: Running on http://localhost:8000
- **Frontend**: Running on http://localhost:5175/
- **Database**: Configured for both local MySQL and Render PostgreSQL
- **CORS**: Updated to support multiple frontend URLs
- **Environment Variables**: Generated and ready

---

## 📋 Deployment Steps

### 1. Backend Deployment (Render Web Service)

#### Create PostgreSQL Database on Render:
1. Go to [Render.com](https://render.com) → "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `prok-database`
   - **Database**: `prok_db`
   - **User**: `prok_user`
   - **Region**: Choose closest to you
3. Click "Create Database"
4. **Copy the DATABASE_URL** from the database dashboard

#### Deploy Backend Service:
1. Go to Render.com → "New +" → "Web Service"
2. Connect your GitHub repository
3. Choose branch: `main` (or your deployment branch)
4. Configure the service:

**Basic Settings:**
- **Name**: `prok-backend`
- **Root Directory**: `app/backend`
- **Runtime**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn main:app`

**Environment Variables:**
```
FLASK_ENV=production
PYTHON_VERSION=3.10.12
DATABASE_URL=<copy from your PostgreSQL service>
SECRET_KEY=4812afc52a8fb4268c335a018054b2536ef8753c1fed93d7c73f64bb15c41ceb
JWT_SECRET_KEY=e5547f7dcbbe1e318c002457451bc932b53c66940833c42075fccef9391cc63f
```

5. Click "Create Web Service"

---

### 2. Frontend Deployment (Render Static Site)

#### Deploy Frontend Service:
1. Go to Render.com → "New +" → "Static Site"
2. Connect your GitHub repository
3. Choose branch: `main` (or your deployment branch)
4. Configure the service:

**Basic Settings:**
- **Name**: `prok-frontend`
- **Root Directory**: `app/frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

**Environment Variables:**
```
VITE_API_URL=https://your-backend-url.onrender.com
```
*(Replace with your actual backend Render URL)*

5. Click "Create Static Site"

---

## 🧪 Testing Your Deployment

### 1. Test Backend:
- Visit: `https://your-backend-url.onrender.com/api/test`
- Expected: JSON response with success message

### 2. Test Frontend:
- Visit your frontend Render URL
- Try signing up/logging in
- Test creating posts and other features

---

## 🔧 Common Issues & Solutions

### 1. CORS Errors
**Error**: `Access to fetch at '...' has been blocked by CORS policy`
**Solution**: ✅ Already fixed - CORS configured to include all frontend URLs

### 2. Database Connection Errors
**Error**: `Can't connect to local server through socket`
**Solution**: ✅ Use Render PostgreSQL instead of local MySQL

### 3. Missing Database Tables
**Error**: `relation "users" does not exist`
**Solution**: ✅ `db.create_all()` is called on app startup

### 4. API URL Issues
**Error**: `Failed to load resource: net::ERR_CONNECTION_REFUSED`
**Solution**: ✅ Frontend uses environment variables for API URLs

---

## 📁 Files Created/Updated for Deployment

### Backend Files:
- ✅ `main.py` - Entry point for gunicorn
- ✅ `requirements.txt` - Includes gunicorn and psycopg2-binary
- ✅ `Procfile` - Specifies how to run the app
- ✅ `runtime.txt` - Specifies Python 3.12.0
- ✅ `app.py` - Updated with test endpoint and CORS config
- ✅ `config.py` - Updated for DATABASE_URL support

### Frontend Files:
- ✅ `.env` - Local development environment
- ✅ `.env.local` - Local production environment
- ✅ All API files updated to use environment variables

---

## 🔑 Generated Security Keys

**SECRET_KEY**: `4812afc52a8fb4268c335a018054b2536ef8753c1fed93d7c73f64bb15c41ceb`
**JWT_SECRET_KEY**: `e5547f7dcbbe1e318c002457451bc932b53c66940833c42075fccef9391cc63f`

---

## 🎯 Next Steps

1. **Deploy Backend**: Follow the backend deployment steps above
2. **Deploy Frontend**: Follow the frontend deployment steps above
3. **Test Everything**: Use the testing guide above
4. **Monitor**: Check Render logs for any issues

---

## 📞 Support

If you encounter any issues:
1. Check Render deployment logs
2. Verify environment variables are set correctly
3. Test the `/api/test` endpoint
4. Check browser console for frontend errors

**Your application is ready for deployment! 🚀** 