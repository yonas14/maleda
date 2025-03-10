import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Eye, MessageCircle, Calendar } from "lucide-react";

type ArticleProps = {
  title: string;
  description: string;
  date: string;
  views: string;
  comments: string;
  image: string;
  category?: string;
};

export default function ArticleCard({ title, description, date, views, comments, image, category }: ArticleProps) {
  return (
    <Card className="h-full flex flex-col rounded-xl hover:shadow-lg transition-all">
      <CardContent className="p-4 flex-1 flex flex-col">
        <h2 className="text-xl font-bold mt-1">{title}</h2>
        <p className="text-gray-600 mt-2 flex-1">{description}</p>
        <div className="text-sm text-gray-500 mt-4 flex items-center space-x-4">
          <span>{date}</span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" /> {views}
          </span>

          {category && (
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              {category}
            </span>
          )}
        </div>
      </CardContent>
      {/* <Image src={image} alt={title} width={120} height={80} className="rounded-md" /> */}
    </Card>
  );
}
