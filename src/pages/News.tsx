import React from 'react';
import { useNewsStore } from '../store/newsStore';
import { formatDate } from '../utils/dateUtils';

export default function News() {
  const { articles } = useNewsStore();
  const publishedArticles = articles.filter(article => article.published);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Actualités</h1>
        
        <div className="space-y-8">
          {publishedArticles.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aucune actualité pour le moment
            </p>
          ) : (
            publishedArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="aspect-[16/9] relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {formatDate(article.date)}
                  </p>
                  <div className="prose max-w-none">
                    {article.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-600 mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}