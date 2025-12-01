const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve all files in the current directory (CSS, JS, HTML)
app.use(express.static(__dirname));

// Serve the TSLP Dashboard by default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'tslp_dashboard.html'));
});

// Start server
app.listen(port, () => {
    console.log(`LUMINA-REI App running at http://localhost:${port}`);
});
