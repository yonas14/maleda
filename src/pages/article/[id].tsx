import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

type Article = {
  title: string;
  description: string;
  date: string;
  views: string;
  comments: string;
  image: string;
  category: string;
};

const ArticlePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticle = async () => { 
      if (id) {
        const response = await fetch(`/api/articles/${id}`);
        const data = await response.json();
        setArticle(data);
      }
    };
    fetchArticle();
  }, [id]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        {/* <img src={article.image} alt={article.title} className="w-full h-auto mb-4" /> */}
        <p className="text-gray-700 mb-4">{article.description}</p>
        <div className="text-gray-500 text-sm">
          <span>{article.date}</span> | <span>{article.views} views</span> | <span>{article.comments} comments</span>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
