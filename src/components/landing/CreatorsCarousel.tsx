'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { LandingCreatorProfile } from '@/types/landing';

interface CreatorsCarouselProps {
  creators: LandingCreatorProfile[];
  autoplay?: boolean;
  autoplayInterval?: number;
}

export default function CreatorsCarousel({
  creators,
  autoplay = true,
  autoplayInterval = 5000,
}: CreatorsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  // Auto-play logic
  useEffect(() => {
    if (!autoplay || isAutoplayPaused || creators.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, creators.length - 1);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [autoplay, isAutoplayPaused, creators.length, autoplayInterval]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? creators.length - 1 : prev - 1));
    setIsAutoplayPaused(true);
    setTimeout(() => setIsAutoplayPaused(false), 5000);
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, creators.length - 1);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setIsAutoplayPaused(true);
    setTimeout(() => setIsAutoplayPaused(false), 5000);
  };

  if (creators.length === 0) return null;

  const currentCreator = creators[currentIndex];
  const currentPage = currentIndex + 1;

  return (
    <div className="w-full">
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl p-6 md:p-10">
        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-center">
          {/* Image */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full bg-blue-50 overflow-hidden">
              {currentCreator.image_url ? (
                <img
                  src={currentCreator.image_url}
                  alt={currentCreator.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/placeholder-avatar.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-600 text-5xl font-bold">
                  {currentCreator.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Text */}
          <div className="space-y-4">
            <div className="text-blue-600">
              <Quote className="w-10 h-10" aria-hidden="true" />
            </div>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {currentCreator.bio}
            </p>
            <div>
              <div className="text-lg font-bold text-gray-900">{currentCreator.name}</div>
              <div className="text-sm text-blue-600 font-semibold">{currentCreator.title}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {creators.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-blue-600 text-white w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 mx-auto" aria-hidden="true" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-blue-600 text-white w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              aria-label="Berikutnya"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 mx-auto" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* Indicators */}
      {creators.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          {creators.map((creator, idx) => (
            <button
              key={creator.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                idx === currentPage - 1
                  ? 'border-blue-600 scale-105'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              aria-label={`Buka profil ${creator.name}`}
              aria-current={idx === currentPage - 1}
            >
              {creator.image_url ? (
                <img
                  src={creator.image_url}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/placeholder-avatar.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                  {creator.name.charAt(0)}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
