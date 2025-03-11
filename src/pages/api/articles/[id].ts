import articles from '../../../../data/articles.json';

export const runtime = 'edge';

export default function handler(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const article = articles[Number(id)];

    if (article) {
      return new Response(JSON.stringify(article), {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Article not found' }), {
        status: 404,
        headers: {
          'content-type': 'application/json',
        },
      });
    }
  } catch (error: unknown) {
    return new Response(JSON.stringify({ message: 'Internal Server Error', error }), {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}
