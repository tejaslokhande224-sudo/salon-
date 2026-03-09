import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Scissors,
  Tag,
  Image as ImageIcon,
  Users,
  UserCircle,
  Star,
  Settings,
  LogOut,
  Sparkles,
  MonitorPlay
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { name: 'Services', path: '/admin/services', icon: Scissors },
    { name: 'Offers', path: '/admin/offers', icon: Tag },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Hero Slider', path: '/admin/hero-slider', icon: MonitorPlay },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Staff', path: '/admin/staff', icon: UserCircle },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="flex w-64 flex-col border-r border-zinc-900 bg-zinc-950 relative z-20">
      <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent pointer-events-none" />
      
      <div className="flex h-16 items-center px-6 border-b border-zinc-900 relative z-10">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold-500" />
          <span className="text-xl font-serif font-medium tracking-wide text-zinc-100 uppercase">
            GLOW <span className="text-gradient-gold italic">UP</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto relative z-10">
        <div className="mb-4 px-3 text-xs font-semibold tracking-widest text-zinc-500 uppercase">
          Management
        </div>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                active
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 border border-transparent'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-300 ${
                  active ? 'text-gold-500' : 'text-zinc-500 group-hover:text-gold-400'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-900 p-4 relative z-10">
        <Link
          to="/admin/login"
          className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-zinc-500 group-hover:text-red-400" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
