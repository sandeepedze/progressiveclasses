const { Batch, Course, User } = require('../models');

const createBatch = async (req, res) => {
    try {
        const { name, courseId, teacherId, startDate, endDate, capacity, timing, instituteId } = req.body;

        // Validation: No overlapping batch timing for same teacher (simplified for now)
        if (teacherId && timing) {
            const existingBatch = await Batch.findOne({
                where: { teacherId, timing, startDate }
            });
            if (existingBatch) {
                return res.status(400).json({ message: 'Teacher already has a batch at this time' });
            }
        }

        const batch = await Batch.create({
            name,
            courseId,
            teacherId,
            startDate,
            endDate,
            capacity,
            timing,
            instituteId
        });
        res.status(201).json(batch);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getBatches = async (req, res) => {
    try {
        const batches = await Batch.findAll({
            where: { instituteId: req.query.instituteId },
            include: [
                { model: Course },
                { model: User, as: 'teacher', attributes: ['name', 'email'] }
            ]
        });
        res.json(batches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    createBatch,
    getBatches,
};
