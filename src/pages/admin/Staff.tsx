import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Search, Plus, Edit, Trash2, Clock, Phone, Mail, Sparkles, X } from 'lucide-react';
import { staffService } from '@/src/services/staff';

export default function Staff() {
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    speciality: '',
    phone: '',
    email: '',
    photo_url: '',
    shift_start: '10:00',
    shift_end: '20:00',
    is_active: true
  });

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    try {
      setIsLoading(true);
      const data = await staffService.getStaff();
      setStaffList(data || []);
    } catch (error) {
      console.error('Failed to load staff:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenModal = (staff: any = null) => {
    if (staff) {
      setCurrentStaff(staff);
      setFormData({
        name: staff.name,
        speciality: staff.speciality || '',
        phone: staff.phone || '',
        email: staff.email || '',
        photo_url: staff.photo_url || '',
        shift_start: staff.shift_start || '10:00',
        shift_end: staff.shift_end || '20:00',
        is_active: staff.is_active
      });
    } else {
      setCurrentStaff(null);
      setFormData({
        name: '',
        speciality: '',
        phone: '',
        email: '',
        photo_url: '',
        shift_start: '10:00',
        shift_end: '20:00',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentStaff(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (currentStaff) {
        await staffService.updateStaff(currentStaff.id, formData);
      } else {
        await staffService.createStaff(formData);
      }
      await loadStaff();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save staff:', error);
      alert('Failed to save staff.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await staffService.deleteStaff(id);
        setStaffList(staffList.filter(s => s.id !== id));
      } catch (error) {
        console.error('Failed to delete staff:', error);
        alert('Failed to delete staff.');
      }
    }
  };

  const filteredStaff = staffList.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.speciality?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-zinc-50 flex items-center">
            Staff Management <Sparkles className="w-5 h-5 ml-3 text-gold-500" />
          </h1>
          <p className="text-zinc-400 mt-1 font-light">Manage your salon team and their schedules</p>
        </div>
        <Button variant="luxury" className="uppercase tracking-wider text-xs font-semibold" onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Add Staff
        </Button>
      </div>

      <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
        <CardHeader className="border-b border-zinc-900 pb-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search staff..."
                className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-gold-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 font-semibold tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Staff Member</th>
                  <th className="px-6 py-4">Speciality</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Shift Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Loading staff...</td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">No staff found.</td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {staff.photo_url ? (
                            <img src={staff.photo_url} alt={staff.name} className="h-10 w-10 rounded-full object-cover border border-zinc-700" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 uppercase font-medium">
                              {staff.name?.charAt(0)}
                            </div>
                          )}
                          <div className="font-medium text-zinc-100">{staff.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gold-400 font-medium">{staff.speciality}</td>
                      <td className="px-6 py-4">
                        {staff.phone && (
                          <div className="flex items-center text-zinc-300 mb-1">
                            <Phone className="mr-2 h-3 w-3 text-zinc-500" /> {staff.phone}
                          </div>
                        )}
                        {staff.email && (
                          <div className="flex items-center text-zinc-300">
                            <Mail className="mr-2 h-3 w-3 text-zinc-500" /> {staff.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-zinc-300">
                          <Clock className="mr-2 h-4 w-4 text-zinc-500" /> {staff.shift_start} - {staff.shift_end}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {staff.is_active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10" title="Edit Staff" onClick={() => handleOpenModal(staff)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10" title="Delete Staff" onClick={() => handleDelete(staff.id)}>
                            <Trash2 className="h-4 w-4" />
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-zinc-950 border-zinc-800 shadow-2xl">
            <CardHeader className="border-b border-zinc-900 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-serif text-zinc-50">
                {currentStaff ? 'Edit Staff' : 'Add New Staff'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="text-zinc-500 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Full Name</label>
                  <Input 
                    required 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe" 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Speciality</label>
                  <Input 
                    required 
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Hair Stylist" 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Phone</label>
                    <Input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., +91 9876543210" 
                      className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Email</label>
                    <Input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g., john@example.com" 
                      className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Shift Start</label>
                    <Input 
                      type="time"
                      name="shift_start"
                      value={formData.shift_start}
                      onChange={handleInputChange}
                      className="bg-zinc-900 border-zinc-800 text-zinc-100 [color-scheme:dark]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Shift End</label>
                    <Input 
                      type="time"
                      name="shift_end"
                      value={formData.shift_end}
                      onChange={handleInputChange}
                      className="bg-zinc-900 border-zinc-800 text-zinc-100 [color-scheme:dark]" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Photo URL</label>
                  <Input 
                    name="photo_url"
                    value={formData.photo_url}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/..." 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                  />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="is_active" 
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="rounded border-zinc-800 bg-zinc-900 text-gold-500 focus:ring-gold-500/20" 
                  />
                  <label htmlFor="is_active" className="text-sm text-zinc-300">Active and visible on website</label>
                </div>
              </CardContent>
              <div className="p-6 border-t border-zinc-900 flex justify-end space-x-3">
                <Button type="button" variant="ghost" onClick={handleCloseModal} className="text-zinc-400 hover:text-white">Cancel</Button>
                <Button type="submit" variant="luxury" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Staff'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
