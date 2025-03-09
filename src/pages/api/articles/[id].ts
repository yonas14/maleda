import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

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
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
