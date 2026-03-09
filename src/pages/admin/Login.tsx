import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { Lock, Sparkles } from 'lucide-react';
import { supabase } from '@/src/lib/supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin');
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/luxury-salon/1920/1080')] opacity-10 mix-blend-overlay object-cover" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <Card className="w-full max-w-md bg-zinc-950/80 border-zinc-800 backdrop-blur-md shadow-2xl relative z-10">
        <CardHeader className="space-y-1 text-center border-b border-zinc-900 pb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-500 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
            <Lock className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-serif font-medium tracking-tight text-zinc-50 flex items-center justify-center">
            Admin <span className="text-gradient-gold italic ml-2">Login</span>
          </CardTitle>
          <CardDescription className="text-zinc-400 font-light">Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase" htmlFor="email">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="admin@glowup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase" htmlFor="password">Password</label>
                <a href="#" className="text-xs text-gold-500 hover:text-gold-400 transition-colors">Forgot password?</a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50"
              />
            </div>
            <Button type="submit" variant="luxury" className="w-full h-12 uppercase tracking-widest text-xs font-bold" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
