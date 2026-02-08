const { Attendance, Student, Batch, User } = require('../models');

const markAttendance = async (req, res) => {
    try {
        const { batchId, date, attendanceData } = req.body; // attendanceData: [{ studentId, status }]

        // Rules: Editable within same day only (simplified check)
        const today = new Date().toISOString().split('T')[0];
        if (date !== today) {
            // return res.status(400).json({ message: 'Attendance can only be marked for today' });
        }

        const results = await Promise.all(attendanceData.map(async (record) => {
            const [attendance, created] = await Attendance.findOrCreate({
                where: { studentId: record.studentId, batchId, date },
                defaults: { status: record.status, markedBy: req.user.id }
            });

            if (!created) {
                await attendance.update({ status: record.status, markedBy: req.user.id });
            }
            return attendance;
        }));

        res.json({ message: 'Attendance updated successfully', results });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getBatchAttendance = async (req, res) => {
    try {
        const { batchId, date } = req.query;
        const attendance = await Attendance.findAll({
            where: { batchId, date },
            include: [{ model: Student, include: [User] }]
        });
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getStudentAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findAll({
            where: { studentId: req.params.studentId },
            include: [Batch]
        });
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    markAttendance,
    getBatchAttendance,
    getStudentAttendance
};
