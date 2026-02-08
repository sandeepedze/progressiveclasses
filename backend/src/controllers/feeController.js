const { Fee, Payment, Student, User, Course } = require('../models');

const recordPayment = async (req, res) => {
    try {
        const { feeId, amount, paymentMode, transactionId } = req.body;

        const fee = await Fee.findByPk(feeId);
        if (!fee) return res.status(404).json({ message: 'Fee record not found' });

        // Create Payment record
        const payment = await Payment.create({
            feeId,
            amount,
            paymentMode,
            transactionId,
            collectedBy: req.user.id,
            receiptNumber: `REC-${Date.now()}`
        });

        // Update Fee status
        const newPaidAmount = parseFloat(fee.paidAmount) + parseFloat(amount);
        let status = 'partial';
        if (newPaidAmount >= fee.totalAmount - fee.discount) {
            status = 'paid';
        }

        await fee.update({ paidAmount: newPaidAmount, status });

        // Real-time notification (optional)
        const io = req.app.get('socketio');
        io.emit('feeReceived', { studentId: fee.studentId, amount });

        res.status(201).json({ message: 'Payment recorded successfully', payment, fee });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getStudentFees = async (req, res) => {
    try {
        const fees = await Fee.findAll({
            where: { studentId: req.params.studentId },
            include: [Course, { model: Payment }]
        });
        res.json(fees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getPendingFees = async (req, res) => {
    try {
        const fees = await Fee.findAll({
            where: { status: ['unpaid', 'partial'] },
            include: [{ model: Student, include: [User] }, Course]
        });
        res.json(fees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    recordPayment,
    getStudentFees,
    getPendingFees
};
