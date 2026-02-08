const { Institute } = require('../models');

const createInstitute = async (req, res) => {
    try {
        const { name, address, contact } = req.body;
        const institute = await Institute.create({
            name,
            address,
            contact,
            adminId: req.user.id
        });
        res.status(201).json(institute);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getInstitutes = async (req, res) => {
    try {
        const institutes = await Institute.findAll({
            where: { adminId: req.user.id }
        });
        res.json(institutes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateInstitute = async (req, res) => {
    try {
        const { name, address, contact } = req.body;
        let institute = await Institute.findByPk(req.params.id);

        if (!institute) {
            return res.status(404).json({ message: 'Institute not found' });
        }

        if (institute.adminId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        institute = await institute.update({ name, address, contact });
        res.json(institute);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    createInstitute,
    getInstitutes,
    updateInstitute,
};
