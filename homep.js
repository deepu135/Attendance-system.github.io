document.addEventListener('DOMContentLoaded', function() {
    const teacherBtn = document.getElementById('teacher-btn');
    const studentBtn = document.getElementById('student-btn');

    // 'I am a Teacher' 
    teacherBtn.addEventListener('click', function() {
        window.location.href = 'teacher.html';
    });

    // 'I am a Student'
    studentBtn.addEventListener('click', function() {
        window.location.href = 'student.html';
    });
});