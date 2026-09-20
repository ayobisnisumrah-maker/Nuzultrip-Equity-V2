import React from 'react';
import { Container } from '../layout/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { ArrowButton } from '../ui/ArrowButton';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { EQUITY_METRICS, IMAGES } from '../../data/landingData';

interface EquitySectionProps {
  onOpenInterest: () => void;
  onOpenDetail: () => void;
}

export const EquitySection: React.FC<EquitySectionProps> = ({
  onOpenInterest,
  onOpenDetail,
}) => {
  return (
    <section
      id="peluang"
      className="py-16 sm:py-24 lg:py-32 border-t border-black/[0.06]"
    >
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-stretch">
          {/* Column 1: Left Editorial Content */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full">
            <div>
              <Eyebrow>PELUANG EQUITY</Eyebrow>
              <h2 className="font-h2 font-bold text-[#111111] leading-[1.05] tracking-tight mb-5 sm:mb-6">
                Kesempatan<br />
                Bertumbuh<br />
                Bersama
              </h2>
              <p className="text-[16px] sm:text-[17px] text-[#555555] leading-[1.65] max-w-[360px]">
                Jadilah bagian dari perjalanan besar Nuzultrip dengan kepemilikan
                yang jelas, transparan, dan terstruktur.
              </p>
            </div>

            {/* Bottom-aligned CTA link */}
            <div className="pt-8 sm:pt-10 mt-auto">
              <ArrowButton
                variant="link"
                onClick={onOpenDetail}
                id="equity-cta-detail"
              >
                Lebih Detail Penawaran
              </ArrowButton>
            </div>
          </div>

          {/* Column 2: 6 Metrics Point - Dibuat Vertikal Setinggi Gambar Mengikuti Hierarki Space */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full py-1 min-h-[420px] sm:min-h-[480px]">
            {EQUITY_METRICS.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-baseline justify-between gap-4 pb-3 sm:pb-3.5 ${
                  index < EQUITY_METRICS.length - 1 ? 'border-b border-black/[0.1]' : ''
                } group`}
              >
                <div className="text-[26px] sm:text-[30px] lg:text-[32px] font-extrabold text-[#111111] tracking-tight leading-none shrink-0 group-hover:translate-x-0.5 transition-transform duration-200">
                  <AnimatedNumber
                    value={item.value}
                    prefix={item.prefix}
                    suffix={item.suffix}
                    decimals={item.decimals}
                    customDisplay={item.customDisplay}
                  />
                </div>
                <p className="text-[13px] sm:text-[14px] text-[#666666] font-medium text-right leading-snug max-w-[200px]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Column 3: Premium Investment Visual Card - Tinggi sejajar kolom metrik vertikal */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <div className="relative w-full h-full min-h-[420px] sm:min-h-[480px] rounded-2xl overflow-hidden shadow-lg border border-black/10 flex flex-col justify-between p-6 sm:p-7 text-white group">
              {/* Background Photo with dark overlay */}
              <img
                src={IMAGES.nabawiDusk}
                alt="Masjid Nabawi di waktu senja"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/85" />

              {/* Top Headline on Image */}
              <div className="relative z-10">
                <h3 className="text-[22px] sm:text-[25px] font-bold leading-[1.2] tracking-tight">
                  Investasi Hari Ini,<br />
                  Untuk Masa Depan<br />
                  yang Lebih Baik.
                </h3>
              </div>

              {/* Bottom CTA Button on Image */}
              <div className="relative z-10 pt-6">
                <button
                  type="button"
                  id="equity-card-interest-btn"
                  onClick={onOpenInterest}
                  className="w-full py-3.5 px-4 rounded-xl bg-white text-[#090909] font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#EDEDEB] active:scale-98 transition-all duration-200 shadow-sm group/btn cursor-pointer"
                >
                  <span>Ajukan Minat Equity</span>
                  <span className="transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
