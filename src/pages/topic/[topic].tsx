import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "@/styles/globals.css";
import fs from "fs/promises";
import path from "path";

import { GetStaticProps, GetStaticPaths } from "next";
import { useRef, useEffect, useState } from "react";

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
};

type TopicPageProps = {
  articles: Article[];
  categories: string[];
  currentTopic: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const filePath = path.join(process.cwd(), "data", "articles.json");
  const jsonData = await fs.readFile(filePath, "utf8");
  const articles: Article[] = JSON.parse(jsonData);
  
  const categories = Array.from(new Set(articles.map(article => article.category)));
  
  const paths = categories.map(category => ({
    params: { topic: category.toLowerCase().replace(' ', '-') }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<TopicPageProps> = async ({ params }) => {
  const filePath = path.join(process.cwd(), "data", "articles.json");
  const jsonData = await fs.readFile(filePath, "utf8");
  const articles: Article[] = JSON.parse(jsonData);
  
  const categories = Array.from(new Set(articles.map(article => article.category)));
  const topicName = (params?.topic as string).replace('-', ' ');
  
  const filteredArticles = articles.filter(
    article => article.category.toLowerCase() === topicName.toLowerCase()
  );

  return {
    props: {
      articles: filteredArticles,
      categories,
      currentTopic: topicName
    }
  };
};

const TopicPage = ({ articles, categories, currentTopic }: TopicPageProps) => {
  const router = useRouter();
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
    
    const scrollAmount = 300; // Adjust this value to change scroll distance
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
    handleScroll(); // Check initial state

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      {/* Main Layout */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Main Content */}
        <main>
          <div className="py-8">
            <Tabs defaultValue={currentTopic.toLowerCase()} className="w-full">
              <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200">
                <div className="relative">
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
                    className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
                  >
                    <div className="inline-flex px-6">
                      <TabsList className="flex gap-3 pt-6 mb-4">
                        {categories.map((category) => (
                          <TabsTrigger 
                            key={category} 
                            value={category.toLowerCase()}
                            onClick={() => router.push(`/topic/${category.toLowerCase().replace(' ', '-')}`)}
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

                <div className="flex justify-center pt-16">
                  <h1 className="text-3xl font-bold capitalize">
                    {currentTopic}
                  </h1>
                </div>
              </div>

              {/* Dynamic Category Content */}
              {categories.map((category) => (
                <TabsContent key={category} value={category.toLowerCase()} className="space-y-6 pt-16">
                  {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {articles.map((article, index) => (
                        <Link key={index} href={`/article/${index}`} legacyBehavior>
                          <a className="h-full block rounded-xl transition-transform hover:scale-[1.02]">
                            <div className="h-full">
                              <ArticleCard {...article} />
                            </div>
                          </a>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">No articles found for this topic.</p>
                      <Link href="/">
                        <button className="text-blue-600 hover:underline">
                          Return to homepage
                        </button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TopicPage; 