
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/status', (req, res) => {

  // Return JSON response with status code 200 (OK)
  res.status(200).json({
    message: 'Server is up and running.',
  });
})

// Endpoint to test server uptime
app.get('/uptime', (req, res) => {
  // Get server uptime in milliseconds
  const uptime = process.uptime() * 1000; // Convert to milliseconds

  // Format uptime into human-readable format
  const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((uptime % (1000 * 60)) / 1000);

  // Prepare response JSON
  const uptimeInfo = {
    days,
    hours,
    minutes,
    seconds,
  };

  // Return JSON response with status code 200 (OK)
  res.status(200).json({
    uptime: uptimeInfo,
    message: 'Server uptime information retrieved successfully.',
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
