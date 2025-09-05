import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});