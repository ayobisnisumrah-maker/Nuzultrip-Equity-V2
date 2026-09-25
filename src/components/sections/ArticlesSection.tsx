import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Container } from '../layout/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { ArrowButton } from '../ui/ArrowButton';
import { ArticleItem } from '../../data/landingData';
import { loadPublicHome } from '../../services/publicPortalService';
import { supabase } from '../../lib/supabase';

interface ArticlesSectionProps {
  onSelectArticle: (article: ArticleItem) => void;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ onSelectArticle }) => {
  const[cms,setCms]=useState<any>(null);
  useEffect(()=>{let active=true;const sync=async()=>{try{const sections=await loadPublicHome();if(active)setCms(sections.find(s=>s.anchorId==='konten')?.content?.articles_section||null)}catch{}};void sync();const channel=supabase?.channel('public-articles-cms').on('postgres_changes',{event:'*',schema:'public',table:'portal_sections'},()=>void sync()).on('postgres_changes',{event:'*',schema:'public',table:'portal_section_versions'},()=>void sync()).subscribe();return()=>{active=false;if(channel&&supabase)void supabase.removeChannel(channel)}},[]);
  const articles:ArticleItem[]=Array.isArray(cms?.items)?cms.items:[];
  return (
    <section
      id="artikel"
      className="py-16 sm:py-24 lg:py-32 border-t border-black/[0.06]"
    >
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Title & CTA */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full">
            <div>
              <Eyebrow>{cms?.eyebrow || ''}</Eyebrow>
              <h2 className="font-h2 font-bold text-[#111111] leading-[1.05] tracking-tight mb-5 sm:mb-6">
                {cms?.title || ''}
              </h2>
              <p className="text-[16px] sm:text-[17px] text-[#555555] leading-[1.65] max-w-[360px]">
                {cms?.description || ''}
              </p>
            </div>

            {/* Bottom-aligned CTA link */}
            <div className="pt-8 sm:pt-10 mt-auto">
              <ArrowButton
                variant="link"
                onClick={() => articles[0] && onSelectArticle(articles[0])}
                id="articles-cta-more"
              >
                {cms?.more_label || ''}
              </ArrowButton>
            </div>
          </div>

          {/* Right Column: 2 Editorial Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="bg-white rounded-2xl overflow-hidden border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-black/25 hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                {/* Image */}
                <div className="relative w-full h-[210px] overflow-hidden bg-[#E8E8E4]">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#111111] uppercase tracking-[0.1em]">
                    {article.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-3 text-[12px] text-[#888888] font-medium mb-2.5">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-[19px] sm:text-[20px] font-bold text-[#111111] leading-snug tracking-tight mb-2.5 group-hover:text-black">
                      {article.title}
                    </h3>

                    <p className="text-[14px] text-[#666666] leading-relaxed line-clamp-3">
                      {article.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between text-[13px] font-bold text-[#111111]">
                    <span>{cms?.read_label || ''}</span>
                    <ArrowRight
                      size={15}
                      className="group-hover:translate-x-1.5 transition-transform duration-200"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
