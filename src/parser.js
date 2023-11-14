export default function parse(data) {
  const domParser = new DOMParser();
  const parsedData = domParser.parseFromString(data, 'application/xhtml+xml');
  const parserError = parsedData.querySelector('parsererror');

  if (parserError) {
    const error = new Error(parserError.textContent);
    error.isParserError = true;
    console.log(error);
    throw Error('errors.parserError');
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
