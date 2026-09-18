# Deployment Guide

## Frontend (Vercel)
1. Push this repository to GitHub.
2. Go to Vercel and import the repository.
3. Set the Root Directory to rontend.
4. The Framework Preset will auto-detect Vite.
5. Add the Environment Variables from .env.example (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL).
6. Click Deploy. The included ercel.json ensures client-side routing works correctly.

## Backend (Render)
1. Go to Render.com and connect your GitHub repository.
2. Render can automatically detect the ender.yaml file in this repository.
3. Simply create a new "Blueprint Instance" and select this repository.
4. Render will prompt you for the Environment Variables (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY).
5. Alternatively, create a "Web Service" manually:
   - **Root Directory:** ackend
   - **Build Command:** 
pm install
   - **Start Command:** 
ode index.js
   - Add environment variables manually.

## Database (Supabase)
Ensure your Supabase project is active and the schemas have been pushed using supabase db push.
