# 🚀 Marketing CRM

## 📌 Overview

This is a full-stack Marketing CRM application to manage campaigns, contacts, and track email engagement like opens and clicks.

---

## 🛠️ Tech Stack

- Frontend: React (Vite), Tailwind CSS  
- Backend: Node.js, Express.js 
- Database: MongoDB  
- Authentication: JWT  
- Email Service: Resend  
- Deployment: Render (Backend), Vercel (Frontend)

---

## 🚀 Features Implemented

### Authentication
- User Register & Login using JWT

### Campaign Management
- Create campaign
- Send campaign to contacts
- Basic campaign tracking

### Contact Management
- Add contacts
- Store name, email, phone
- Status (active)

### Email Sending
- Emails sent using Resend API
- HTML email support

### Tracking
- Email open tracking
- Link click tracking
- Stored in database

---

## 📂 Project Structure

```
MARKETING-CRM/
├── backend/
├── frontend/
├── Database_diagram/
├── postman_Testing/
```

---

## ⚙️ Setup Instructions

### Backend

```
cd backend
npm install
npm start
```

Create `.env` file:

```
PORT=10000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
RESEND_API_KEY=your_key
BASE_URL=http://localhost:3000
```

---

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment

### Backend  
https://marketing-crm-backend.onrender.com/api/

### Frontend  
https://web-marketing-crm.vercel.app/

---

## 🧪 API Testing

Postman collection available in:

```
/postman_Testing
```

---

## 🗄️ Database

ER Diagram available in:

```
/Database_diagram
```

Collections used:
- Users  
- Campaigns  
- Contacts  
- Trackings  

---

## ⚠️ Notes

- Emails may go to spam due to unverified domain (testing environment)  
- Email service uses Resend instead of SMTP (Render limitation)

---

## 👤 Author

**Mahalakshmi Gopinath**

📧 Email: mahagmaha05@gmail.com  
🔗 LinkedIn: linkedin.com/in/mahagopi19 
