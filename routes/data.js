const router = require('express').Router();

const { arrayParser, Stack } = require('../utils/dataUtils');

// route: POST /data
// desc: posting new array of requests
router.post('/', async (req, res) => {
    const { logs } = req.body;
    const parsedArray = arrayParser(logs);
    // parsing here
});
