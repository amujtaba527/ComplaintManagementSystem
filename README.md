# 🛠️ **Complaint Management System**  

A **web-based complaint management system** built with **Next.js** and **PostgreSQL**. This system allows employees to submit complaints, and admins to manage and resolve them efficiently.  

---

## 📌 **Features**
### 🔹 **User Roles & Authentication**
- ✅ **JWT-based authentication** using **NextAuth.js**
- ✅ Role-based access (**Admin & Employee**)  
- ✅ **Admins** can register new users  
- ✅ **Employees** can submit complaints  

### 🔹 **Complaint Management**
- 📝 Employees can submit complaints with details:
  - **Building, Floor, Area, Complaint Type, Details**
- 📊 Admins can:
  - **Update complaint status** (*In-Progress → Resolved*)
  - **Assign completion date**
  - **Manage users, areas, complaint types**
  - **Generate PDF reports**

### 🔹 **Admin Panel**
- 🛠️ `/admin` route for complaint & user management  
- 📈 Dashboard with **analytics & filters**  

### 🔹 **Tech Stack**
- 🚀 **Frontend:** Next.js, React, Tailwind CSS  
- 🗄️ **Backend:** Next.js API Routes, PostgreSQL  
- 🔑 **Auth:** NextAuth.js (JWT-based)  

---

## 📂 **Project Structure**
```
/src
 ├── app
 │   ├── api
 │   │   ├── users/[id]/route.ts     # Delete user API
 │   │   ├── complaints/route.ts     # CRUD for complaints
 │   │   ├── areas/route.ts          # Manage areas
 │   │   ├── auth/route.ts           # Authentication
 │   ├── admin/page.tsx              # Admin Dashboard
 │   ├── complaints/page.tsx         # Complaint Form
 │   ├── login/page.tsx              # Login Page
 ├── components
 |   ├── AdminComplaintTable.tsx
 │   ├── ComplaintForm.tsx
 |   ├── ComplaintTable.tsx
 │   ├── ManageUsers.tsx
 │   ├── ManageAreas.tsx
 ├── middleware.ts                   # Role-based access control
```

---

## ⚙️ **Setup & Installation**
### 📌 **1️⃣ Clone the Repository**
```bash
git clone https://github.com/amujtaba527/ComplaintManagementSystem.git
cd ComplaintManagementSystem
```

### 📌 **2️⃣ Install Dependencies**
```bash
npm install
```

### 📌 **3️⃣ Set Up Environment Variables**
Create a `.env.local` file and add:
```env
DATABASE_URL=postgres://your_postgres_user:your_password@localhost:5432/your_database
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

### 📌 **4️⃣ Run Migrations (If Using Prisma)**
```bash
npx prisma migrate dev --name init
```

### 📌 **5️⃣ Start the Development Server**
```bash
npm run dev
```
🚀 App will be live at **`http://localhost:3000`**  

### 📌 **6️⃣ Default Login Credentials**
```
Email: admin@example.com
Password: admin123
```

---

## 🛠️ **API Endpoints**
| Method | Endpoint                 | Description              | Access |
|--------|--------------------------|--------------------------|--------|
| **POST** | `/api/auth/login`       | Login user               | Public |
| **GET**  | `/api/auth/session`     | Get current session      | Authenticated |
| **POST** | `/api/complaints`       | Submit a new complaint   | Employee |
| **GET**  | `/api/complaints`       | View all complaints      | Admin |
| **DELETE** | `/api/users/[id]`     | Delete a user            | Admin |
| **GET**  | `/api/users`            | View all users           | Admin |

---

## 🎯 **To-Do / Future Enhancements**
- ✅ Add **real-time updates** using WebSockets  
- ✅ Improve **UI/UX** with better dashboards  
- ✅ Implement **email notifications** for status updates  

---

## 👨‍💻 **Contributors**
- 🚀 **Syed Ahmad Mujtaba** – [GitHub](https://github.com/amujtaba527)  

---
🚀 **Happy Coding!** 🎯