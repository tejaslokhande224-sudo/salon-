import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Sparkles, Save } from 'lucide-react';
import { aboutService } from '@/src/services/about';

export default function About() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [contentId, setContentId] = useState<string | undefined>(undefined);
  
  const [formData, setFormData] = useState({
    hero_title: 'ABOUT GLOW UP',
    hero_subtitle: 'Discover the story behind Thane\'s premier luxury unisex salon.',
    about_headline: 'OUR PHILOSOPHY',
    about_description_1: 'At Glow Up Unisex Salon, we believe that beauty is an experience, not just a service.',
    about_description_2: 'Our team of passionate stylists and therapists are dedicated to understanding your unique needs.',
    salon_story: '',
    mission: '',
    vision: '',
    why_choose_title: 'WHY CHOOSE US',
    why_choose_points: JSON.stringify([
      { title: 'Premium Products', desc: 'We use only top-tier international brands.' },
      { title: 'Expert Professionals', desc: 'Our staff undergoes continuous training.' },
      { title: 'Personalized Care', desc: 'Every service is tailored to your specific needs.' },
      { title: 'Hygiene First', desc: 'Strict sanitization protocols ensure a safe environment.' }
    ], null, 2),
    stats: JSON.stringify({
      years: '10+',
      clients: '5000+',
      services: '50+'
    }, null, 2),
    team_title: 'MEET OUR EXPERTS',
    team_description: '',
    banner_image_url: 'https://picsum.photos/seed/luxury-texture/1920/1080',
    side_image_url: 'https://picsum.photos/seed/saloninterior-luxury/800/1000',
    video_url: '',
    founder_name: ''
  });

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      setIsLoading(true);
      const data = await aboutService.getAboutContent();
      if (data) {
        setContentId(data.id);
        setFormData({
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          about_headline: data.about_headline || '',
          about_description_1: data.about_description_1 || '',
          about_description_2: data.about_description_2 || '',
          salon_story: data.salon_story || '',
          mission: data.mission || '',
          vision: data.vision || '',
          why_choose_title: data.why_choose_title || '',
          why_choose_points: data.why_choose_points ? JSON.stringify(data.why_choose_points, null, 2) : '[]',
          stats: data.stats ? JSON.stringify(data.stats, null, 2) : '{}',
          team_title: data.team_title || '',
          team_description: data.team_description || '',
          banner_image_url: data.banner_image_url || '',
          side_image_url: data.side_image_url || '',
          video_url: data.video_url || '',
          founder_name: data.founder_name || ''
        });
      }
    } catch (error) {
      console.error('Failed to load about content:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      
      // Parse JSON fields
      let parsedWhyChoosePoints = [];
      let parsedStats = {};
      try {
        parsedWhyChoosePoints = JSON.parse(formData.why_choose_points);
        parsedStats = JSON.parse(formData.stats);
      } catch (err) {
        alert('Invalid JSON in Why Choose Points or Stats. Please fix before saving.');
        setIsSaving(false);
        return;
      }

      const payload = {
        ...formData,
        why_choose_points: parsedWhyChoosePoints,
        stats: parsedStats
      };

      const savedData = await aboutService.updateAboutContent(contentId, payload);
      if (savedData && savedData.id) {
        setContentId(savedData.id);
      }
      alert('About page content saved successfully!');
    } catch (error) {
      console.error('Failed to save about content:', error);
      alert('Failed to save about content.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-zinc-500 p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 relative z-10 pb-12">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-zinc-50 flex items-center">
            About Page Content <Sparkles className="w-5 h-5 ml-3 text-gold-500" />
          </h1>
          <p className="text-zinc-400 mt-1 font-light">Manage the content displayed on the public About page</p>
        </div>
        <Button variant="luxury" onClick={handleSave} disabled={isSaving} className="uppercase tracking-wider text-xs font-semibold">
          <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
          <CardHeader className="border-b border-zinc-900">
            <CardTitle className="text-xl font-serif text-zinc-50">Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Hero Title</label>
                <Input name="hero_title" value={formData.hero_title} onChange={handleInputChange} className="bg-zinc-900 border-zinc-800 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Hero Subtitle</label>
                <Input name="hero_subtitle" value={formData.hero_subtitle} onChange={handleInputChange} className="bg-zinc-900 border-zinc-800 text-zinc-100" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Banner Image URL</label>
                <Input name="banner_image_url" value={formData.banner_image_url} onChange={handleInputChange} className="bg-zinc-900 border-zinc-800 text-zinc-100" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
          <CardHeader className="border-b border-zinc-900">
            <CardTitle className="text-xl font-serif text-zinc-50">Our Story & Philosophy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Headline</label>
              <Input name="about_headline" value={formData.about_headline} onChange={handleInputChange} className="bg-zinc-900 border-zinc-800 text-zinc-100" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Description Paragraph 1</label>
              <Textarea name="about_description_1" value={formData.about_description_1} onChange={handleInputChange} className="h-24 bg-zinc-900 border-zinc-800 text-zinc-100 resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Description Paragraph 2</label>
              <Textarea name="about_description_2" value={formData.about_description_2} onChange={handleInputChange} className="h-24 bg-zinc-900 border-zinc-800 text-zinc-100 resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Side Image URL</label>
              <Input name="side_image_url" value={formData.side_image_url} onChange={handleInputChange} className="bg-zinc-900 border-zinc-800 text-zinc-100" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Stats (JSON Format)</label>
              <Textarea name="stats" value={formData.stats} onChange={handleInputChange} className="h-32 font-mono text-sm bg-zinc-900 border-zinc-800 text-zinc-100 resize-none" />
              <p className="text-xs text-zinc-500">Example: {`{"years": "10+", "clients": "5000+", "services": "50+"}`}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
          <CardHeader className="border-b border-zinc-900">
            <CardTitle className="text-xl font-serif text-zinc-50">Why Choose Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Section Title</label>
              <Input name="why_choose_title" value={formData.why_choose_title} onChange={handleInputChange} className="bg-zinc-900 border-zinc-800 text-zinc-100" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Points (JSON Array Format)</label>
              <Textarea name="why_choose_points" value={formData.why_choose_points} onChange={handleInputChange} className="h-64 font-mono text-sm bg-zinc-900 border-zinc-800 text-zinc-100 resize-none" />
              <p className="text-xs text-zinc-500">Must be a valid JSON array of objects with 'title' and 'desc' properties.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
          <CardHeader className="border-b border-zinc-900">
            <CardTitle className="text-xl font-serif text-zinc-50">Team Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Team Section Title</label>
              <Input name="team_title" value={formData.team_title} onChange={handleInputChange} className="bg-zinc-900 border-zinc-800 text-zinc-100" />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
