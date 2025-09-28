const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { Parser } = require('json2csv');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/attendance-system')
    .then(() => {
        console.log('MongoDB connected successfully.');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Database Schemas and Models
const AttendanceCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    class: { type: String, required: true },
    subject: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 180 } // Expires in 180 seconds (3 minutes)
});

const AttendanceRecordSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roll_number: { type: String, required: true },
    class: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const AttendanceCode = mongoose.model('AttendanceCode', AttendanceCodeSchema);
const AttendanceRecord = mongoose.model('AttendanceRecord', AttendanceRecordSchema);

// API Routes

// Generate Code API
app.post('/api/generate-code', async (req, res) => {
    const { class: class_name, subject } = req.body;
    if (!class_name || !subject) {
        return res.status(400).json({ success: false, message: 'Class and subject are required.' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const newCode = new AttendanceCode({ code, class: class_name, subject });
        await newCode.save();
        res.json({ success: true, code });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Could not generate code.' });
    }
});

// Submit Attendance API
app.post('/api/submit-attendance', async (req, res) => {
    const { name, roll_number, code } = req.body;
    if (!name || !roll_number || !code) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const activeCode = await AttendanceCode.findOne({ code });

        if (!activeCode) {
            return res.status(400).json({ success: false, message: 'Invalid or expired code.' });
        }
        
        // Prevent duplicate attendance for the same class/subject/date
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const existingRecord = await AttendanceRecord.findOne({
            roll_number,
            class: activeCode.class,
            subject: activeCode.subject,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (existingRecord) {
            return res.status(400).json({ success: false, message: 'Attendance already marked for today.' });
        }

        const newRecord = new AttendanceRecord({
            name,
            roll_number,
            class: activeCode.class,
            subject: activeCode.subject
        });
        await newRecord.save();
        
        res.json({ success: true, subject: activeCode.subject });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'An error occurred while submitting.' });
    }
});

// Download Attendance API
app.get('/api/download-attendance', async (req, res) => {
    const { class: class_name, subject, date } = req.query;

    if (!class_name || !subject || !date) {
        return res.status(400).send('Missing query parameters.');
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const attendanceData = await AttendanceRecord.find({
            class: class_name,
            subject: subject,
            date: { $gte: startOfDay, $lte: endOfDay }
        }).lean();

        if (attendanceData.length === 0) {
            return res.status(404).send('No attendance data found for this date.');
        }

        const fields = ['roll_number', 'name', 'date', 'class', 'subject'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(attendanceData);

        res.header('Content-Type', 'text/csv');
        res.attachment(`Attendance_${class_name}_${subject}_${date}.csv`);
        res.send(csv);

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to download data.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// A simple route to handle the root URL
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Attendance System API</h1>');
});