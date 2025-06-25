import React from 'react';
import { useAppearanceStore } from '../store/appearanceStore';
import { Phone, Mail, Globe, MapPin, Instagram, Linkedin, Youtube, Facebook } from 'lucide-react';

export default function Contact() {
  const { appearance } = useAppearanceStore();

  const socialIcons = {
    instagram: <Instagram className="w-6 h-6" />,
    linkedin: <Linkedin className="w-6 h-6" />,
    youtube: <Youtube className="w-6 h-6" />,
    facebook: <Facebook className="w-6 h-6" />
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {appearance.companyName && (
            <h2 className="text-2xl font-semibold text-gray-900">
              {appearance.companyName}
            </h2>
          )}

          {appearance.address && (
            <div className="flex items-start space-x-3 text-gray-600">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
              <p className="whitespace-pre-line">{appearance.address}</p>
            </div>
          )}

          {appearance.phone && (
            <div className="flex items-center space-x-3 text-gray-600">
              <Phone className="w-5 h-5 flex-shrink-0" />
              <a
                href={`tel:${appearance.phone}`}
                className="hover:text-orange-600 transition-colors"
              >
                {appearance.phone}
              </a>
            </div>
          )}

          {appearance.email && (
            <div className="flex items-center space-x-3 text-gray-600">
              <Mail className="w-5 h-5 flex-shrink-0" />
              <a
                href={`mailto:${appearance.email}`}
                className="hover:text-orange-600 transition-colors"
              >
                {appearance.email}
              </a>
            </div>
          )}

          {appearance.website && (
            <div className="flex items-center space-x-3 text-gray-600">
              <Globe className="w-5 h-5 flex-shrink-0" />
              <a
                href={appearance.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-600 transition-colors"
              >
                {appearance.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          {Object.entries(appearance.socialMedia).some(([_, url]) => url) && (
            <div className="pt-4 border-t">
              <div className="flex space-x-4">
                {Object.entries(appearance.socialMedia).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-orange-600 transition-colors"
                      title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    >
                      {socialIcons[platform as keyof typeof socialIcons]}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}