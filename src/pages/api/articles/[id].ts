import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
export const runtime = 'edge';

type Article = {
  title: string;
  description: string;
  date: string;
  views: string;
  comments: string;
  image: string;
  category: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const { id } = req.query;
  const filePath = path.join(process.cwd(), 'data', 'articles.json');
  const jsonData = await fs.readFile(filePath, 'utf8');
  const articles: Article[] = JSON.parse(jsonData);
  const article = articles[Number(id)];

  if (article) {
    res.status(200).json(article);
  } else {
    res.status(404).json({ message: 'Article not found' });
  }
  
}
