document.getElementById('update-button').addEventListener('click', function() {
    const maxQuestionsInput = document.getElementById('max-questions');
    const maxQuestions = parseInt(maxQuestionsInput.value, 10);

    const showNosubsNovid = document.getElementById('show-nosubs-novid').checked;
    const showSubsNovid = document.getElementById('show-subs-novid').checked;
    const showNosubsVid10 = document.getElementById('show-nosubs-vid10').checked;
    const showSubsVid10 = document.getElementById('show-subs-vid10').checked;

    // Get the selected question type from the dropdown
    const questionTypeSelect = document.getElementById('question-type');
    const selectedType = questionTypeSelect.value;

    fetch('data/SFD.json')
        .then(response => response.json())
        .then(questions => {
            const filteredQuestions = (selectedType === 'All') ? questions : questions.filter(question => question.question_type === selectedType);
            const selectedQuestions = shuffleArray(filteredQuestions).slice(0, maxQuestions);
            displayQuestions(selectedQuestions, showNosubsNovid, showSubsNovid, showNosubsVid10, showSubsVid10);
        });
});

function displayQuestions(questions, showNosubsNovid, showSubsNovid, showNosubsVid10, showSubsVid10) {
    const container = document.getElementById('quiz-container');
    container.innerHTML = ''; // Clear previous content

    const fullDiv = document.createElement('div');
    let fullTable = '<table border="1"><tr>';

    // Build the table header based on user's selections
    fullTable += '<td></td>';
    fullTable += '<td>Correct answer</td‡>';
    if (showNosubsNovid) {
        fullTable += '<td>nosubs_novid_pred</td>';
    }
    if (showSubsNovid) {
        fullTable += '<td>subs_novid_pred</td>';
    }
    if (showNosubsVid10) {
        fullTable += '<td>nosubs_vid10_pred</td>';
    }
    if (showSubsVid10) {
        fullTable += '<td>subs_vid10_pred</td>';
    }
    fullTable += '</tr>';

    // Display questions, options, and predictions
    for (let index = 0; index < questions.length; index++) {
        const question = questions[index];
        fullTable += `<tr><th colspan=10>${question.question}</th></tr>`;
        for (let i = 0; question[`option_${i}`] !== undefined; i++) {
            fullTable += '<tr>';
            fullTable += `<td>${question[`option_${i}`]}</td>`;
            const colorClass = 'green';
            fullTable += (question.correct_answer === i) ? `<td class="green"></td>` : '<td></td>';
            if (showNosubsNovid) {
                const colorClass = getColorClass(question.nosubs_novid_acc);
                fullTable += (question.nosubs_novid_pred === i) ? `<td class="${colorClass}"></td>` : '<td></td>';
            }
            if (showSubsNovid) {
                const colorClass = getColorClass(question.subs_novid_acc);
                fullTable += (question.subs_novid_pred === i) ? `<td class="${colorClass}"></td>` : '<td></td>';
            }
            if (showNosubsVid10) {
                const colorClass = getColorClass(question.nosubs_vid10_acc);
                fullTable += (question.nosubs_vid10_pred === i) ? `<td class="${colorClass}"></td>` : '<td></td>';
            }
            if (showSubsVid10) {
                const colorClass = getColorClass(question.subs_vid10_acc);
                fullTable += (question.subs_vid10_pred === i) ? `<td class="${colorClass}"></td>` : '<td></td>';
            }
            fullTable += '</tr>';
        }
    }

    fullTable += '</table>';
    fullDiv.innerHTML = fullTable;
    container.appendChild(fullDiv);
}

function getColorClass(value) {
    // Define the logic to determine the color class based on the value
    if (value === true) {
        return 'green';
    } else if (value === false) {
        return 'red';
    } else {
        return ''; // Default class
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
