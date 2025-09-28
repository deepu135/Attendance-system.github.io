document.getElementById('generate-code-btn').addEventListener('click', async () => {
    const class_name = document.getElementById('class').value;
    const subject = document.getElementById('subject').value;

    if (!class_name || !subject) {
        alert('Please fill in Class and Subject.');
        return;
    }

    try {
        const response = await fetch('/api/generate-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ class: class_name, subject })
        });
        const data = await response.json();

        if (data.code) {
            document.getElementById('display-code').textContent = data.code;
            document.getElementById('code-section').style.display = 'block';
            startTimer();
        } else {
            alert('Failed to generate code.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

function startTimer() {
    let timeLeft = 180; // 3 minutes in seconds
    const timerElement = document.getElementById('timer');
    timerElement.textContent = '3:00';

    const timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {document.getElementById('generate-code-btn').addEventListener('click', async () => {
    const class_name = document.getElementById('class').value;
    const subject = document.getElementById('subject').value;

    if (!class_name || !subject) {
        alert('Please fill in both Class and Subject.');
        return;
    }

    try {
        const response = await fetch('/api/generate-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ class: class_name, subject })
        });
        const data = await response.json();

        if (data.code) {
            document.getElementById('display-code').textContent = data.code;
            document.getElementById('code-section').style.display = 'block';
            startTimer();
        } else {
            alert('Failed to generate code: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

document.getElementById('download-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const class_name = document.getElementById('download-class').value;
    const subject = document.getElementById('download-subject').value;
    const date = document.getElementById('download-date').value;

    if (!class_name || !subject || !date) {
        alert('Please fill in all download fields.');
        return;
    }

    try {
        const url = `/api/download-attendance?class=${class_name}&subject=${subject}&date=${date}`;
        window.location.href = url; // Trigger download
    } catch (error) {
        console.error('Error during download:', error);
        alert('Failed to download the file.');
    }
});

function startTimer() {
    let timeLeft = 180; // 3 minutes in seconds
    const timerElement = document.getElementById('timer');
    timerElement.textContent = '3:00';

    const timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = 'Expired!';
            // Backend should handle code expiration, but this is for UI
        }
    }, 1000);
}
            clearInterval(timerInterval);
            timerElement.textContent = 'Expired!';
            // You might want to disable the code on the backend here
        }
    }, 1000);
}