'use client';

import { useRef, useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card, { Article, CardRef } from "./Card";

type MainTabsProps = {
  articles: Article[];
  categories: string[];
};

export default function MainTabs({ articles, categories }: MainTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleArticles, setVisibleArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const articlesPerPage = 5;
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardRefs = useRef<Map<string, CardRef>>(new Map());

  // Adjust these constants for a more noticeable fade
  const TAB_HEIGHT = 80; // Height of the tab bar in pixels
  const FADE_OFFSET = 300; // Start fading earlier
  const SCROLL_DISTANCE = 150; // Shorter distance for more dramatic fade
  const GRADIENT_HEIGHT = 200; // Height of the gradient effect

  // Calculate trending categories
  const trendingCategories = categories.map(category => {
    const categoryArticles = articles.filter(article => article.category === category);
    const totalViews = categoryArticles.reduce((sum, article) => {
      const views = parseInt(article.views.replace(/[^\d]/g, ''), 10);
      return sum + views;
    }, 0);
    const totalComments = categoryArticles.reduce((sum, article) => {
      const comments = parseInt(article.comments.replace(/[^\d]/g, ''), 10);
      return sum + comments;
    }, 0);
    
    const engagementScore = totalViews + (totalComments * 100);
    
    return {
      category,
      engagementScore,
    };
  })
  .sort((a, b) => b.engagementScore - a.engagementScore)
  .slice(0, 5)
  .map(item => item.category);

  const loadMoreArticles = () => {
    setIsLoading(true);
    const filteredArticles = activeTab === "all" 
      ? articles 
      : articles.filter(article => article.category.toLowerCase() === activeTab);
    
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const newArticles = filteredArticles.slice(startIndex, endIndex);
    
    setVisibleArticles(prev => [...prev, ...newArticles]);
    setCurrentPage(prev => prev + 1);
    setIsLoading(false);
  };

  // Reset pagination when changing tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setVisibleArticles([]);
    setCurrentPage(1);
  };

  useEffect(() => {
    loadMoreArticles();
  }, [activeTab]); // Load initial articles when tab changes

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading) {
          loadMoreArticles();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [currentPage, isLoading, activeTab]);

  const handleScrollStart = useCallback((event?: Event) => {
    setIsScrolling(true);
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    // Set a new timeout to detect when scrolling stops
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150); // Adjust this value to control how quickly the fade disappears after scrolling stops
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const tabsContainer = tabsRef.current;
    const contentContainer = contentRef.current;
    if (!scrollContainer || !tabsContainer || !contentContainer) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
        handleScrollStart();
      }
    };

    const handlePageScroll = () => {
      if (!tabsContainer || !contentContainer) return;
      const rect = tabsContainer.getBoundingClientRect();
      const isAtTop = rect.top === 0;
      setIsSticky(isAtTop);
      handleScrollStart();

      // Calculate scroll progress for the gradient effect
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const contentRect = contentContainer.getBoundingClientRect();
      
      // Calculate distances for top and bottom gradients
      const distanceFromTop = rect.top - TAB_HEIGHT;
      const distanceFromBottom = viewportHeight - contentRect.bottom;
      
      // Calculate progress based on scroll position
      let progress;
      if (distanceFromTop > FADE_OFFSET) {
        progress = 0;
      } else {
        const effectiveScroll = FADE_OFFSET - distanceFromTop;
        progress = Math.min(effectiveScroll / SCROLL_DISTANCE, 1);
      }
      
      setScrollProgress(progress);
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    scrollContainer.addEventListener('scroll', handleScrollStart);
    window.addEventListener('scroll', handlePageScroll);
    handlePageScroll();

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
      scrollContainer.removeEventListener('scroll', handleScrollStart);
      window.removeEventListener('scroll', handlePageScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScrollStart]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 300;
    const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const setCardRef = useCallback((element: CardRef | null, id: string) => {
    if (element) {
      cardRefs.current.set(id, element);
    } else {
      cardRefs.current.delete(id);
    }
  }, []);

  const updateCardOpacity = useCallback(() => {
    if (!tabsRef.current) return;
    
    const viewportHeight = window.innerHeight;
    
    cardRefs.current.forEach((cardRef, id) => {
      const cardEl = cardRef.element;
      if (cardEl) {
        const rect = cardEl.getBoundingClientRect();
        
        // Bottom gradient (viewport entry)
        const distanceFromBottom = viewportHeight - rect.top;
        const isEnteringFromBottom = rect.top > viewportHeight - 200;
        
        if (isEnteringFromBottom) {
          const fadeProgress = Math.max(0, Math.min(1, distanceFromBottom / 200));
          cardEl.style.opacity = fadeProgress.toString();
        } else {
          cardEl.style.opacity = '1';
        }
      }
    });
  }, []);

  // Add scroll handler for card opacity with more frequent updates
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(updateCardOpacity);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateCardOpacity]);

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
      <div 
        ref={tabsRef}
        className={`sticky top-0 z-50 border-b border-gray-200 transition-all duration-300 ${
          isSticky ? 'bg-white shadow-lg backdrop-blur-md' : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="relative w-full">
          <div 
            ref={scrollContainerRef}
            className="w-full overflow-x-auto scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="inline-flex min-w-full justify-center">
              <TabsList className="flex gap-4 pt-6 mb-4 w-max bg-transparent px-6 border-0">
                <TabsTrigger 
                  value="all"
                  className="px-8 py-2.5 rounded-full text-sm font-medium transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-50/50 data-[state=active]:hover:bg-black/90 whitespace-nowrap flex-shrink-0 bg-transparent"
                >
                  All
                </TabsTrigger>
                {trendingCategories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category.toLowerCase()}
                    className="px-8 py-2.5 rounded-full text-sm font-medium transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-50/50 data-[state=active]:hover:bg-black/90 whitespace-nowrap flex-shrink-0 bg-transparent"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <div className={`absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l ${
            isSticky ? 'from-white' : 'from-transparent'
          } to-transparent z-10 pointer-events-none`}></div>
        </div>
      </div>

      {/* Content Container without gradient overlays */}
      <div ref={contentRef} className="relative max-w-[95%] mx-auto">
        {/* All Articles */}
        <TabsContent value="all" className="space-y-6 pt-16">
          <div className="grid grid-cols-1 gap-6">
            {visibleArticles.map((article, index) => {
              const cardId = `${article.title}-${index}`;
              return (
                <Card
                  key={cardId}
                  article={article}
                  href={`/article/${index}`}
                  index={index}
                  ref={(el) => setCardRef(el, cardId)}
                />
              );
            })}
            {/* Loading indicator and intersection observer target */}
            <div ref={loadMoreRef} className="w-full py-4 flex justify-center">
              {isLoading && (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Dynamic Category Tabs */}
        {trendingCategories.map((category) => (
          <TabsContent key={category} value={category.toLowerCase()} className="space-y-6 pt-16">
            <div className="grid grid-cols-1 gap-6">
              {visibleArticles
                .filter((article) => article.category === category)
                .map((article, index) => {
                  const cardId = `${article.title}-${category}-${index}`;
                  return (
                    <Card
                      key={cardId}
                      article={article}
                      href={`/article/${index}`}
                      index={index}
                      ref={(el) => setCardRef(el, cardId)}
                    />
                  );
                })}
              {/* Loading indicator and intersection observer target */}
              <div ref={loadMoreRef} className="w-full py-4 flex justify-center">
                {isLoading && (
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}