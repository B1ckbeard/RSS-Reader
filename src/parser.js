export default function parser(data) {
    const parse = new DOMParser();
    return Promise.resolve(parse.parseFromString(data, 'text/xml'));
  }
  