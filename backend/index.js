require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const listings = [
  { tokenId: '1', seller: '0x1111111111111111111111111111111111111111', price: '1000000000000000000' },
  { tokenId: '2', seller: '0x2222222222222222222222222222222222222222', price: '2000000000000000000' },
  { tokenId: '3', seller: '0x3333333333333333333333333333333333333333', price: '3000000000000000000' }
];

app.get('/marketplace/listings', (req, res) => {
  res.json(listings);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Backend mock corriendo en http://localhost:\${PORT}\`);
});
