import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Select } from '@/src/components/ui/Select';
import { Plus, Trash2, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import { galleryService } from '@/src/services/gallery';

export default function Gallery() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const categories = ['Hair', 'Nails', 'Bridal', 'Skin', 'Salon Interior'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Hair',
    media_url: '',
    media_type: 'image',
    sort_order: 0
  });

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    try {
      setIsLoading(true);
      const data = await galleryService.getGalleryItems();
      setGallery(data || []);
    } catch (error) {
      console.error('Failed to load gallery:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenModal = () => {
    setFormData({
      title: '',
      category: 'Hair',
      media_url: '',
      media_type: 'image',
      sort_order: gallery.length
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sort_order' ? parseInt(value) : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await galleryService.createGalleryItem(formData);
      await loadGallery();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save gallery item:', error);
      alert('Failed to save gallery item.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await galleryService.deleteGalleryItem(id);
        setGallery(gallery.filter(item => item.id !== id));
      } catch (error) {
        console.error('Failed to delete image:', error);
        alert('Failed to delete image.');
      }
    }
  };

  const filteredGallery = activeCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-zinc-50 flex items-center">
            Gallery <Sparkles className="w-5 h-5 ml-3 text-gold-500" />
          </h1>
          <p className="text-zinc-400 mt-1 font-light">Manage your salon's portfolio</p>
        </div>
        <Button variant="luxury" className="uppercase tracking-wider text-xs font-semibold" onClick={handleOpenModal}>
          <Plus className="mr-2 h-4 w-4" /> Add Media
        </Button>
      </div>

      <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
        <CardHeader className="border-b border-zinc-900 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={activeCategory === 'All' ? 'luxury' : 'outline'}
              onClick={() => setActiveCategory('All')}
              size="sm"
              className={`rounded-full ${activeCategory !== 'All' ? 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600' : ''}`}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'luxury' : 'outline'}
                onClick={() => setActiveCategory(category)}
                size="sm"
                className={`rounded-full ${activeCategory !== category ? 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600' : ''}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-12 text-zinc-500">Loading gallery...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredGallery.map((item) => (
                <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800">
                  <img
                    src={item.media_url}
                    alt={item.title || item.category}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  <div className="absolute left-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Badge variant="outline" className="bg-black/50 backdrop-blur-md border-zinc-700 text-zinc-300">
                      {item.category}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                    <Button size="icon" variant="destructive" className="h-8 w-8 bg-rose-500/80 hover:bg-rose-500 backdrop-blur-md" title="Delete Image" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Upload Placeholder */}
              <div 
                className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 text-zinc-500 transition-all duration-300 hover:border-gold-500/50 hover:bg-gold-500/5 hover:text-gold-400 group"
                onClick={handleOpenModal}
              >
                <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 group-hover:border-gold-500/30 transition-colors">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider">Add Media</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 shadow-2xl">
            <CardHeader className="border-b border-zinc-900 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-serif text-zinc-50">Add Gallery Media</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="text-zinc-500 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="space-y-4 pt-6">
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
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Category</label>
                  <Select 
                    required 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="bg-zinc-900 border-zinc-800 text-zinc-100"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Title (Optional)</label>
                  <Input 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Bridal Look" 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100" 
                  />
                </div>
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
              </CardContent>
              <div className="p-6 border-t border-zinc-900 flex justify-end space-x-3">
                <Button type="button" variant="ghost" onClick={handleCloseModal} className="text-zinc-400 hover:text-white">Cancel</Button>
                <Button type="submit" variant="luxury" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Add to Gallery'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
