import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

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
    <Card className="flex gap-4">
      <CardContent className="p-4 flex-1">
        <h2 className="text-xl font-bold mt-1">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>
        <div className="text-sm text-gray-500 mt-2 flex space-x-4">
          <span>{date}</span>
          <span>{views}</span>
          <span>{comments}</span>
          {category && <span>{category}</span>}
        </div>
      </CardContent>
      {/* <Image src={image} alt={title} width={120} height={80} className="rounded-md" /> */}
    </Card>
  );
}
