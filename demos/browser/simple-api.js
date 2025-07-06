const express = require('express');
const cors = require('cors');
const { main } = require('./groq.js');
const { sentianalyzer } = require('./sentiment-analyzer.js');
const { comforter } = require('./comforter.js');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/transcript', async (req, res) => {
  const { text, label, labelTranscript } = req.body;
  if (!text) {
    console.log('Missing Full Transcript');
  }
  if (!label) {
    console.log('Missing Label');
  }
  if (!labelTranscript) {
    console.log('Missing Label Transcript');
  }
  if (!text || !label || !labelTranscript) {
    return res
      .status(400)
      .send('Missing one or more required fields: text, label, labelTranscript');
  }

  try {
    console.log(`🟡 Incoming classified segment:
    Label: ${label}
    Label Transcript: "${labelTranscript}"
    Full Transcript: "${text}"`);

    const suggestions = await main(labelTranscript);
    res.send({
      suggestions,
      label,
      labelTranscript,
    });
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

app.post('/classify', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('Text is required');

  try {
    const result = await fetch('http://localhost:8000/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await result.json();
    res.json(data);
  } catch (err) {
    console.error('Classification error:', err);
    res.status(500).json({ error: 'Error during classification' });
  }
});

app.post('/encouragement', async (req, res) => {
  const { transcript } = req.body;
  const result = await comforter(transcript);
  res.json(result);
});

app.listen(3001, () => console.log('Listening on http://localhost:3001'));
