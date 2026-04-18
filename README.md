# Elogixa_web

![Node.js](https://img.shields.io/badge/-Node.js-blue?logo=nodejs&logoColor=white)

## 📝 Description

Elogixa_web is a sophisticated web application platform built on Node.js, designed to offer a seamless and high-performance digital experience. By focusing on scalability and speed, Elogixa_web provides a modern interface for managing complex web-based operations, ensuring robust connectivity and efficient data handling for users who require a reliable and responsive environment.

## ✨ Features

- 🕸️ Web


## 🛠️ Tech Stack

- ⬢ MERN Stack


## 📦 Key Dependencies

```
concurrently: ^8.2.2
```

## Run Commands

- `npm run dev`: starts the backend and the single React frontend together
- `npm run server`: starts the backend only
- `npm run client`: starts the React frontend only


## 📁 Project Structure

```
.
├── client
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── public
│   │   ├── Data_centers.webp
│   │   └── vite.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── pages
│   │       ├── AdminDashboard.jsx
│   │       ├── Home.jsx
│   │       ├── JobBoard.jsx
│   │       ├── Login.jsx
│   │       └── Services.jsx
│   ├── vercel.json
│   └── vite.config.js
├── package.json
└── server
    ├── config
    │   ├── cloudinaryConfig.js
    │   └── multer.js
    ├── controllers
    │   ├── applicationController.js
    │   ├── authController.js
    │   ├── contactController.js
    │   └── jobController.js
    ├── middleware
    │   └── authMiddleware.js
    ├── models
    │   ├── Application.js
    │   ├── Contact.js
    │   ├── Job.js
    │   └── User.js
    ├── package.json
    ├── routes
    │   ├── applications.js
    │   ├── auth.js
    │   ├── contact.js
    │   └── jobs.js
    ├── server.js
    ├── services
    │   └── emailService.js
    └── vercel.json
```

## Local Setup

1. Install Node.js 20.19+ and MongoDB locally.
2. From the repo root, run `npm run install-all`.
3. Copy `server/.env.example` to `server/.env` and fill in the values you have.
4. Optional: copy `client/.env.example` to `client/.env`.
5. Start everything with `npm run dev`.

## Local Notes

- The backend defaults to `mongodb://127.0.0.1:27017/elogixa` if `MONGODB_URI` is not set.
- Resume uploads now work locally even without Cloudinary. Files are saved under `server/uploads/resumes`.
- ATS scoring is optional locally. If `GEMINI_API_KEY` is missing, applications still submit without ATS scoring.
- Status emails require valid SMTP credentials. Gmail should use an App Password.
- The chatbot was intentionally left unchanged.


## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/Dhanush18100/Elogixa_web.git`
3. **Create** a new branch: `git checkout -b feature/your-feature`
4. **Commit** your changes: `git commit -am 'Add some feature'`
5. **Push** to your branch: `git push origin feature/your-feature`
6. **Open** a pull request

Please ensure your code follows the project's style guidelines and includes tests where applicable.

---
