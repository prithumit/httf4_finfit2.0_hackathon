const getJSONFromFile = (path) => {
  if (process.env.NODE_ENV === 'test') {
    return path;
  }
  const request = new XMLHttpRequest();
  request.open('GET', path, false);
  request.send(null);
  const JSONData = JSON.parse(request.responseText);
  return JSONData;
};

export default getJSONFromFile;
