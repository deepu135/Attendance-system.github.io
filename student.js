document.getElementById('student-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const roll_number = document.getElementById('roll-no').value;
    const code = document.getElementById('attendance-code').value;

    try {
        const response = await fetch('/api/submit-attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, roll_number, code })
        });
        const data = await response.json();

        const statusMessage = document.getElementById('status-message');
        const subjectDisplay = document.getElementById('subject-display');
        const successMessage = document.getElementById('success-message');

        statusMessage.style.display = 'block';

        if (data.success) {
            subjectDisplay.textContent = `Subject: ${data.subject}`;
            successMessage.textContent = 'Your attendance has been successfully stored. ✅';
            successMessage.style.color = '#4CAF50'; // Green
        } else {
            subjectDisplay.textContent = '';
            successMessage.textContent = `Error: ${data.message}`;
            successMessage.style.color = '#f44336'; // Red
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});