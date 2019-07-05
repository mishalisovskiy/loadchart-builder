const Express = require('express');
const bodyParser = require('body-parser');

const data = require('./routes/data');

const app = Express();

app.use(bodyParser.json());

app.use('/data', data);

const port = process.env.PORT || 6000;

app.listen(port, () => console.log(`Server running on port ${port}`));
