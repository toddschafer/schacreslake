const axios = require('axios');
const xmlJs = require('xml-js');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}

exports.handler = async function(event, context) {
  const { data } = await axios.get('https://dd.weather.gc.ca/citypage_weather/xml/AB/s0000297_e.xml');
  const json = xmlJs.xml2json(data, { compact: true });

  switch (event.httpMethod) {
    case 'OPTIONS':
      // To enable CORS...
      return {
        body: 'This was a preflight call!',
        headers,
        statusCode: 200, // Must be 200 otherwise pre-flight call fails
      };
    case 'GET':
      return {
        body: JSON.stringify(json),
        headers,
        statusCode: 200,
      };
  }

  return {
    statusCode: 500,
    body: 'Unrecognized HTTP Method, must be one of GET/POST/PUT/DELETE/OPTIONS.'
  };
}
