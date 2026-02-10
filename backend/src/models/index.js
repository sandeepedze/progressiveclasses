const Role = require('./Role');
const EduType = require('./EduType');
const OrganizationDetail = require('./OrganizationDetail');
const PasswordReset = require('./PasswordReset');
const User = require('./User');
const SubscriptionPlan = require('./SubscriptionPlan');

// Associations

// Role Associations
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// EduType Associations
EduType.hasMany(OrganizationDetail, { foreignKey: 'edu_type_id' });
OrganizationDetail.belongsTo(EduType, { foreignKey: 'edu_type_id' });

User.hasOne(OrganizationDetail, { foreignKey: 'user_id' });
OrganizationDetail.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    Role,
    EduType,
    OrganizationDetail,
    PasswordReset,
    User,
    SubscriptionPlan,
};
