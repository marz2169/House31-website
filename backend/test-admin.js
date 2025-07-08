const express = require('express');
const app = express();

const adminRoutes = require('./routes/admin');

app.use('/admin', adminRoutes);

app.get('/test', (req, res) => {
  res.json({ message: 'Test route works' });
});

app.listen(5001, () => {
  console.log('Test server running on port 5001');
});
