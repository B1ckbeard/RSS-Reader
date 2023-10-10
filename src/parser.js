export default (data) => {
    const parse = new DOMParser();
    return parse.parseFromString(data, 'text/xml');
};
