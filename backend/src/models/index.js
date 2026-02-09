const Role = require('./Role');
const EduType = require('./EduType');
const OrganizationDetail = require('./OrganizationDetail');
const PasswordReset = require('./PasswordReset');
const User = require('./User');
// const Institute = require('./Institute');
// const Course = require('./Course');
// const Batch = require('./Batch');
// const Student = require('./Student');
// const Parent = require('./Parent');
// const Attendance = require('./Attendance');
// const Fee = require('./Fee');
// const Payment = require('./Payment');

// Associations

// Role Associations
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// EduType Associations
// EduType.hasMany(Institute, { foreignKey: 'edu_type_id' });
// Institute.belongsTo(EduType, { foreignKey: 'edu_type_id' });

EduType.hasMany(OrganizationDetail, { foreignKey: 'edu_type_id' });
OrganizationDetail.belongsTo(EduType, { foreignKey: 'edu_type_id' });

// User.hasOne(Institute, { foreignKey: 'admin_id' });
// Institute.belongsTo(User, { foreignKey: 'admin_id' });

User.hasOne(OrganizationDetail, { foreignKey: 'user_id' });
OrganizationDetail.belongsTo(User, { foreignKey: 'user_id' });

// Institute.hasMany(Course, { foreignKey: 'institute_id' });
// Course.belongsTo(Institute, { foreignKey: 'institute_id' });

// Course.hasMany(Batch, { foreignKey: 'course_id' });
// Batch.belongsTo(Course, { foreignKey: 'course_id' });

// Institute.hasMany(Batch, { foreignKey: 'institute_id' });
// Batch.belongsTo(Institute, { foreignKey: 'institute_id' });

// User.hasMany(Batch, { foreignKey: 'teacher_id' });
// Batch.belongsTo(User, { as: 'teacher', foreignKey: 'teacher_id' });

// User.hasOne(Student, { foreignKey: 'user_id' });
// Student.belongsTo(User, { foreignKey: 'user_id' });

// Parent.hasMany(Student, { foreignKey: 'parent_id' });
// Student.belongsTo(Parent, { foreignKey: 'parent_id' });

// User.hasOne(Parent, { foreignKey: 'user_id' });
// Parent.belongsTo(User, { foreignKey: 'user_id' });

// Institute.hasMany(Student, { foreignKey: 'institute_id' });
// Student.belongsTo(Institute, { foreignKey: 'institute_id' });

// Institute.hasMany(Parent, { foreignKey: 'institute_id' });
// Parent.belongsTo(Institute, { foreignKey: 'institute_id' });

// Student.hasMany(Attendance, { foreignKey: 'student_id' });
// Attendance.belongsTo(Student, { foreignKey: 'student_id' });

// Batch.hasMany(Attendance, { foreignKey: 'batch_id' });
// Attendance.belongsTo(Batch, { foreignKey: 'batch_id' });

// Student.hasMany(Fee, { foreignKey: 'student_id' });
// Fee.belongsTo(Student, { foreignKey: 'student_id' });

// Course.hasMany(Fee, { foreignKey: 'course_id' });
// Fee.belongsTo(Course, { foreignKey: 'course_id' });

// Fee.hasMany(Payment, { foreignKey: 'fee_id' });
// Payment.belongsTo(Fee, { foreignKey: 'fee_id' });

module.exports = {
    Role,
    EduType,
    OrganizationDetail,
    PasswordReset,
    User,
    // Institute,
    // Course,
    // Batch,
    // Student,
    // Parent,
    // Attendance,
    // Fee,
    // Payment,
};
