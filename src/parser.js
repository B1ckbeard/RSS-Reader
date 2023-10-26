export default function parse(data) {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(data, 'text/xml').documentElement;
  if (doc.querySelector('parsererror')) {
    throw new Error('errors.parserError');
  }
  const posts = doc.querySelectorAll('item');
  return {
    feed: {
      title: doc.querySelector('channel title').textContent,
      description: doc.querySelector('channel description').textContent,
    },
    posts: [...posts].map((post) => ({
      title: post.querySelector('title').textContent,
      link: post.querySelector('link').textContent,
      description: post.querySelector('description').textContent,
    })),
  };
}
