import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Select } from '@/src/components/ui/Select';
import { Search, Plus, Edit, Trash2, Image as ImageIcon, Sparkles, X, Check } from 'lucide-react';
import { heroSlideService } from '@/src/services/heroSlides';

export default function HeroSlider() {
  const [searchTerm, setSearchTerm] = useState('');
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    media_url: '',
    media_type: 'image',
    button_text: '',
    button_link: '',
    sort_order: 0,
    is_active: true,
    duration_seconds: 10
  });

  useEffect(() => {
    loadSlides();
  }, []);

  async function loadSlides() {
    try {
      setIsLoading(true);
      const data = await heroSlideService.getSlides();
      setSlides(data || []);
    } catch (error) {
      console.error('Failed to load hero slides:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenModal = (slide: any = null) => {
    if (slide) {
      setCurrentSlide(slide);
      setFormData({
        title: slide.title || '',
        subtitle: slide.subtitle || '',
        media_url: slide.media_url,
        media_type: slide.media_type || 'image',
        button_text: slide.button_text || '',
        button_link: slide.button_link || '',
        sort_order: slide.sort_order || 0,
        is_active: slide.is_active,
        duration_seconds: slide.duration_seconds || 10
      });
    } else {
      setCurrentSlide(null);
      setFormData({
        title: '',
        subtitle: '',
        media_url: '',
        media_type: 'image',
        button_text: '',
        button_link: '',
        sort_order: slides.length,
        is_active: true,
        duration_seconds: 10
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSlide(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (name === 'sort_order' || name === 'duration_seconds' ? parseInt(value) : value)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict 4-slide validation
    const activeCount = slides.filter(s => s.is_active && s.id !== currentSlide?.id).length;
    if (formData.is_active && activeCount >= 4) {
      alert('Maximum 4 active slides allowed. Please deactivate another slide first.');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        button_text: formData.button_text || null,
        button_link: formData.button_link || null,
        title: formData.title || null,
        subtitle: formData.subtitle || null,
      };

      if (currentSlide) {
        await heroSlideService.updateSlide(currentSlide.id, payload);
      } else {
        await heroSlideService.createSlide(payload);
      }
      await loadSlides();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save slide:', error);
      alert('Failed to save slide.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        await heroSlideService.deleteSlide(id);
        setSlides(slides.filter(s => s.id !== id));
      } catch (error) {
        console.error('Failed to delete slide:', error);
        alert('Failed to delete slide.');
      }
    }
  };

  const handleToggleActive = async (slide: any) => {
    const newStatus = !slide.is_active;
    if (newStatus) {
      const activeCount = slides.filter(s => s.is_active).length;
      if (activeCount >= 4) {
        alert('Maximum 4 active slides allowed. Please deactivate another slide first.');
        return;
      }
    }
    try {
      await heroSlideService.updateSlide(slide.id, { is_active: newStatus });
      setSlides(slides.map(s => s.id === slide.id ? { ...s, is_active: newStatus } : s));
    } catch (error) {
      console.error('Failed to toggle slide:', error);
      alert('Failed to update slide status.');
    }
  };

  const filteredSlides = slides.filter(s => 
    s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-zinc-50 flex items-center">
            Hero Slider <Sparkles className="w-5 h-5 ml-3 text-gold-500" />
          </h1>
          <p className="text-zinc-400 mt-1 font-light">Manage the homepage hero carousel</p>
        </div>
        <Button variant="luxury" className="uppercase tracking-wider text-xs font-semibold" onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Add Slide
        </Button>
      </div>

      <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
        <CardHeader className="border-b border-zinc-900 pb-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search slides..."
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
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Title & Subtitle</th>
                  <th className="px-6 py-4">CTA Button</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Loading slides...</td>
                  </tr>
                ) : filteredSlides.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">No slides found.</td>
                  </tr>
                ) : (
                  filteredSlides.map((slide) => (
                    <tr key={slide.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="h-16 w-24 rounded overflow-hidden border border-zinc-800 bg-zinc-900">
                          {slide.media_url ? (
                            slide.media_type === 'video' ? (
                              <video src={slide.media_url} className="h-full w-full object-cover" muted />
                            ) : (
                              <img src={slide.media_url} alt={slide.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                            )
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-zinc-600">
                              <ImageIcon className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-100">{slide.title}</div>
                        <div className="text-zinc-500 text-xs mt-1">{slide.subtitle}</div>
                      </td>
                      <td className="px-6 py-4">
                        {slide.button_text ? (
                          <div className="text-zinc-300">
                            <span className="font-medium">{slide.button_text}</span>
                            <span className="text-zinc-600 ml-2">({slide.button_link})</span>
                          </div>
                        ) : (
                          <span className="text-zinc-600 italic">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-zinc-300">
                        {slide.sort_order}
                      </td>
                      <td className="px-6 py-4">
                        {slide.is_active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className={`h-8 w-8 ${slide.is_active ? 'text-zinc-500 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-300' : 'text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'}`}
                            onClick={() => handleToggleActive(slide)}
                            title={slide.is_active ? "Deactivate Slide" : "Activate Slide"}
                          >
                            {slide.is_active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10" title="Edit Slide" onClick={() => handleOpenModal(slide)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10" title="Delete Slide" onClick={() => handleDelete(slide.id)}>
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
                {currentSlide ? 'Edit Slide' : 'Add New Slide'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="text-zinc-500 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Title</label>
                  <Input 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Luxury Salon Experience" 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Subtitle</label>
                  <Input 
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Book your appointment today" 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Media URL</label>
                  <Input 
                    required 
                    name="media_url"
                    value={formData.media_url}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/..." 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                  />
                  {formData.media_url && (
                    <div className="mt-2 h-32 w-full rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                      {formData.media_type === 'video' ? (
                        <video src={formData.media_url} className="h-full w-full object-cover" muted />
                      ) : (
                        <img src={formData.media_url} alt="Preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      )}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Button Text</label>
                    <Input 
                      name="button_text"
                      value={formData.button_text}
                      onChange={handleInputChange}
                      placeholder="e.g., Book Now" 
                      className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Button Link</label>
                    <Input 
                      name="button_link"
                      value={formData.button_link}
                      onChange={handleInputChange}
                      placeholder="e.g., /book" 
                      className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Media Type</label>
                    <Select 
                      name="media_type"
                      value={formData.media_type}
                      onChange={handleInputChange}
                      className="bg-zinc-900 border-zinc-800 text-zinc-100"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Sort Order</label>
                    <Input 
                      type="number"
                      name="sort_order"
                      value={formData.sort_order}
                      onChange={handleInputChange}
                      className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Duration (Sec)</label>
                    <Select 
                      name="duration_seconds"
                      value={formData.duration_seconds}
                      onChange={handleInputChange}
                      className="bg-zinc-900 border-zinc-800 text-zinc-100"
                    >
                      <option value={10}>10s</option>
                      <option value={15}>15s</option>
                      <option value={20}>20s</option>
                      <option value={30}>30s</option>
                    </Select>
                  </div>
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
                  {isSaving ? 'Saving...' : 'Save Slide'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
