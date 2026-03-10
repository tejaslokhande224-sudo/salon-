import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Users, Calendar, DollarSign, TrendingUp, Clock, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { appointmentService } from '@/src/services/appointments';
import { enquiryService } from '@/src/services/enquiries';
import { serviceService } from '@/src/services/services';

export default function Dashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    newEnquiries: 0,
    activeServices: 0,
    totalRevenue: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        const results = await Promise.allSettled([
          appointmentService.getDashboardStats(),
          enquiryService.getEnquiryCount(),
          serviceService.getActiveServices(),
          appointmentService.getAppointments(),
          appointmentService.getTotalRevenue()
        ]);

        if (!isMounted) return;

        const [appStatsRes, enquiriesCountRes, servicesRes, appointmentsRes, revenueRes] = results;

        const appStats = appStatsRes.status === 'fulfilled' ? appStatsRes.value : null;
        if (appStatsRes.status === 'rejected') console.error('Failed to load appStats:', appStatsRes.reason);

        const enquiriesCount = enquiriesCountRes.status === 'fulfilled' ? enquiriesCountRes.value : 0;
        if (enquiriesCountRes.status === 'rejected') console.error('Failed to load enquiriesCount:', enquiriesCountRes.reason);

        const services = servicesRes.status === 'fulfilled' ? servicesRes.value : [];
        if (servicesRes.status === 'rejected') console.error('Failed to load services:', servicesRes.reason);

        const appointments = appointmentsRes.status === 'fulfilled' ? appointmentsRes.value : [];
        if (appointmentsRes.status === 'rejected') console.error('Failed to load appointments:', appointmentsRes.reason);

        const revenue = revenueRes.status === 'fulfilled' ? revenueRes.value : 0;
        if (revenueRes.status === 'rejected') console.error('Failed to load revenue:', revenueRes.reason);

        setStats({
          todayAppointments: appStats?.today || 0,
          pendingAppointments: appStats?.pending || 0,
          completedAppointments: appStats?.completed || 0,
          newEnquiries: enquiriesCount || 0,
          activeServices: (services || []).length,
          totalRevenue: revenue || 0
        });

        setRecentAppointments((appointments || []).slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadDashboardData();
    return () => { isMounted = false; };
  }, []);

  const revenueData = [
    { name: 'Mon', total: 12000 },
    { name: 'Tue', total: 15000 },
    { name: 'Wed', total: 18000 },
    { name: 'Thu', total: 22000 },
    { name: 'Fri', total: 28000 },
    { name: 'Sat', total: 45000 },
    { name: 'Sun', total: 50000 },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-zinc-400">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-zinc-50 flex items-center">
            Dashboard <Sparkles className="w-5 h-5 ml-3 text-gold-500" />
          </h1>
          <p className="text-zinc-400 mt-1 font-light">Overview of your salon's performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs tracking-widest uppercase font-semibold text-zinc-500">Last updated: Just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md hover:border-gold-500/30 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs tracking-widest uppercase font-semibold text-zinc-400">Total Revenue</CardTitle>
              <div className="h-8 w-8 rounded-full bg-gold-500/10 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-gold-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-medium text-zinc-50">₹{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-emerald-400 flex items-center mt-2 font-medium">
                <TrendingUp className="mr-1 h-3 w-3" /> +20.1% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md hover:border-gold-500/30 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs tracking-widest uppercase font-semibold text-zinc-400">Appointments Today</CardTitle>
              <div className="h-8 w-8 rounded-full bg-gold-500/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-gold-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-medium text-zinc-50">{stats.todayAppointments}</div>
              <p className="text-xs text-amber-400 mt-2 font-medium">
                {stats.pendingAppointments} pending approval
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md hover:border-gold-500/30 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs tracking-widest uppercase font-semibold text-zinc-400">New Enquiries</CardTitle>
              <div className="h-8 w-8 rounded-full bg-gold-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-gold-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-medium text-zinc-50">{stats.newEnquiries}</div>
              <p className="text-xs text-rose-400 mt-2 font-medium">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md hover:border-gold-500/30 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs tracking-widest uppercase font-semibold text-zinc-400">Active Services</CardTitle>
              <div className="h-8 w-8 rounded-full bg-gold-500/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-gold-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-serif font-medium text-zinc-50">{stats.activeServices}</div>
              <p className="text-xs text-zinc-500 mt-2 font-medium">
                Across all categories
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Chart */}
        <motion.div className="col-span-1 lg:col-span-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md h-full">
            <CardHeader className="border-b border-zinc-900 pb-4">
              <CardTitle className="text-lg font-serif font-medium text-zinc-100">Weekly Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip 
                      cursor={{fill: '#18181b'}} 
                      contentStyle={{backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5'}} 
                      itemStyle={{color: '#eab308'}}
                    />
                    <Bar dataKey="total" fill="#eab308" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Appointments */}
        <motion.div className="col-span-1 lg:col-span-3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
          <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md h-full">
            <CardHeader className="border-b border-zinc-900 pb-4">
              <CardTitle className="text-lg font-serif font-medium text-zinc-100">Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {recentAppointments.length === 0 ? (
                  <p className="text-zinc-500 text-sm">No recent appointments.</p>
                ) : (
                  recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between group">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-gold-500 font-serif font-medium group-hover:border-gold-500/50 transition-colors">
                          {appointment.customers?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-100">{appointment.customers?.name || 'Unknown'}</p>
                          <p className="text-xs text-zinc-500">{appointment.services?.name || 'General Service'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-zinc-300">{appointment.booking_time}</p>
                        <p className="text-xs text-zinc-600">{appointment.booking_date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
