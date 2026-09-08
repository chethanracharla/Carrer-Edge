# Career-Edge

## 📌 Project Overview

Career-Edge is a web-based placement management platform designed to simplify and manage the campus placement process.

The system provides separate modules for Students, Companies, and Admin. It helps students find suitable job opportunities, apply for jobs, and track their applications. Companies can manage job openings and applicants, while the Admin manages the overall placement activities.

The main goal of Career-Edge is to make the placement process more organized, efficient, and easy to manage.

---

## 🎯 Objectives

- Automate the campus placement process.
- Provide students with a platform to view and apply for job opportunities.
- Allow students to track their job applications.
- Allow companies to manage job openings and applicants.
- Allow administrators to manage students, companies, jobs, and applications.
- Reduce manual work involved in placement management.
- Maintain placement-related information in a centralized database.

---

## 👥 User Modules

Career-Edge consists of three main modules:

### 1. Student Module

Students can:

- Register an account.
- Login to the system.
- View their dashboard.
- View available job opportunities.
- Check job eligibility.
- Apply for jobs.
- View their applications.
- Check application status.
- View and update their profile.
- Logout securely.

### 2. Company Module

Companies can:

- Register and login.
- Create job opportunities.
- Manage job details.
- View student applications.
- Manage applicants.
- Update application status.

### 3. Admin Module

Admin can:

- Manage students.
- Manage companies.
- Manage job opportunities.
- Manage student applications.
- Monitor the overall placement process.

---

## 🏗️ System Architecture

                    Users
                      |
        +-------------+-------------+
        |             |             |
     Student       Company        Admin
        |             |             |
        +-------------+-------------+
                      |
                      ↓
              Node.js + Express.js
                      |
                      ↓
                 MySQL Database

---

## 🛠️ Technologies Used

### Frontend

- HTML
- CSS
- Bootstrap
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MySQL

---

## 🔄 Application Flow

Student Registration
        ↓
Student Login
        ↓
Student Dashboard
        ↓
View Available Jobs
        ↓
Check Eligibility
        ↓
Apply for Job
        ↓
Application Stored in Database
        ↓
Company/Admin Manages Application
        ↓
Application Status Updated
        ↓
Student Views Updated Status

---

## 👨‍💻 Student Module

The Student Module is one of the main modules of Career-Edge.

### Student Registration

Students provide their personal and academic information during registration.

### Student Login

Students log in using their registered credentials. After successful authentication, a session is created and the student is redirected to the dashboard.

### Student Dashboard

The dashboard provides access to:

- Available Jobs
- Applications
- Profile
- Other Student Features

### View Jobs

Students can view available job opportunities retrieved from the MySQL database.

### Apply for Job

Students can apply for eligible job opportunities.

The system checks whether the student has already applied for the selected job before creating a new application.

### My Applications

Students can view jobs they have applied for and check their application status.

Example statuses:

- Pending
- Selected
- Rejected

### Profile Management

Students can view and update their profile information.

### Logout

When the student logs out, the session is destroyed and the student is redirected to the login page.

---

## 🔐 Session Management

Career-Edge uses sessions to maintain the student's login state.

```javascript
req.session.studentId = result[0].id;
