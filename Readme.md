Log File Intelligence System

A MERN Stack application that allows users to upload server log files and automatically analyze them to detect errors, patterns, and useful insights.

The system provides role-based access with an Admin panel for managing users and monitoring uploaded files.

Objective

The goal of this project is to build a Log File Intelligence System that processes server log files and extracts meaningful information such as error types, frequencies, and time patterns.

The platform enables:

Secure file uploads

Automatic log analysis

Error pattern detection

Administrative monitoring of system activity

The project is built using the MERN Stack: MongoDB, Express.js, React.js, and Node.js. 

Log File Intelligence System

System Overview

The application supports two types of users:

1. Admin

Manages users

Approves registrations

Monitors uploaded log files

Views error summaries

2. Regular User

Uploads server log files

Views analysis reports

Tracks upload history

Users must first register and get admin approval before accessing the log upload functionality. 

Log File Intelligence System

User Flow (Regular User)
Authentication

Users can:

Sign Up

Sign In

After signup:

The account status is set to Pending Approval

The user must wait until the Admin approves the account

Once approved, the user can access the system features. 

Log File Intelligence System

Log File Upload

After approval, users can:

Upload .txt server log files

Files are stored securely

The system processes the file and performs automated analysis

Log Analysis Features

After uploading a log file, the system extracts the following insights:

1. Top 5 Error Types

Identifies the most common error messages present in the log file.

2. Error Frequency

Counts how many times each error occurs.

3. Most Frequent Time Range

Detects the time periods where errors occur most often.

4. Export Report

Users can export a summarized analysis report for further review. 

Log File Intelligence System

Upload History

Users can view previously uploaded log files with the following information:

File Name

Upload Date

Processing Status

Summary of detected errors

Detailed analysis report

This helps users track historical uploads and monitor recurring issues. 

Log File Intelligence System

Admin Panel

The Admin dashboard provides system management tools.

User Management

Admins can:

View all registered users

Approve new users

Mark users as inactive

Delete users

File Monitoring

Admins can monitor all uploaded files across the system and view:

User who uploaded the file

File name

Upload timestamp

Error summary

Types of errors detected

This helps administrators identify system-wide issues and usage patterns. 

Log File Intelligence System

Tech Stack
Frontend

React.js

Axios

React Router

CSS

Backend

Node.js

Express.js

JWT Authentication

REST API Architecture

Database

MongoDB

Mongoose

Backend Features

RESTful API structure

JWT-based authentication

Role-based access control (Admin/User)

Modular architecture

Secure file upload handling

Error logging and validation

Frontend Features

Clean and responsive UI

Separate dashboards for Admin and User

File upload interface

Upload progress indicators

Analysis results visualization

Error handling and loading states

Project Structure
Log-File-Intelligence-System
│
├── client
|   ├── src
|   │   ├── components
|   │   ├── pages
|   │   ├── context
|   │   └── api
|   └── package.json
│
├── backend
|   ├── src
|   │   ├── controllers
|   │   ├── services
|   │   ├── config
|   │   ├── models
|   │   ├── routes
|   │   |── middleware   
|   │   └── utils
|   ├── seed
|   |    ├── seedAdmin.js   
|   ├── uploads
|   ├── server.js
|   ├── .env
|   └── package.json
|
└── README.md
Installation & Setup
1. Clone the Repository
git clone https://github.com/pritha-techformation/Log-File-Intelligence-System.git
2. Move to backend directory
cd backend
3. Install Backend Dependencies
npm install
4. Move to client directory in a new terminal
cd client
5. Install Frontend Dependencies
npm install
6. Configure Environment Variables

Create a .env file inside the server folder.

Sample:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d

7. Enter Admin details to the database
cd backend
node seedAdmin.js 
8. Run Backend
nodemon server.js
9. Run Frontend
cd client
npm run dev

visit http://localhost:5173/login
to login either via admin or user role.



