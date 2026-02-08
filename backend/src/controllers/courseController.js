const { Course, Institute } = require('../models');

const createCourse = async (req, res) => {
    try {
        const { name, duration, feeStructure, totalFee, instituteId } = req.body;
        
        // Verify institute ownership
        const institute = await Institute.findByPk(instituteId);
        if (!institute || institute.adminId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized for this institute' });
        }

        const course = await Course.create({
            name,
            duration,
            feeStructure,
            totalFee,
            instituteId
        });
        res.status(201).json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            where: { instituteId: req.query.instituteId }
        });
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    createCourse,
    getCourses,
};
