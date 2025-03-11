import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { Eye, MessageCircle, Clock, Calendar, User } from "lucide-react";

type Article = {
  title: string;
  description: string;
  content: string;
  date: string;
  views: string;
  comments: string;
  image: string;
  category: string;
  author: string;
  readTime: string;
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

  const renderContent = () => {
    if (!article.content) {
      return <p className="text-gray-700">No content available for this article.</p>;
    }

    return article.content.split('\n').map((paragraph, index) => {
      // Handle code blocks
      if (paragraph.startsWith('```')) {
        const codeContent = article.content
          .split('```')[1]
          .split('```')[0]
          .trim();
        return (
          <pre key={index} className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{codeContent}</code>
          </pre>
        );
      }
      // Handle bullet points
      if (paragraph.trim().startsWith('-')) {
        return (
          <ul key={index} className="list-disc ml-6 mb-4">
            <li>{paragraph.trim().substring(2)}</li>
          </ul>
        );
      }
      // Handle numbered lists
      if (/^\d+\./.test(paragraph.trim())) {
        return (
          <div key={index} className="mb-4">
            {paragraph}
          </div>
        );
      }
      // Regular paragraphs
      return paragraph.trim() && (
        <p key={index} className="mb-4">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Article Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
            <div className="flex items-center text-gray-600 text-sm mb-4">
              <span className="mr-4 flex items-center gap-1">
                <User className="h-4 w-4" /> {article.author}
              </span>
              <span className="mr-4 flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {article.date}
              </span>
              <span className="mr-4 flex items-center gap-1">
                <Clock className="h-4 w-4" /> {article.readTime}
              </span>
              <span className="mr-4 flex items-center gap-1">
                <Eye className="h-4 w-4" /> {article.views} views
              </span>
            </div>
            <div className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              {article.category}
            </div>
          </div>

          {/* Article Description */}
          <p className="text-gray-700 text-lg mb-6">{article.description}</p>

          {/* Article Content */}
          <div className="prose max-w-none">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
