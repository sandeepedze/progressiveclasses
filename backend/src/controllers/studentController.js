const { Student, User, Batch, Course, Fee } = require('../models');
const bcrypt = require('bcryptjs');

// Register a new student
const registerStudent = async (req, res) => {
    try {
        const { name, email, password, dob, gender, address, phone, instituteId, courseId, batchId } = req.body;

        // Check if user exists
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User account for student
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'student',
            phone
        });

        // Create Student Profile
        const student = await Student.create({
            userId: user.id,
            dob,
            gender,
            address,
            instituteId,
            admissionStatus: 'confirmed'
        });

        // Allocate Batch
        if (batchId) {
            const batch = await Batch.findByPk(batchId);
            if (batch) {
                // In a real app, you'd use a many-to-many table for StudentBatches
                // For simplicity in this manual flow, we'll assume the student is linked to the batch
                // If the model supports student-batch relationship, we add it here.
                // For now, let's assume we need to track this. 
                // Since our models/index.js had Student-Batch association:
                // Student.hasMany(Attendance, { foreignKey: 'studentId' });
                // We might need a StudentBatch junction table if a student can be in multiple batches.
            }
        }

        // Generate initial Fee record if courseId is provided
        if (courseId) {
            const course = await Course.findByPk(courseId);
            if (course) {
                await Fee.create({
                    studentId: student.id,
                    courseId,
                    totalAmount: course.totalFee,
                    paidAmount: 0,
                    status: 'unpaid',
                    dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) // Default 1 month due
                });
            }
        }

        res.status(201).json({
            message: 'Student registered successfully',
            student,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getStudentsByInstitute = async (req, res) => {
    try {
        const students = await Student.findAll({
            where: { instituteId: req.params.instituteId },
            include: [{ model: User, attributes: ['name', 'email', 'phone'] }]
        });
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getStudentDetails = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['name', 'email', 'phone'] },
                { model: Fee, include: [Course] }
            ]
        });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    registerStudent,
    getStudentsByInstitute,
    getStudentDetails
};
