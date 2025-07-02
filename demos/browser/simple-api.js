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
  try {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    const result = await fetch('http://127.0.0.1:5005/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
    });

    const data = await result.json();

    return res.json({
      sentiment: data.label,
      score: data.score,
    });
  } catch (err) {
    console.error('Sentiment error:', err);
    res.status(500).json({ error: 'Error analyzing sentiment' }); // <-- return JSON
  }
});

app.post('/encouragement', async (req, res) => {
  console.log('Received for encouragement:', req.body);

  const { transcript } = req.body;
  if (!transcript) return res.status(400).send('Transcript missing');

  try {
    const suggestions = await comforter(transcript);
    res.send(suggestions);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error generating suggestions');
  }
});

app.listen(3001, () => console.log('Listening on http://localhost:3001'));
