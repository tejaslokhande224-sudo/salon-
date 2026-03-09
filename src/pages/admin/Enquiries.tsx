import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Select } from '@/src/components/ui/Select';
import { Search, Filter, MessageSquare, Check, X, PhoneCall, Sparkles, Calendar, Clock, User } from 'lucide-react';
import { enquiryService } from '@/src/services/enquiries';
import { serviceService } from '@/src/services/services';
import { staffService } from '@/src/services/staff';
import { customerService } from '@/src/services/customers';
import { appointmentService } from '@/src/services/appointments';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/Dialog';

export default function Enquiries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [convertData, setConvertData] = useState({
    service_id: '',
    staff_id: '',
    booking_date: '',
    booking_time: '',
    notes: ''
  });

  useEffect(() => {
    loadEnquiries();
    loadData();
  }, []);

  async function loadData() {
    try {
      const [srvs, stf] = await Promise.all([
        serviceService.getActiveServices(),
        staffService.getActiveStaff()
      ]);
      setServices(srvs || []);
      setStaff(stf || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  async function loadEnquiries() {
    try {
      setIsLoading(true);
      const data = await enquiryService.getEnquiries();
      setEnquiries(data || []);
    } catch (error) {
      console.error('Failed to load enquiries:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge variant="destructive">New</Badge>;
      case 'contacted': return <Badge variant="warning">Contacted</Badge>;
      case 'converted': return <Badge variant="success">Converted</Badge>;
      case 'closed': return <Badge variant="secondary">Closed</Badge>;
      default: return <Badge variant="outline" className="capitalize">{status}</Badge>;
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await enquiryService.updateEnquiryStatus(id, newStatus);
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleOpenConvertModal = (enquiry: any) => {
    setSelectedEnquiry(enquiry);
    setConvertData({
      service_id: '',
      staff_id: '',
      booking_date: new Date().toISOString().split('T')[0],
      booking_time: '10:00',
      notes: enquiry.message || ''
    });
    setIsConvertModalOpen(true);
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    try {
      setIsSaving(true);
      
      // 1. Create or get customer
      let customer = await customerService.getCustomerByPhone(selectedEnquiry.phone);
      if (!customer) {
        customer = await customerService.createCustomer({
          name: selectedEnquiry.name,
          phone: selectedEnquiry.phone,
          email: selectedEnquiry.email,
          gender: 'other' // Default
        });
      }

      // 2. Create appointment
      await appointmentService.createAppointment({
        customer_id: customer.id,
        service_id: convertData.service_id,
        staff_id: convertData.staff_id || null,
        booking_date: convertData.booking_date,
        booking_time: convertData.booking_time,
        notes: convertData.notes,
        status: 'pending'
      });

      // 3. Update enquiry status
      await enquiryService.updateEnquiryStatus(selectedEnquiry.id, 'converted');
      
      await loadEnquiries();
      setIsConvertModalOpen(false);
      alert('Enquiry successfully converted to appointment!');
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Failed to convert enquiry.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredEnquiries = enquiries.filter(e => 
    e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.service_interest?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-zinc-50 flex items-center">
            Enquiries <Sparkles className="w-5 h-5 ml-3 text-gold-500" />
          </h1>
          <p className="text-zinc-400 mt-1 font-light">Manage customer inquiries and leads</p>
        </div>
      </div>

      <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
        <CardHeader className="border-b border-zinc-900 pb-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search enquiries..."
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
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Interest</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Loading enquiries...</td>
                  </tr>
                ) : filteredEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">No enquiries found.</td>
                  </tr>
                ) : (
                  filteredEnquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-100">{enquiry.name}</div>
                        <div className="text-xs text-zinc-500">{enquiry.phone}</div>
                        <div className="text-xs text-zinc-500">{enquiry.email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-300">{enquiry.service_interest}</td>
                      <td className="px-6 py-4 max-w-xs truncate text-zinc-400" title={enquiry.message}>{enquiry.message}</td>
                      <td className="px-6 py-4 text-zinc-300">{new Date(enquiry.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{getStatusBadge(enquiry.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {enquiry.status === 'new' && (
                            <Button size="icon" variant="outline" className="h-8 w-8 text-amber-500 border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/50" onClick={() => handleStatusChange(enquiry.id, 'contacted')} title="Mark Contacted">
                              <PhoneCall className="h-4 w-4" />
                            </Button>
                          )}
                          {enquiry.status !== 'converted' && enquiry.status !== 'closed' && (
                            <>
                              <Button size="icon" variant="outline" className="h-8 w-8 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/50" onClick={() => handleOpenConvertModal(enquiry)} title="Convert to Appointment">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="outline" className="h-8 w-8 text-zinc-500 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-300" onClick={() => handleStatusChange(enquiry.id, 'closed')} title="Close">
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-zinc-300" title="View Details">
                            <MessageSquare className="h-4 w-4" />
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

      {/* Convert to Appointment Modal */}
      <Dialog open={isConvertModalOpen} onOpenChange={setIsConvertModalOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-zinc-50">Convert to <span className="text-gradient-gold italic">Appointment</span></DialogTitle>
          </DialogHeader>
          <form onSubmit={handleConvert} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Service</label>
                <Select
                  required
                  value={convertData.service_id}
                  onChange={(e) => setConvertData({ ...convertData, service_id: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100"
                >
                  <option value="">Select Service</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Stylist</label>
                <Select
                  value={convertData.staff_id}
                  onChange={(e) => setConvertData({ ...convertData, staff_id: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100"
                >
                  <option value="">Any Stylist</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Date</label>
                <Input
                  required
                  type="date"
                  value={convertData.booking_date}
                  onChange={(e) => setConvertData({ ...convertData, booking_date: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Time</label>
                <Select
                  required
                  value={convertData.booking_time}
                  onChange={(e) => setConvertData({ ...convertData, booking_time: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100"
                >
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                  <option value="19:00">07:00 PM</option>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Notes</label>
              <Input
                value={convertData.notes}
                onChange={(e) => setConvertData({ ...convertData, notes: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-zinc-100"
                placeholder="Additional notes..."
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsConvertModalOpen(false)} className="text-zinc-400 hover:text-white">
                Cancel
              </Button>
              <Button type="submit" variant="luxury" disabled={isSaving}>
                {isSaving ? 'Converting...' : 'Create Appointment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
