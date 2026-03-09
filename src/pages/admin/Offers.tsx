import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Textarea } from '@/src/components/ui/Textarea';
import { Search, Plus, Edit, Trash2, Calendar, Sparkles, X } from 'lucide-react';
import { offerService } from '@/src/services/offers';

export default function Offers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    original_price: '',
    offer_price: '',
    valid_from: '',
    valid_to: '',
    image_url: '',
    is_active: true
  });

  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    try {
      setIsLoading(true);
      const data = await offerService.getOffers();
      setOffers(data || []);
    } catch (error) {
      console.error('Failed to load offers:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenModal = (offer: any = null) => {
    if (offer) {
      setCurrentOffer(offer);
      setFormData({
        title: offer.title,
        description: offer.description || '',
        original_price: offer.original_price?.toString() || '',
        offer_price: offer.offer_price.toString(),
        valid_from: offer.valid_from || '',
        valid_to: offer.valid_to || '',
        image_url: offer.image_url || '',
        is_active: offer.is_active
      });
    } else {
      setCurrentOffer(null);
      setFormData({
        title: '',
        description: '',
        original_price: '',
        offer_price: '',
        valid_from: '',
        valid_to: '',
        image_url: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentOffer(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        offer_price: parseFloat(formData.offer_price),
        valid_from: formData.valid_from || null,
        valid_to: formData.valid_to || null
      };

      if (currentOffer) {
        await offerService.updateOffer(currentOffer.id, payload);
      } else {
        await offerService.createOffer(payload);
      }
      
      await loadOffers();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save offer:', error);
      alert('Failed to save offer.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await offerService.deleteOffer(id);
        setOffers(offers.filter(o => o.id !== id));
      } catch (error) {
        console.error('Failed to delete offer:', error);
        alert('Failed to delete offer.');
      }
    }
  };

  const filteredOffers = offers.filter(o => 
    o.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-zinc-50 flex items-center">
            Offers <Sparkles className="w-5 h-5 ml-3 text-gold-500" />
          </h1>
          <p className="text-zinc-400 mt-1 font-light">Manage promotional offers and discounts</p>
        </div>
        <Button variant="luxury" className="uppercase tracking-wider text-xs font-semibold" onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Add Offer
        </Button>
      </div>

      <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
        <CardHeader className="border-b border-zinc-900 pb-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search offers..."
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
                  <th className="px-6 py-4">Offer Title</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Pricing</th>
                  <th className="px-6 py-4">Validity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Loading offers...</td>
                  </tr>
                ) : filteredOffers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">No offers found.</td>
                  </tr>
                ) : (
                  filteredOffers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-100">{offer.title}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-zinc-400" title={offer.description}>{offer.description}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gold-400">₹{offer.offer_price}</div>
                        {offer.original_price && <div className="text-xs text-zinc-500 line-through">₹{offer.original_price}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-zinc-300">
                          <Calendar className="mr-2 h-3 w-3 text-gold-500" />
                          {offer.valid_to ? new Date(offer.valid_to).toLocaleDateString() : 'Ongoing'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {offer.is_active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10" onClick={() => handleOpenModal(offer)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10" onClick={() => handleDelete(offer.id)}>
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
                {currentOffer ? 'Edit Offer' : 'Add New Offer'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="text-zinc-500 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Offer Title</label>
                  <Input 
                    required 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Summer Special Discount" 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Description</label>
                  <Textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the offer..." 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 resize-none h-24" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Original Price (₹)</label>
                    <Input 
                      type="number" 
                      name="original_price"
                      value={formData.original_price}
                      onChange={handleInputChange}
                      placeholder="1500" 
                      className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Offer Price (₹)</label>
                    <Input 
                      required 
                      type="number" 
                      name="offer_price"
                      value={formData.offer_price}
                      onChange={handleInputChange}
                      placeholder="999" 
                      className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Valid From</label>
                    <Input 
                      type="date" 
                      name="valid_from"
                      value={formData.valid_from}
                      onChange={handleInputChange}
                      className="bg-zinc-900 border-zinc-800 text-zinc-100 [color-scheme:dark]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Valid To</label>
                    <Input 
                      type="date" 
                      name="valid_to"
                      value={formData.valid_to}
                      onChange={handleInputChange}
                      className="bg-zinc-900 border-zinc-800 text-zinc-100 [color-scheme:dark]" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Image URL</label>
                  <Input 
                    name="image_url"
                    value={formData.image_url}
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
                  {isSaving ? 'Saving...' : 'Save Offer'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
