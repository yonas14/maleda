import { forwardRef, useRef, useImperativeHandle } from "react";
import Link from "next/link";
import ArticleCard from "./ArticleCard";

export type Article = {
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

export type CardRef = {
  element: HTMLAnchorElement | null;
};

export type CardProps = {
  article: Article;
  href: string;
  index: number;
};

const Card = forwardRef<CardRef, CardProps>(({ article, href, index }, ref) => {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useImperativeHandle(ref, () => ({
    element: linkRef.current
  }), []);

  return (
    <Link 
      href={href}
      ref={linkRef}
      className="transition-opacity duration-200"
    >
      <ArticleCard {...article} category={article.category} />
    </Link>
  );
});

Card.displayName = 'Card';

export default Card; 