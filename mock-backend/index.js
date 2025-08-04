const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/marketplace/listings', (req, res) => {
  res.json([
    { tokenId: '1', seller: '0x1111111111111111111111111111111111111111', price: '1000000000000000000' },
    { tokenId: '2', seller: '0x2222222222222222222222222222222222222222', price: '2000000000000000000' },
    { tokenId: '3', seller: '0x3333333333333333333333333333333333333333', price: '3000000000000000000' }
  ]);
});

app.listen(3000, () => {
  console.log('Mock-backend corriendo en http://localhost:3000');
});
