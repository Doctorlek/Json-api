const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { apiName, json } = JSON.parse(event.body);

    if (!apiName || !json) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'API name and JSON are required.' }),
      };
    }

    const dir = path.join('/tmp', 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const filePath = path.join(dir, `${apiName}.json`);
    fs.writeFileSync(filePath, json, 'utf-8');

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'JSON saved successfully!',
        url: `/data/${apiName}.json`,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error saving JSON.', error: error.message }),
    };
  }
};
