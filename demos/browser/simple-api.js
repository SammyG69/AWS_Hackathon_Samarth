const express = require('express');
const cors = require('cors');
const { main } = require('./groq.js');
const { sentianalyzer } = require('./sentiment-analyzer.js');
const { comforter } = require('./comforter.js');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/transcript', async (req, res) => {
  const { transcript } = req.body;
  if (!transcript) return res.status(400).send('Transcript missing');

  try {
    const suggestions = await main(transcript);
    res.send(suggestions);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error generating suggestions');
  }
});

app.post('/sentiment', async (req, res) => {
  console.log('This Sentiment API is being called');
  const { transcript } = req.body;
  const result = await sentianalyzer(transcript); // should return { sentiment: 'positive' | 'negative' | 'neutral' }
  res.json(result);
});

app.post('/encouragement', async (req, res) => {
  const { transcript } = req.body;
  const result = await comforter(transcript);
  res.json(result);
});

app.listen(3001, () => console.log('Listening on http://localhost:3001'));
