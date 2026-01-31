import Image from 'next/image';
import { Building2 } from 'lucide-react';
import { LandingEmployer } from '@/types/landing';

interface PartnersCarouselProps {
  employers: LandingEmployer[];
}

export function PartnersCarousel({ employers }: PartnersCarouselProps) {
  if (employers.length === 0) {
    return null;
  }

  const midpoint = Math.ceil(employers.length / 2);
  const rowOne = employers.slice(0, midpoint);
  const rowTwo = employers.slice(midpoint);
  const rowOneLoop = rowOne.length > 0 ? [...rowOne, ...rowOne] : [];
  const rowTwoLoop = rowTwo.length > 0 ? [...rowTwo, ...rowTwo] : [];

  return (
    <div className="w-full" aria-label="Daftar mitra perusahaan">
      <div className="space-y-5 overflow-hidden">
        {/* Row 1 */}
        <div className="relative">
          <div className="flex gap-4 md:gap-6 items-center marquee-left">
            {rowOneLoop.map((employer, index) => (
              <div
                key={`${employer.id}-${index}`}
                className="bg-white rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 h-20 md:h-24 min-w-[140px] md:min-w-[180px] flex items-center justify-center border border-gray-100"
              >
                {employer.logo_url ? (
                  <div className="relative w-full h-12 md:h-14">
                    <Image
                      src={employer.logo_url}
                      alt={employer.company_name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder-logo.svg';
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-5 h-5" aria-hidden="true" />
                    <span className="text-xs font-medium text-center">
                      {employer.company_name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 */}
        {rowTwoLoop.length > 0 && (
          <div className="relative">
            <div className="flex gap-4 md:gap-6 items-center marquee-right">
              {rowTwoLoop.map((employer, index) => (
                <div
                  key={`${employer.id}-${index}`}
                  className="bg-white rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 h-20 md:h-24 min-w-[140px] md:min-w-[180px] flex items-center justify-center border border-gray-100"
                >
                  {employer.logo_url ? (
                    <div className="relative w-full h-12 md:h-14">
                      <Image
                        src={employer.logo_url}
                        alt={employer.company_name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="w-5 h-5" aria-hidden="true" />
                      <span className="text-xs font-medium text-center">
                        {employer.company_name}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .marquee-left {
          animation: marquee-left 25s linear infinite;
          width: max-content;
        }
        .marquee-right {
          animation: marquee-right 28s linear infinite;
          width: max-content;
        }
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
