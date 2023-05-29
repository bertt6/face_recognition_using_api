const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const { json } = require('express/lib/response');
const app = express();
const server = http.createServer(app);
const axios = require('axios');
const { doesNotMatch } = require('assert');
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ status: 200, message: 'OK!' }));
});

app.get('/havaDurumu', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

app.get('/intra42', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const code = req.query.code;
  console.log(code);
  const response = await axios.post('https://api.intra.42.fr/oauth/token', {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: 'http://134.122.73.103:3000/intra42',
  });

  let page = 1;
  let totalUsers = 0;

  while (true) {
    const data = await axios.get('https://api.intra.42.fr/v2/campus/49/users', {
      headers: { Authorization: `Bearer ${response.data.access_token}` },
      params: {
        filter: "active",
        page: page
      }
    });

    const users = data.data;
    totalUsers += users.length;

    const downloadImages = async () => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (!user["active?"]) {
          console.log(`User_${user.id} is not active, skipping...`);
          continue;
        }
        if (!user.image || !user.image.link) {
          console.log(`Image link not available for user_${user.id}, skipping...`);
          continue;
        }
        const imageUrl = user.image.link;
        const imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
        const imagePath = `/root/backend/photos/${imageName}`;

        try {
          const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          fs.writeFileSync(imagePath, imageResponse.data, 'binary');
          console.log(`Image downloaded for user_${user.id}`);
        } catch (error) {
          console.error(`Failed to download image for user_${user.id}:`, error);
        }
      }
    };

    await downloadImages();

    if (users.length < 30) { 
      break;
    }

    page++;
  }

  console.log(`Total users: ${totalUsers}`);

  res.send({ status: 200, message: "Basarili" });
});

server.listen(3000, () => console.log('Server listening on port: http://localhost:3000'));

