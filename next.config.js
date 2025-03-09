module.exports = {
  async rewrites() {
    return [
      {
        source: '/article/:id',
        destination: '/article/[id]',
      },
    ];
  },
};
