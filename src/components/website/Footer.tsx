import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { settingsService } from '@/src/services/settings';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
    loadSettings();
  }, []);

  return (
    <footer className="bg-black text-zinc-300 border-t border-zinc-900 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[200px] bg-gold-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="block">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={settings.salon_name} className="h-16 w-auto object-contain" referrerPolicy="no-referrer" />
              ) : (
                <h3 className="font-serif text-3xl font-bold tracking-tighter text-white">
                  {settings?.salon_name ? settings.salon_name.split(' ')[0] : 'Glow'}<span className="text-gold-500 italic">{settings?.salon_name ? settings.salon_name.split(' ').slice(1).join(' ') : 'Up'}</span>
                </h3>
              )}
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your Beauty Journey Starts Here. Premium salon services in the heart of {settings?.address ? settings.address.split(',').slice(-2, -1)[0]?.trim() || settings.address.split(',')[0] : 'Kamothe'}.
            </p>
            <div className="flex space-x-4">
              <a href={settings?.social_links?.instagram || '#'} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-gold-500/50 hover:text-gold-400 transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={settings?.social_links?.facebook || '#'} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-gold-500/50 hover:text-gold-400 transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 font-serif text-xl font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-zinc-400 hover:text-gold-400 transition-colors flex items-center"><span className="w-2 h-px bg-gold-500/50 mr-2"></span>About Us</Link></li>
              <li><Link to="/services" className="text-zinc-400 hover:text-gold-400 transition-colors flex items-center"><span className="w-2 h-px bg-gold-500/50 mr-2"></span>Our Services</Link></li>
              <li><Link to="/bridal" className="text-zinc-400 hover:text-gold-400 transition-colors flex items-center"><span className="w-2 h-px bg-gold-500/50 mr-2"></span>Bridal Packages</Link></li>
              <li><Link to="/gallery" className="text-zinc-400 hover:text-gold-400 transition-colors flex items-center"><span className="w-2 h-px bg-gold-500/50 mr-2"></span>Gallery</Link></li>
              <li><Link to="/offers" className="text-zinc-400 hover:text-gold-400 transition-colors flex items-center"><span className="w-2 h-px bg-gold-500/50 mr-2"></span>Special Offers</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 font-serif text-xl font-semibold text-white">Contact Us</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 shrink-0 text-gold-500" />
                <span className="leading-relaxed">{settings?.address || '123 Beauty Lane, Thane West'}</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-5 w-5 shrink-0 text-gold-500" />
                <span>{settings?.phone || '+91 98765 43210'}</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 shrink-0 text-gold-500" />
                <span>{settings?.email || 'hello@glowup.com'}</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="mb-6 font-serif text-xl font-semibold text-white">Opening Hours</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex justify-between border-b border-zinc-800/50 pb-3">
                <span>Mon - Fri</span>
                <span className="text-zinc-300">{settings?.opening_hours?.monday || '10:00 AM - 08:00 PM'}</span>
              </li>
              <li className="flex justify-between border-b border-zinc-800/50 pb-3">
                <span>Saturday</span>
                <span className="text-zinc-300">{settings?.opening_hours?.saturday || '09:00 AM - 09:00 PM'}</span>
              </li>
              <li className="flex justify-between border-b border-zinc-800/50 pb-3">
                <span>Sunday</span>
                <span className="text-zinc-300">{settings?.opening_hours?.sunday || '09:00 AM - 09:00 PM'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-zinc-900 pt-8 text-center text-xs text-zinc-600">
          <p>&copy; {new Date().getFullYear()} {settings?.salon_name || 'Glow Up'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
