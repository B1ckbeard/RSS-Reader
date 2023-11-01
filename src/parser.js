export default function parse(data) {
  const domParser = new DOMParser();
  // const doc = domParser.parseFromString(data, 'text/xml').documentElement;
  const parsedData = domParser.parseFromString(data, 'application/xml').documentElement;
  if (parsedData.querySelector('parsererror')) {
    throw new Error('errors.parserError');
  }
  const posts = parsedData.querySelectorAll('item');
  return {
    feed: {
      title: parsedData.querySelector('channel title').textContent,
      description: parsedData.querySelector('channel description').textContent,
    },
    posts: [...posts].map((post) => ({
      title: post.querySelector('title').textContent,
      link: post.querySelector('link').textContent,
      description: post.querySelector('description').textContent,
    })),
  };
}
