const express = require("express");
const router = express.Router();

router.post("/api/time/check", (req, res) =>{
    const { currentTime, m_id,  } = req.body ?? {}; 
});

module.exports = router;