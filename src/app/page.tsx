import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import fs from "fs/promises";
import path from "path";
import MainTabs from "@/components/MainTabs";

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

// Function to fetch articles from JSON file
async function getArticles(): Promise<Article[]> {
  const filePath = path.join(process.cwd(), "data", "articles.json");
  const jsonData = await fs.readFile(filePath, "utf8");
  return JSON.parse(jsonData);
}

export default async function Home() {
  const articles = await getArticles();
  const categories = Array.from(new Set(articles.map(article => article.category)));
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <main className="flex-1 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
          <MainTabs articles={articles} categories={categories} />
        </main>
        <aside className="hidden lg:block w-full lg:w-1/4 lg:max-w-[300px]">
          <div className="sticky top-6 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
            <Sidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
