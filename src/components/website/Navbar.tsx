import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { settingsService } from '@/src/services/settings';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
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

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Bridal', path: '/bridal' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Offers', path: '/offers' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md supports-[backdrop-filter]:bg-black/60">
      {/* Top Bar */}
      <div className="hidden bg-zinc-900 px-4 py-2 text-xs text-zinc-400 md:block border-b border-zinc-800">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Phone className="mr-2 h-3 w-3 text-gold-500" />
              {settings?.phone || '+91 98765 43210'}
            </span>
            <span className="flex items-center">
              <MapPin className="mr-2 h-3 w-3 text-gold-500" />
              {settings?.address ? settings.address.split(',').slice(-2, -1)[0]?.trim() || settings.address.split(',')[0] : 'Kamothe'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{settings?.opening_hours?.monday || '10:00 AM - 08:00 PM'}</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={settings.salon_name} className="h-12 w-auto object-contain" referrerPolicy="no-referrer" />
          ) : (
            <span className="font-serif text-3xl font-bold tracking-tighter text-zinc-50">
              {settings?.salon_name ? settings.salon_name.split(' ')[0] : 'Glow'}<span className="text-gold-500 italic">{settings?.salon_name ? settings.salon_name.split(' ').slice(1).join(' ') : 'Up'}</span>
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-gold-400 ${
                isActive(link.path) ? 'text-gold-500' : 'text-zinc-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="luxury" asChild>
            <Link to="/book">Book Appointment</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-zinc-300 hover:text-gold-500 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4">
          <nav className="flex flex-col space-y-4">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium ${
                  isActive(link.path) ? 'text-gold-500' : 'text-zinc-300'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button variant="luxury" className="w-full" asChild>
              <Link to="/book" onClick={() => setIsOpen(false)}>Book Appointment</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
