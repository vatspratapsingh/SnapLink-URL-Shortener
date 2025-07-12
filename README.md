# 🔗 URL Shortener

A simple full-stack URL shortening application built with:

- ⚙️ **C++** backend server using `httplib.h` and `nlohmann/json.hpp`
- 🌐 **Next.js** frontend with Tailwind CSS
- 📦 JSON-based flat file database

---

## ✨ Features

- Shorten long URLs into compact ones like:  
  `http://localhost:3000/s/abc123`
- Auto-redirect to the original URL when visiting the short link
- Duplicate URL detection — avoids creating multiple entries
- Frontend + backend run together with a single command

---

## 🗂️ Project Structure

```
url-shortener/
├── backend/          # C++ server code
│   ├── main.cpp
│   └── db.txt        # Flat file database
├── frontend/         # Next.js frontend
│   ├── app/
│   │   ├── page.tsx              # Main UI
│   │   └── s/[id]/page.tsx       # Redirect logic
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository (or set up manually)
```bash
cd ~/Documents
mkdir url-shortener
```

### 2. 🖥️ Backend Setup

Install headers (if not already):
```bash
cd url-shortener/backend
curl -O https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h
curl -O https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp
```

Compile backend:
```bash
g++ -std=c++17 main.cpp -o server
```

### 3. 🌐 Frontend Setup

```bash
cd ../frontend
npm install
```

To allow backend+frontend together, install concurrently:
```bash
npm install concurrently
```

---

## ▶️ Run the Full App

From the `frontend/` folder:

```bash
npm run dev
```

This will:
- Start backend C++ server on port `18080`
- Start frontend at `http://localhost:3000`

---

## 🧪 Test

1. Open browser → `http://localhost:3000`
2. Paste a long URL and click **Shorten**
3. Click the generated short link
4. It redirects to original URL!

---

## 🛠 Future Improvements

- Persistent database (SQLite or MongoDB)
- Authenticated users & history
- Analytics dashboard
- Custom short IDs

---

## 📄 License

MIT — free to use & modify.