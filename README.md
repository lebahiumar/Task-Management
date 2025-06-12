# 🚀 TaskFlow

A modern, personal task management app built with React, Supabase, and Tailwind CSS. Easily manage your tasks, import/export them as JSON, and stay productive! ✨

---

## 📦 Features

- 📝 **Personal Task Management**: Create, edit, and track your tasks with ease.
- 📤 **Export Tasks**: Download all your tasks as a JSON file.
- 📥 **Import Tasks**: Upload a JSON file to import tasks.
- 🎨 **Beautiful UI**: Clean, modern interface with Tailwind CSS.
- 🔒 **Authentication**: Secure login/signup with Supabase Auth.
- ☁️ **Cloud Storage**: Tasks are stored securely in Supabase.
- 📅 **Calendar View**: Visualize your tasks by due date.
- ⚙️ **Settings**: Customize your experience.

---

## 🛠️ Getting Started

### 1. Clone the Repository
```sh
# Using git
 git clone https://github.com/your-username/taskflow.git
 cd taskflow
```

### 2. Install Dependencies
```sh
npm install
# or
yarn install
```

### 3. Set Up Supabase
- Go to [Supabase](https://supabase.com/) and create a new project.
- Create a `tasks` table using the SQL in `supabase.txt`.
- Enable Row Level Security (RLS) as shown in the SQL file.
- Get your Supabase URL and Anon Key from your project settings.
- Goto src>lib>supabaseClient.ts file and paste your
  
  SUPABASE_URL=your-supabase-url
  SUPABASE_ANON_KEY=your-anon-key
  

### 4. Run the App
```sh
npm run dev
# or
yarn dev
```
Visit [http://localhost:5173](http://localhost:5173) to view the app.

---

## 📂 Project Structure

```
public/           # Static files (favicon, icon, etc.)
src/
  components/     # Reusable UI components
  hooks/          # Custom React hooks
  lib/            # Supabase client and utilities
  pages/          # App pages (Tasks, Dashboard, Auth, etc.)
  App.tsx         # Main app component
  main.tsx        # Entry point
index.html        # HTML template
supabase.txt      # SQL for Supabase setup
```

---

## 🧑‍💻 Usage

- **Add Task**: Click "New Task" and fill in the details.
- **Edit/Delete Task**: Use the options on each task card.
- **Import Tasks**: Click "Import Tasks" and select a JSON file.
- **Export Tasks**: Click "Export Tasks" to download your tasks.

---

## 🛡️ Security
- All data is user-specific and protected by Supabase RLS.
- Only you can access your tasks.

---

## 🖼️ Customization
- Change the favicon by replacing `public/icon.png`.
- Update theme colors in `tailwind.config.ts`.

---

## 🙏 Credits
- Built by M-Umar
- Powered by [Supabase](https://supabase.com/) & [React](https://react.dev/)
- UI with [Tailwind CSS](https://tailwindcss.com/)

---

## 📃 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 💡 Tips
- For best results, use the latest version of Chrome or Firefox.
- You can deploy this app to Vercel, Netlify, or any static hosting provider.

---

## 🌟 Star this repo if you like it!

---

Enjoy using **TaskFlow**! 🎉
