import React from 'react';
import { useEventStore } from '../store/eventStore';
import { formatDate } from '../utils/dateUtils';
import { MapPin, Calendar } from 'lucide-react';

export default function Events() {
  const { events } = useEventStore();
  const publishedEvents = events.filter(event => event.published);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Événements</h1>
        
        <div className="space-y-8">
          {publishedEvents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aucun événement à venir
            </p>
          ) : (
            publishedEvents.map((event) => (
              <article
                key={event.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {event.image && (
                  <div className="aspect-[16/9] relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {event.title}
                  </h2>
                  
                  <div className="flex items-center gap-6 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>
                        Du {formatDate(event.startDate)} au {formatDate(event.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {event.description && (
                    <div className="prose max-w-none">
                      {event.description.split('\n').map((paragraph, index) => (
                        <p key={index} className="text-gray-600 mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}