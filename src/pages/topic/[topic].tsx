import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import "@/styles/globals.css";

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

const TopicPage = () => {
  const router = useRouter();
  const { topic } = router.query;
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      if (topic) {
        const response = await fetch('/api/articles');
        const data = await response.json();
        // Filter articles by category (case-insensitive and handle hyphenated URLs)
        const topicName = (topic as string).replace('-', ' ');
        const filteredArticles = data.filter(
          (article: Article) => article.category.toLowerCase() === topicName.toLowerCase()
        );
        setArticles(filteredArticles);
      }
    };
    fetchArticles();
  }, [topic]);

  if (!topic) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {(topic as string).replace('-', ' ')} Articles
        </h1>
        <div className="space-y-6">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <Link key={index} href={`/article/${index}`} legacyBehavior>
                <a>
                  <ArticleCard {...article} />
                </a>
              </Link>
            ))
          ) : (
            <p className="text-gray-600">No articles found for this topic.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicPage; 