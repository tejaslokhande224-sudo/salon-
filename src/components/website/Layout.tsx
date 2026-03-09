import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Phone, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { settingsService } from '@/src/services/settings';

export default function Layout() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Failed to load settings in layout:', error);
      }
    }
    loadSettings();
  }, []);

  return (
    <div className="flex min-h-screen flex-col font-sans bg-black text-zinc-100">
      <Navbar />
      <main className="flex-1 relative">
        <Outlet />
      </main>
      <Footer />

      {/* Sticky Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4">
        {settings?.phone && (
          <a
            href={`tel:${settings.phone}`}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold text-black shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]"
            aria-label="Call Us"
          >
            <Phone className="h-6 w-6" />
          </a>
        )}
        {settings?.social_links?.whatsapp && (
          <a
            href={settings.social_links.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
            aria-label="WhatsApp Us"
          >
            <MessageCircle className="h-6 w-6" />
          </a>
        )}
      </div>
    </div>
  );
}
