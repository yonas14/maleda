import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "@/styles/globals.css";
import fs from "fs/promises";
import path from "path";
import { GetStaticProps, GetStaticPaths } from "next";

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

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      {/* Main Layout */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Main Content */}
        <main>
          <div className="py-8">
            <Tabs defaultValue={currentTopic.toLowerCase()} className="w-full">
              <TabsList className="flex space-x-4 bg-white shadow-md p-2 rounded-md sticky top-0 z-10">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category.toLowerCase()}
                    onClick={() => router.push(`/topic/${category.toLowerCase().replace(' ', '-')}`)}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex justify-center my-6">
                <h1 className="text-3xl font-bold capitalize">
                  {currentTopic}
                </h1>
              </div>

              {/* Dynamic Category Content */}
              {categories.map((category) => (
                <TabsContent key={category} value={category.toLowerCase()} className="space-y-6">
                  {articles.length > 0 ? (
                    articles.map((article, index) => (
                      <Link key={index} href={`/article/${index}`} legacyBehavior>
                        <a>
                          <ArticleCard {...article} />
                        </a>
                      </Link>
                    ))
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