const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const { json } = require('express/lib/response');
const app = express();
const server = http.createServer(app);
const axios = require('axios');

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
          client_id: 'u-s4t2ud-bade814e2cc41641db7c51e8b45e1103a0ebcfb227eae8c933ee67bc9a23a9d1',
          client_secret: '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',
          code: code,
          redirect_uri: 'http://134.122.73.103:3000/intra42',
     });
     const data = await axios.get('https://api.intra.42.fr/v2/me', {
          headers: { Authorization: `Bearer ${response.data.access_token}` },
     });
     console.log(data.data);
     
     const data_1 = await axios.get('https://api.intra.42.fr/v2/me', {
          headers: { Authorization: `Bearer ${response.data.access_token}` },
     });

     const photoDirectory = '/root/backend/photos';
     if (!fs.existsSync(photoDirectory)) {
          fs.mkdirSync(photoDirectory);
     }

     for (const user of data_1.data) {
          if (user['active?'] === true && user.image && user.image.link) {
              const fileName = `${user.login}.jpg`;
              const filePath = `${photoDirectory}/${fileName}`;
      
              try {
                  const response = await axios.get(user.image.link, { responseType: 'stream' });
                  response.data.pipe(fs.createWriteStream(filePath));
                  console.log(`Fotoğraf indirildi: ${filePath}`);
              } catch (error) {
                  console.error(`Fotoğraf indirilirken hata oluştu: ${error}`);
              }
          }
      }
      console.log(data.data.image)
     
     res.send({ status: 200, message: "Basarili" });
});


server.listen(3000, () => console.log('server listening on port: http://localhost:3000'));