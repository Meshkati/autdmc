const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({b: 13})
});
module.exports = router;
