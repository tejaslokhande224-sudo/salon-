import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Search, Filter, MoreHorizontal, Check, X, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { appointmentService } from '@/src/services/appointments';

export default function Appointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setIsLoading(true);
      const data = await appointmentService.getAppointments();
      setAppointments(data || []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'completed': return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      case 'rescheduled': return <Badge variant="outline" className="border-blue-500 text-blue-500">Rescheduled</Badge>;
      case 'no_show': return <Badge variant="outline" className="border-red-500 text-red-500">No Show</Badge>;
      default: return <Badge variant="outline" className="capitalize">{status}</Badge>;
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await appointmentService.updateAppointmentStatus(id, newStatus);
      // Optimistic update
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const filteredAppointments = appointments.filter(a => 
    a.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.services?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.customers?.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-zinc-50 flex items-center">
            Appointments <Sparkles className="w-5 h-5 ml-3 text-gold-500" />
          </h1>
          <p className="text-zinc-400 mt-1 font-light">Manage your salon bookings</p>
        </div>
        <Button variant="luxury" className="uppercase tracking-wider text-xs font-semibold">
          <CalendarIcon className="mr-2 h-4 w-4" /> New Appointment
        </Button>
      </div>

      <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
        <CardHeader className="border-b border-zinc-900 pb-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search appointments..."
                className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-gold-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 font-semibold tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Loading appointments...</td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">No appointments found.</td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-100">{appointment.customers?.name || 'Unknown'}</div>
                        <div className="text-xs text-zinc-500">{appointment.customers?.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-zinc-300">{appointment.services?.name || 'General Service'}</div>
                        <div className="text-xs text-zinc-500">{appointment.staff?.name ? `with ${appointment.staff.name}` : 'Any Staff'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-zinc-300">{appointment.booking_date}</div>
                        <div className="text-xs text-zinc-500">{appointment.booking_time}</div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(appointment.status)}</td>
                      <td className="px-6 py-4 font-medium text-gold-400">₹{appointment.services?.price || '0'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {appointment.status === 'pending' && (
                            <>
                              <Button size="icon" variant="outline" className="h-8 w-8 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/50" onClick={() => handleStatusChange(appointment.id, 'approved')} title="Approve">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="outline" className="h-8 w-8 text-rose-500 border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/50" onClick={() => handleStatusChange(appointment.id, 'cancelled')} title="Cancel">
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {appointment.status === 'approved' && (
                            <Button size="sm" variant="outline" className="h-8 text-xs border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={() => handleStatusChange(appointment.id, 'completed')}>
                              Mark Completed
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-zinc-300">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
