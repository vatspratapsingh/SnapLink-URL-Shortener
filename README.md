# 🔗 SnapLink - Smart URL Shortener

SnapLink is a lightweight and fast URL shortener built using **C++** for the backend and **Next.js** for the frontend. It offers a sleek, responsive UI with animated transitions and clipboard copy functionality. Designed for performance and simplicity, SnapLink allows users to shorten long URLs and access them via unique short codes.

---

## 🚀 Features

- 🔒 Unique short URL generation
- 🔁 Instant redirection based on short ID
- 📋 One-click copy-to-clipboard
- 🌑 Clean and modern dark-mode UI
- ⚡ Built for speed and simplicity

---

## 🧰 Tech Stack

- **Backend**: C++ (custom-built HTTP server)
- **Frontend**: Next.js 15 (App Router)
- **Styling**: Inline CSS + Tailwind (optional)
- **Extras**: Framer Motion for animations

---

## 📂 Project Structure

```
url-shortener/
├── backend/           # C++ backend server and DB logic
│   └── server         # Binary built from main.cpp
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js          # Main URL shortener page
│   │   │   └── s/[id]/page.tsx  # Redirection handler
│   │   └── styles/ (optional)
│   └── public/
└── db.txt             # URL mappings stored here
```

---

## 🛠️ Running the Project

1. **Start Backend**  
   Open terminal in `backend/` and compile your C++ server, then run:
   ```bash
   ./server
   ```

2. **Start Frontend**  
   In `frontend/`, run:
   ```bash
   npm install
   npm run dev
   ```

3. **Visit App**  
   Navigate to: [http://localhost:3000](http://localhost:3000)

---

## 📌 Author

Made by [Vats Pratap Singh](https://www.linkedin.com/in/vats-pratap-singh/)  

