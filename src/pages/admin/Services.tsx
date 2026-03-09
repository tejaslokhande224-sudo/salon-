import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Select } from '@/src/components/ui/Select';
import { Textarea } from '@/src/components/ui/Textarea';
import { Search, Plus, Edit, Trash2, Sparkles, X } from 'lucide-react';
import { serviceService } from '@/src/services/services';

export default function Services() {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentService, setCurrentService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    duration_minutes: '',
    description: '',
    is_active: true,
    is_featured: false
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      const [srvs, cats] = await Promise.all([
        serviceService.getServices(),
        serviceService.getCategories()
      ]);
      setServices(srvs || []);
      setCategories(cats || []);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenModal = (service: any = null) => {
    if (service) {
      setCurrentService(service);
      setFormData({
        name: service.name,
        category_id: service.category_id,
        price: service.price.toString(),
        duration_minutes: service.duration_minutes.toString(),
        description: service.description || '',
        is_active: service.is_active,
        is_featured: service.is_featured || false
      });
    } else {
      setCurrentService(null);
      setFormData({
        name: '',
        category_id: '',
        price: '',
        duration_minutes: '',
        description: '',
        is_active: true,
        is_featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentService(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        duration_minutes: parseInt(formData.duration_minutes)
      };

      if (currentService) {
        await serviceService.updateService(currentService.id, payload);
      } else {
        await serviceService.createService(payload);
      }
      
      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Failed to save service.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceService.deleteService(id);
        setServices(services.filter(s => s.id !== id));
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert('Failed to delete service.');
      }
    }
  };

  const filteredServices = services.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.service_categories?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-zinc-50 flex items-center">
            Services <Sparkles className="w-5 h-5 ml-3 text-gold-500" />
          </h1>
          <p className="text-zinc-400 mt-1 font-light">Manage your salon service offerings</p>
        </div>
        <Button variant="luxury" className="uppercase tracking-wider text-xs font-semibold" onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
        <CardHeader className="border-b border-zinc-900 pb-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search services..."
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
                  <th className="px-6 py-4">Service Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Loading services...</td>
                  </tr>
                ) : filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">No services found.</td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-100">{service.name}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">{service.service_categories?.name || 'Uncategorized'}</td>
                      <td className="px-6 py-4 font-medium text-gold-400">₹{service.price}</td>
                      <td className="px-6 py-4 text-zinc-300">{service.duration_minutes} mins</td>
                      <td className="px-6 py-4">
                        {service.is_active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {service.is_featured ? (
                          <Badge variant="outline" className="border-gold-500 text-gold-500">Featured</Badge>
                        ) : (
                          <span className="text-zinc-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10" onClick={() => handleOpenModal(service)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10" onClick={() => handleDelete(service.id)}>
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
                {currentService ? 'Edit Service' : 'Add New Service'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="text-zinc-500 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Service Name</label>
                  <Input 
                    required 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Luxury Haircut" 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Category</label>
                  <Select 
                    required 
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="bg-zinc-900 border-zinc-800 text-zinc-100"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Price (₹)</label>
                    <Input 
                      required 
                      type="number" 
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="999" 
                      className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Duration (mins)</label>
                    <Input 
                      required 
                      type="number" 
                      name="duration_minutes"
                      value={formData.duration_minutes}
                      onChange={handleInputChange}
                      placeholder="45" 
                      className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Description</label>
                  <Textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the service..." 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 resize-none h-24" 
                  />
                </div>
                <div className="flex items-center space-x-6 pt-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="is_active" 
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="rounded border-zinc-800 bg-zinc-900 text-gold-500 focus:ring-gold-500/20" 
                    />
                    <label htmlFor="is_active" className="text-sm text-zinc-300">Active</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="is_featured" 
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="rounded border-zinc-800 bg-zinc-900 text-gold-500 focus:ring-gold-500/20" 
                    />
                    <label htmlFor="is_featured" className="text-sm text-zinc-300">Featured on Home</label>
                  </div>
                </div>
              </CardContent>
              <div className="p-6 border-t border-zinc-900 flex justify-end space-x-3">
                <Button type="button" variant="ghost" onClick={handleCloseModal} className="text-zinc-400 hover:text-white">Cancel</Button>
                <Button type="submit" variant="luxury" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Service'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
