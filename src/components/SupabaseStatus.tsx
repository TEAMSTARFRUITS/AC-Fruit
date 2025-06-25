import React from 'react';
import { Database } from 'lucide-react';

export function SupabaseStatus() {
  return (
    <div className="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 bg-orange-600 text-white">
      <Database className="w-4 h-4" />
      Mode local
    </div>
  );
}