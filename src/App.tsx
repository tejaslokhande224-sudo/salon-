import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { verifyAdminStatus } from './lib/adminAuth';
import WebsiteLayout from './components/website/Layout';
import AdminLayout from './components/admin/Layout';

// Website Pages
import Home from './pages/website/Home';
import About from './pages/website/About';
import Services from './pages/website/Services';
import Bridal from './pages/website/Bridal';
import Gallery from './pages/website/Gallery';
import Offers from './pages/website/Offers';
import Reviews from './pages/website/Reviews';
import Contact from './pages/website/Contact';
import Book from './pages/website/Book';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Appointments from './pages/admin/Appointments';
import Enquiries from './pages/admin/Enquiries';
import AdminServices from './pages/admin/Services';
import AdminOffers from './pages/admin/Offers';
import AdminGallery from './pages/admin/Gallery';
import Customers from './pages/admin/Customers';
import Staff from './pages/admin/Staff';
import AdminReviews from './pages/admin/Reviews';
import Settings from './pages/admin/Settings';
import HeroSlider from './pages/admin/HeroSlider';
import AdminAbout from './pages/admin/About';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const isAdmin = await verifyAdminStatus(session.user.id);
        if (!isAdmin) {
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

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-gold-500">Loading...</div>;
  if (!session) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<WebsiteLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="bridal" element={<Bridal />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="offers" element={<Offers />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="contact" element={<Contact />} />
          <Route path="book" element={<Book />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="customers" element={<Customers />} />
          <Route path="staff" element={<Staff />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="settings" element={<Settings />} />
          <Route path="hero-slider" element={<HeroSlider />} />
        </Route>
      </Routes>
    </Router>
  );
}
