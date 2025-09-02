# 🚀 Turborepo + Supabase + Tailwind Starter  

This project is a **monorepo setup with Turborepo**, built with:  
- **Supabase** for authentication and database  
- **React + TypeScript** for frontend  
- **TailwindCSS** for styling  

I intentionally focused on **core functionality first** (auth, routing, state management, basic dashboard) given limited time and a busy schedule. With more time, I would improve structure, code quality, and developer experience.  

---

## 📦 Setup & Installation  

### 1. Clone the repo  
```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Install dependencies  
At the root of the turborepo:  
```bash
pnpm install
```
*(You can also use `npm` or `yarn`, but `pnpm` is recommended for monorepos.)*  

### 3. Environment variables  
Create a `.env.local` file inside your frontend app (e.g., `apps/web/`):  
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run the development server  
```bash
cd apps/web
pnpm dev
```

Your app should now be running at [http://localhost:3000](http://localhost:3000).  

---

## 🏗 Why Turborepo?  
I chose **Turborepo** because I had very limited time and needed:  
- **Faster installs** and shared cache for builds/tests  
- **Separation of concerns** (frontend, shared config, future backend)  
- **Scalability** if I decide to expand later  

This gave me speed while keeping the project organized.  

---

## ⚡ Notes & Trade-offs  
Due to time constraints and a busy schedule, I prioritized features over polish.  

Things I would improve with more time:  
1. **Code modularity & cleanup** – break down large components into smaller, reusable ones.  
2. **Better error handling** – currently some errors are only logged, I’d add proper UI feedback.  
3. **Type safety improvements** – tighten TypeScript types for Supabase queries and context state.  
4. **Testing** – add unit and integration tests for auth flows, dashboard, and API interactions.  
