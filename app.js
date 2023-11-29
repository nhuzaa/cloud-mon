
const express = require('express');
const prometheus = require('prom-client');

const app = express();
const PORT = 3000;

// Initialize Prometheus metrics
const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 500],
});

// Example route with metrics instrumentation
app.get('/example', (req, res) => {
  const start = Date.now();
  // Your route logic here
  res.send('Example route');
  const end = Date.now();
  const elapsed = end - start;

  // Record metrics for the route
  httpRequestDurationMicroseconds
    .labels(req.method, req.route.path, res.statusCode)
    .observe(elapsed / 1000);
});

// Expose metrics for scraping by Prometheus
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await prometheus.register.metrics();
    res.set('Content-Type', prometheus.register.contentType);
    res.end(metrics);
  } catch (error) {
    res.status(500).send('Error generating metrics: ' + error.message);
  }
});


// Define a Prometheus Gauge metric to monitor the API status
const apiStatus = new prometheus.Gauge({
  name: 'api_status',
  help: 'Status of the API endpoint',
});

app.get('/status', (req, res) => {
  const status = {
    status: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    timestamp: new Date().toISOString()
  };

  // Set the Prometheus Gauge metric based on API status
  apiStatus.set(1); // Set to 1 to indicate the API is running successfully

  res.json(status);
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

