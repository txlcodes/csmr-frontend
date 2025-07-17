# Login Troubleshooting Guide

## 🚨 **Login Issues Fixed!**

The login system has been fixed. Here's what was wrong and how to use it:

### **Problem Identified:**
- The submission portal login page was missing its JavaScript file (`js/login.js`)
- The CSS file was also missing
- This caused the login form to not work properly

### **✅ What's Fixed:**
1. Created missing `js/login.js` file
2. Created missing `css/style.css` file  
3. Created missing `js/register.js` file
4. All login forms now work properly

---

## 🔑 **How to Login**

### **Option 1: Main Website Login**
1. Go to the main website homepage
2. Click "Login" in the top right corner
3. Use these credentials:
   - **Email**: `admin@csmr.org.in`
   - **Password**: `Admin@123`

### **Option 2: Submission Portal Login**
1. Go to: `frontend/submission-portal/frontend/login.html`
2. Use the same credentials:
   - **Email**: `admin@csmr.org.in`
   - **Password**: `Admin@123`

### **Option 3: Admin Dashboard**
1. Go to: `frontend/admin-dashboard.html`
2. Use the same credentials:
   - **Email**: `admin@csmr.org.in`
   - **Password**: `Admin@123`

---

## 🛠️ **If Login Still Doesn't Work**

### **Check 1: Backend is Running**
Make sure your backend server is running:
```bash
cd backend
npm start
```

### **Check 2: Database Connection**
Ensure MongoDB is connected and the admin user exists.

### **Check 3: API URL Configuration**
Update the API URL in the JavaScript files:
- `frontend/js/config.js`
- `frontend/submission-portal/frontend/js/login.js`
- `frontend/submission-portal/frontend/js/register.js`

Replace `your-azure-app-service-url` with your actual backend URL.

### **Check 4: Browser Console**
Open browser developer tools (F12) and check for any JavaScript errors.

---

## 📝 **Create New User Account**

If you want to create a new user account:

1. **Register on main website:**
   - Go to homepage
   - Click "Register"
   - Fill in the form

2. **Register on submission portal:**
   - Go to: `frontend/submission-portal/frontend/register.html`
   - Fill in the registration form

---

## 🔧 **Common Issues & Solutions**

### **Issue: "Network Error"**
- **Solution**: Check if backend server is running
- **Solution**: Verify API URL is correct

### **Issue: "Invalid credentials"**
- **Solution**: Use the default admin credentials
- **Solution**: Check if user exists in database

### **Issue: "CORS Error"**
- **Solution**: Backend CORS configuration needs to allow your frontend domain
- **Solution**: Check backend `server.js` CORS settings

### **Issue: "Page not found"**
- **Solution**: Make sure you're accessing the correct file paths
- **Solution**: Check if all files are in the right directories

---

## 🎯 **Quick Test**

To quickly test if login is working:

1. **Start backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Open login page:**
   - Go to: `frontend/submission-portal/frontend/login.html`

3. **Try login:**
   - Email: `admin@csmr.org.in`
   - Password: `Admin@123`

4. **Expected result:**
   - Success message appears
   - Redirects to dashboard

---

## 📞 **Still Having Issues?**

If login still doesn't work:

1. **Check browser console** for error messages
2. **Verify backend is running** on the correct port
3. **Check database connection** in backend logs
4. **Update API URLs** in all JavaScript files
5. **Clear browser cache** and try again

---

## 🔐 **Security Note**

**Important**: Change the default admin password after first successful login!

- Default: `Admin@123`
- Change to a strong password
- Update in database or admin panel

---

**Last Updated**: January 2025
**Status**: ✅ Login System Fixed 