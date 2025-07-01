const express = require('express');
const cors = require('cors'); // <== ADD THIS LINE
const { main } = require('./groq.js');

const app = express();
app.use(cors()); // <== ADD THIS LINE
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

app.listen(3001, () => console.log('Listening on http://localhost:3001'));
