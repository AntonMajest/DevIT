const express = require('express');
const bodyParser = require('body-parser');
const rateLimitMiddleware = require("./middlewares/ratelimit");
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(rateLimitMiddleware);

app.post('/api', (req, res) => {
   const randomDelay = Math.floor(Math.random() * 1000);
    setTimeout(() => {
        res.json({ index: req.body.index });
    }, randomDelay);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
