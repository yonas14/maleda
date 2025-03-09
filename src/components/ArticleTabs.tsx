'use client';

import { useRef, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import ArticleCard from "./ArticleCard";

type Article = {
  title: string;
  description: string;
  date: string;
  views: string;
  comments: string;
  image: string;
  category: string;
  content: string;
  author: string;
  readTime: string;
  ranking?: number;
};

type ArticleTabsProps = {
  articles: Article[];
  categories: string[];
};

export default function ArticleTabs({ articles, categories }: ArticleTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 300;
    const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200">
        <div className="relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-100 to-transparent z-10 pointer-events-none"></div>
          
          {showLeftArrow && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          
          <div 
            ref={scrollContainerRef}
            className="w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="inline-flex px-6 min-w-full">
              <TabsList className="flex gap-3 pt-6 mb-4 w-max">
                <TabsTrigger 
                  value="all"
                  className="px-6 py-2.5 rounded-full text-sm font-medium transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100 data-[state=active]:hover:bg-black/90 whitespace-nowrap flex-shrink-0"
                >
                  All
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category.toLowerCase()}
                    className="px-6 py-2.5 rounded-full text-sm font-medium transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100 data-[state=active]:hover:bg-black/90 whitespace-nowrap flex-shrink-0"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {showRightArrow && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
          
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>

      {/* All Articles */}
      <TabsContent value="all" className="space-y-6 pt-16">
        <div className="grid grid-cols-1 gap-6">
          {articles.map((article, index) => (
            <Link key={index} href={`/article/${index}`} legacyBehavior>
              <a>
                <ArticleCard {...article} category={article.category} />
              </a>
            </Link>
          ))}
        </div>
      </TabsContent>

      {/* Dynamic Category Tabs */}
      {categories.map((category) => (
        <TabsContent key={category} value={category.toLowerCase()} className="space-y-6 pt-16">
          <div className="grid grid-cols-1 gap-6">
            {articles
              .filter((article) => article.category === category)
              .map((article, index) => (
                <Link key={index} href={`/article/${index}`} legacyBehavior>
                  <a>
                    <ArticleCard {...article} category={article.category} />
                  </a>
                </Link>
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
} 