const Request = require('../models/request');
const Donation = require('../models/donation');

const router = require("express").Router();

router.post('/donations', async (req, res) => {
    try {
        const donation = new Donation(req.body);
        await donation.save();
        res.status(201).json({ message: 'Donation saved successfully' });
    } catch (error) {
        console.error('Error saving donation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Request Route
router.post('/requests', async (req, res) => {
    try {
        const request = new Request(req.body);
        await request.save();
        res.status(201).json({ message: 'Request saved successfully' });
    } catch (error) {
        console.error('Error saving request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;