import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Save, Building2, MapPin, Phone, Mail, Clock, Link as LinkIcon, Sparkles } from 'lucide-react';
import { settingsService } from '@/src/services/settings';

export default function Settings() {
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setIsLoading(true);
      const data = await settingsService.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSave = async () => {
    if (!settings) return;
    try {
      setIsSaving(true);
      await settingsService.updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-zinc-500">Loading settings...</div>;
  }

  if (!settings) {
    return <div className="text-center py-12 text-zinc-500">No settings found.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto relative z-10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-zinc-50 flex items-center">
            Salon Settings <Sparkles className="w-5 h-5 ml-3 text-gold-500" />
          </h1>
          <p className="text-zinc-400 mt-1 font-light">Manage your business information and preferences</p>
        </div>
        <Button variant="luxury" onClick={handleSave} disabled={isSaving} className="uppercase tracking-wider text-xs font-semibold">
          <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Business Info */}
        <Card className="lg:col-span-2 bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
          <CardHeader className="border-b border-zinc-900">
            <CardTitle className="flex items-center text-lg text-zinc-100"><Building2 className="mr-2 h-5 w-5 text-gold-500" /> Business Information</CardTitle>
            <CardDescription className="text-zinc-400">Update your salon's core details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Salon Name</label>
                <Input 
                  value={settings.salon_name || ''} 
                  onChange={(e) => setSettings({...settings, salon_name: e.target.value})} 
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Logo URL</label>
                <Input 
                  value={settings.logo_url || ''} 
                  onChange={(e) => setSettings({...settings, logo_url: e.target.value})} 
                  placeholder="https://example.com/logo.png"
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex items-center"><Phone className="mr-2 h-4 w-4 text-zinc-500" /> Phone Number</label>
                <Input 
                  value={settings.phone || ''} 
                  onChange={(e) => setSettings({...settings, phone: e.target.value})} 
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex items-center"><Mail className="mr-2 h-4 w-4 text-zinc-500" /> Email Address</label>
                <Input 
                  value={settings.email || ''} 
                  onChange={(e) => setSettings({...settings, email: e.target.value})} 
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center"><MapPin className="mr-2 h-4 w-4 text-zinc-500" /> Physical Address</label>
              <Textarea 
                value={settings.address || ''} 
                onChange={(e) => setSettings({...settings, address: e.target.value})} 
                className="h-24 bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center"><MapPin className="mr-2 h-4 w-4 text-zinc-500" /> Google Maps Embed URL</label>
              <Input 
                value={settings.map_url || ''} 
                onChange={(e) => setSettings({...settings, map_url: e.target.value})} 
                className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
          <CardHeader className="border-b border-zinc-900">
            <CardTitle className="flex items-center text-lg text-zinc-100"><LinkIcon className="mr-2 h-5 w-5 text-gold-500" /> Social Links</CardTitle>
            <CardDescription className="text-zinc-400">Connect your social media accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Instagram URL</label>
              <Input 
                value={settings.social_links?.instagram || ''} 
                onChange={(e) => setSettings({...settings, social_links: {...(settings.social_links || {}), instagram: e.target.value}})} 
                className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Facebook URL</label>
              <Input 
                value={settings.social_links?.facebook || ''} 
                onChange={(e) => setSettings({...settings, social_links: {...(settings.social_links || {}), facebook: e.target.value}})} 
                className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">WhatsApp Link</label>
              <Input 
                value={settings.social_links?.whatsapp || ''} 
                onChange={(e) => setSettings({...settings, social_links: {...(settings.social_links || {}), whatsapp: e.target.value}})} 
                className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Opening Hours */}
        <Card className="lg:col-span-3 bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
          <CardHeader className="border-b border-zinc-900">
            <CardTitle className="flex items-center text-lg text-zinc-100"><Clock className="mr-2 h-5 w-5 text-gold-500" /> Opening Hours</CardTitle>
            <CardDescription className="text-zinc-400">Set your salon's operating hours</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <div key={day} className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 capitalize">{day}</label>
                  <Input 
                    value={settings.opening_hours?.[day] || ''} 
                    onChange={(e) => setSettings({
                      ...settings, 
                      opening_hours: { ...(settings.opening_hours || {}), [day]: e.target.value }
                    })} 
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
