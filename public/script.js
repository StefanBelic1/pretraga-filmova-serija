document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('idInput').value.trim();

    try {
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }) 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Došlo je do greške na serveru');
        }

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Došlo je do greške:', error);
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `<p>${error.message}</p>`;
    }
});

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (data.error) {
        resultsDiv.innerHTML = `<p>${data.error}</p>`;
        return;
    }

   
    const uniquePlatforms = [...new Set(data.streamingInfo.map(source => source.name))];

    resultsDiv.innerHTML = `
        <h2>${data.title} (${data.type === 'movie' ? 'Film' : 'Serija'})</h2>
        <h3>Dostupno na:</h3>
        <ul>
            ${uniquePlatforms.length > 0
                ? uniquePlatforms.map(p => `<li>${p}</li>`).join('')
                : '<li>Nije dostupno na streaming platformama</li>'}
        </ul>
    `;
}