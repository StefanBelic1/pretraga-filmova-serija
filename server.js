const express = require('express');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

const WATCHMODE_API_KEY = 'NIe0LExqoB8o1OZ2gCxrBLElBLkQxn5fbcPWpPsG';
const WATCHMODE_API_HOST = 'api.watchmode.com';


app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "script-src 'self' 'unsafe-inline' http://localhost:3000;");
    next();
});

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pretr.html'));
});

// Endpoint za detalje i streaming informacije
app.post('/search', async (req, res) => {
    const { id } = req.body; // Ovo je Watchmode title_id
    console.log('Primljen Watchmode Title ID:', id);

    if (!id) {
        return res.status(400).json({ error: 'Watchmode Title ID je obavezan' });
    }

    try {
        const url = `https://api.watchmode.com/v1/title/${id}/details/?apiKey=${WATCHMODE_API_KEY}&append_to_response=sources`;
        const options = {
            method: 'GET',
        };

        const response = await fetch(url, options);
        console.log('HTTP Status:', response.status);
        const result = await response.json();
        console.log('Cijeli API odgovor:', JSON.stringify(result, null, 2));

        if (!result || !result.id) {
            return res.status(404).json({ error: 'Podaci nisu pronađeni', details: result.message || 'Nema detalja' });
        }

        res.json({
            title: result.title,
            type: result.type === 'movie' ? 'movie' : 'series', 
            streamingInfo: result.sources || [] 
        });

    } catch (error) {
        console.error('Greška:', error.message);
        res.status(500).json({ error: 'Došlo je do greške na serveru', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});