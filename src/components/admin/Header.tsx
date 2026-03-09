import { Bell, Search, UserCircle, Sparkles } from 'lucide-react';
import { Input } from '../ui/Input';

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-6 relative z-20">
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            type="search"
            placeholder="Search appointments, customers..."
            className="pl-10 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white placeholder:text-zinc-600 h-10"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-gold-400 transition-colors">
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-gold-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></span>
          <Bell className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-3 border-l border-zinc-800 pl-4">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-zinc-100 flex items-center justify-end">
              Admin User <Sparkles className="w-3 h-3 ml-1 text-gold-500" />
            </span>
            <span className="text-xs text-gold-500/70 uppercase tracking-wider">Manager</span>
          </div>
          <div className="h-8 w-8 rounded-full border border-gold-500/30 bg-gold-500/10 flex items-center justify-center text-gold-400">
            <UserCircle className="h-6 w-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
