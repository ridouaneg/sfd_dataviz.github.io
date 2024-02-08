// Update this function to fetch data from your server setup
async function fetchData(file) {
    const response = await fetch(`data/${file}`);
    const data = await response.json();

    // Fisher-Yates (Knuth) Shuffle
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]]; // Swap elements
    }

    return data;
}

async function updateTable() {
    const selectedDatasets = Array.from(document.querySelectorAll('input[name="dataset"]:checked')).map(el => el.value);
    const sampleSize = document.getElementById('sampleSize').value;
    const tableContainer = document.getElementById('tableContainer');
    
    // Clear existing table
    tableContainer.innerHTML = '';

    if (selectedDatasets.length === 0) {
        alert('Please select at least one dataset.');
        return;
    }

    // Create table
    const table = document.createElement('table');
    const thead = table.createTHead();
    const tbody = table.createTBody();
    const headerRow = thead.insertRow();

    // Add dataset names as headers
    selectedDatasets.forEach(dataset => {
        const th = document.createElement('th');
        th.textContent = dataset.replace('.json', ''); // Use dataset file name as column name
        headerRow.appendChild(th);
    });

    // Fetch and display data for each selected dataset
    const datasetPromises = selectedDatasets.map(dataset => fetchData(dataset));
    const datasets = await Promise.all(datasetPromises);

    // Assuming each dataset has the same number of samples
    for (let i = 0; i < sampleSize; i++) {
        const row = tbody.insertRow();
        row.className = "question";
        datasets.forEach((questions, index) => {
            const question = questions[i];
            const cell = row.insertCell();
            cell.innerHTML = `Question: ${question.question}`;
        });
        for (let j = 0; j < 5; j++) {
            const row = tbody.insertRow();
            row.className = "option";
            datasets.forEach((questions, index) => {
                const question = questions[i];
                const cell = row.insertCell();
                cell.className = (question.correct_answer === j) ? 'correct' : 'wrong';
                cell.innerHTML = `Option ${j}: ${question[`option_${j}`]}`;
            });
        }
    }

    tableContainer.appendChild(table);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initial table update can be placed here if needed
});
