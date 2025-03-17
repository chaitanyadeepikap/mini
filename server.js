import express from 'express';
import path from 'path';
import connectDB from './config/db.js';
import Feedback from './models/Feedback.js';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Donation from './routes/Donation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Corrected here

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
};

app.get('/', (req, res) => res.render('index'));
app.get('/awareness', (req, res) => res.render('awareness'));
app.get('/assistance', (req, res) => res.render('assistance'));
app.get('/bloodbanks.html', (req, res) => res.render('bloodbanks', { googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY }));
app.get('/hospitalfinder.html', (req, res) => res.render('hospitalfinder', { googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY }));
app.get('/ambulancefinder.html', (req, res) => res.render('ambulancefinder', { googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY }));
app.get('/pharmacies.html', (req, res) => res.render('pharmacies', { googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY }));
app.get('/donate',(req, res) => res.render('donate'));

app.use("/api",Donation);

app.post('/send-feedback', async (req, res) => {
    const { contactInfo, message } = req.body;

    if (!contactInfo || !message) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    try {
        const newFeedback = new Feedback({ contactInfo, message });
        await newFeedback.save();
        res.json({ success: true, message: 'Message received and stored successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

app.post('/ai-assistance', async (req, res) => {
    const { symptoms } = req.body;

    if (!symptoms) {
        return res.status(400).json({ error: 'Symptoms are required.' });
    }

    const prompt = `Analyze the given symptoms: ${symptoms}.  

    Provide a concise health assessment including:  
    1. Possible medical conditions (name, description, symptoms, causes, severity).  
    2. Recommended diagnostic tests.  
    3. Suggested treatments or remedies.  
    4. Precautions to take.  
    5. Lifestyle changes and dietary advice.  
    6. Warning signs that require immediate medical attention.`;  

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const botMessage = response.text();

        res.json({ message: botMessage });
    } catch (error) {
        console.error('Error communicating with Google Gemini AI:', error);
        res.status(500).json({ error: 'Failed to get a response from the AI model.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
