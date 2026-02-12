const { SubscriptionPlan } = require('../models');
const { sequelize } = require('../config/db');

// GET /admin/subscription/list?edu_type_id=
const getAllPlans = async (req, res) => {
    try {
        const { edu_type_id } = req.query;
        let query = `
            SELECT 
                sp.id, 
                sp.plan_name, 
                sp.price, 
                sp.duration, 
                sp.features, 
                sp.status, 
                sp.created_at,
                sp.edu_type_id,
                et.type_name as edu_type_name
            FROM subscription_plans sp
            LEFT JOIN edu_type et ON sp.edu_type_id = et.id
        `;

        // Filter by edu_type_id if provided
        if (edu_type_id) {
            query += ` WHERE sp.edu_type_id = ${parseInt(edu_type_id)}`;
        }

        query += ` ORDER BY sp.created_at DESC`;

        // console.log('Final Query:', query);
        const [results, metadata] = await sequelize.query(query);
        // console.log(`Fetched ${results.length} plans for edu_type_id ${edu_type_id}`);
        res.json(results);
    } catch (err) {
        console.error('Get All Plans Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// POST /admin/subscription/create
const createPlan = async (req, res) => {
    try {
        const { plan_name, price, duration, features, status, edu_type_id } = req.body;

        if (!edu_type_id) {
            return res.status(400).json({ message: 'Education Type is required' });
        }
        if (price < 0) {
            return res.status(400).json({ message: 'Price must be greater than or equal to 0' });
        }

        const newPlan = await SubscriptionPlan.create({
            plan_name,
            price,
            duration,
            edu_type_id,
            features: typeof features === 'object' ? JSON.stringify(features) : features,
            status: status !== undefined ? status : 1 // Default Active (1)
        });

        res.status(201).json({ message: 'Plan created', plan: newPlan });
    } catch (err) {
        console.error('Create Plan Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// PUT /admin/subscription/update/:id
const updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { plan_name, price, duration, features, status } = req.body;
        // edu_type_id NOT changeable

        const plan = await SubscriptionPlan.findByPk(id);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        if (price !== undefined && price < 0) {
            return res.status(400).json({ message: 'Price must be >= 0' });
        }

        plan.plan_name = plan_name || plan.plan_name;
        plan.price = price !== undefined ? price : plan.price;
        plan.duration = duration !== undefined ? duration : plan.duration;
        if (features !== undefined) plan.features = typeof features === 'object' ? JSON.stringify(features) : features;
        plan.status = status !== undefined ? status : plan.status;

        await plan.save();
        res.json({ message: 'Plan updated', plan });
    } catch (err) {
        console.error('Update Plan Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE /admin/subscription/delete/:id
const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await SubscriptionPlan.findByPk(id);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        // HARD DELETE as per requirement
        await plan.destroy();

        res.json({ message: 'Plan permanently deleted' });
    } catch (err) {
        console.error('Delete Plan Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// PATCH /admin/subscription/status/:id
const togglePlanStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await SubscriptionPlan.findByPk(id);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        // Toggle 1 <-> 0
        plan.status = plan.status === 1 ? 0 : 1;
        await plan.save();
        res.json({ message: `Plan status changed to ${plan.status === 1 ? 'Active' : 'Inactive'}`, plan });
    } catch (err) {
        console.error('Toggle Status Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllPlans,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus
};
