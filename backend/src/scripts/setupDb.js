const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs'); // Using bcryptjs as per package.json
const crypto = require('crypto');

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
};

const DB_NAME = process.env.DB_NAME;

if (!DB_NAME) {
    console.error('Error: DB_NAME is not defined in .env file');
    process.exit(1);
}

const setupDatabase = async () => {
    let connection;
    try {
        // 1. Connect to MySQL server
        connection = await mysql.createConnection(DB_CONFIG);
        console.log('Connected to MySQL server.');

        // 2. Create and Select Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`Database '${DB_NAME}' checked/created.`);

        await connection.query(`USE \`${DB_NAME}\`;`);
        console.log(`Selected database '${DB_NAME}'.`);

        // 3. Create 'roles' table
        const createRolesTable = `
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                role_name VARCHAR(50) NOT NULL,
                role_code VARCHAR(50) NOT NULL UNIQUE,
                is_system_role TINYINT(1) DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await connection.query(createRolesTable);
        console.log("Table 'roles' checked/created.");

        // Insert Default Roles
        const roleData = [
            { name: 'Super Admin', code: 'SUPER_ADMIN' },
            { name: 'School Admin', code: 'SCHOOL_ADMIN' },
            { name: 'Teacher', code: 'TEACHER' },
            { name: 'Admission Incharge', code: 'ADMISSION' },
            { name: 'Operator', code: 'OPERATOR' }
        ];

        for (const role of roleData) {
            await connection.query(
                `INSERT IGNORE INTO roles (role_name, role_code, is_system_role) VALUES (?, ?, 1)`,
                [role.name, role.code]
            );
        }
        console.log('System roles seeded.');

        // 4. Create 'edu_type' table
        const createEduTypeTable = `
            CREATE TABLE IF NOT EXISTS edu_type (
                id INT AUTO_INCREMENT PRIMARY KEY,
                type_name VARCHAR(50) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await connection.query(createEduTypeTable);
        console.log("Table 'edu_type' checked/created.");

        // Insert Edu Types
        const eduTypes = ['Schools', 'Institutes', 'Coaching', 'Tuition'];
        for (const type of eduTypes) {
            // Check if exists to avoid duplicates (since name isn't unique in schema, but we want idempotency)
            const [existing] = await connection.query('SELECT id FROM edu_type WHERE type_name = ?', [type]);
            if (existing.length === 0) {
                await connection.query('INSERT INTO edu_type (type_name) VALUES (?)', [type]);
            }
        }
        console.log('Education types seeded.');

        // 5. Create 'users' table
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(255) NULL,
                role_id INT NOT NULL,
                profile_pic VARCHAR(255) NULL,
                status ENUM('active', 'inactive', 'suspended', 'blocked') DEFAULT 'active',
                last_login DATETIME NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (role_id) REFERENCES roles(id)
            );
        `;
        await connection.query(createUsersTable);
        console.log("Table 'users' checked/created.");

        // 6. Create Super Admin User
        const SUPER_ADMIN_EMAIL = 'superadmin@edu.com';
        const [users] = await connection.query('SELECT id FROM users WHERE email = ?', [SUPER_ADMIN_EMAIL]);

        if (users.length === 0) {
            // Get Role ID for SUPER_ADMIN
            const [roles] = await connection.query('SELECT id FROM roles WHERE role_code = ?', ['SUPER_ADMIN']);

            if (roles.length > 0) {
                const roleId = roles[0].id;
                const hashedPassword = await bcrypt.hash('123', 10); // Default password
                
                await connection.query(
                    `INSERT INTO users (name, email, password, role_id, status) VALUES (?, ?, ?, ?, 'active')`,
                    ['Super Admin', SUPER_ADMIN_EMAIL, hashedPassword, roleId]
                );
                console.log(`Super Admin created successfully. Email: ${SUPER_ADMIN_EMAIL}`);
            } else {
                console.error("Error: 'SUPER_ADMIN' role not found. Cannot create Super Admin user.");
            }
        } else {
            console.log(`Super Admin user already exists: ${SUPER_ADMIN_EMAIL}`);
        }

        // 7. Create 'organization_details' table
        const createOrgDetailsTable = `
            CREATE TABLE IF NOT EXISTS organization_details (
                id INT AUTO_INCREMENT PRIMARY KEY,
                organization_name VARCHAR(255),
                contact VARCHAR(255),
                email VARCHAR(255),
                address TEXT,
                city VARCHAR(100),
                state VARCHAR(100),
                country VARCHAR(100),
                zip_code VARCHAR(20),
                user_id INT NOT NULL,
                edu_type_id INT,
                logo VARCHAR(255),
                subscription_id INT DEFAULT 5,
                status TINYINT(1) DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (edu_type_id) REFERENCES edu_type(id) ON DELETE SET NULL
            );
        `;
        await connection.query(createOrgDetailsTable);
        console.log("Table 'organization_details' checked/created.");

        // 8. Create 'password_resets' table
        const createPasswordResetTable = `
            CREATE TABLE IF NOT EXISTS password_resets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                contact VARCHAR(255) NOT NULL,
                otp VARCHAR(10) NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await connection.query(createPasswordResetTable);
        console.log("Table 'password_resets' checked/created.");

        console.log('Database setup completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Database setup failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
};

setupDatabase();

