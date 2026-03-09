import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { supabase } from '@/src/lib/supabaseClient';
import { verifyAdminStatus } from '@/src/lib/adminAuth';

export default function AdminLayout() {
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Verify if user exists in admin_users table
        const isAdmin = await verifyAdminStatus(session.user.id);
        
        if (!isAdmin) {
          await supabase.auth.signOut();
          setSession(null);
        } else {
          setSession(session);
        }
      } else {
        setSession(null);
      }
      setLoading(false);
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const isAdmin = await verifyAdminStatus(session.user.id);
        
        if (!isAdmin) {
          await supabase.auth.signOut();
          setSession(null);
        } else {
          setSession(session);
        }
      } else {
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-black text-gold-500">Loading...</div>;
  }

  if (!session && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" replace />;
  }

  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-black font-sans text-zinc-100 selection:bg-gold-500/30 selection:text-gold-200">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/luxury-admin/1920/1080')] opacity-5 mix-blend-overlay object-cover pointer-events-none" />
        <Header />
        <main className="flex-1 overflow-y-auto p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
