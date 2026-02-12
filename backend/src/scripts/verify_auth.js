const BASE_URL = 'http://localhost:5000/api/auth';

const TEST_USER = {
    name: 'Test Verification User',
    email: `test_verify_${Date.now()}@example.com`,
    password: 'Password123!',
    phone: `99${Math.floor(Math.random() * 100000000)}`
};

async function verifyAuth() {
    console.log('--- Starting Authentication Verification ---');

    // 1. Register
    try {
        console.log(`\nAttempting Registration for ${TEST_USER.email}...`);
        const regRes = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });

        const regData = await regRes.json();

        if (!regRes.ok) {
            throw new Error(regData.message || 'Registration failed');
        }

        console.log('✅ Registration Successful!');

        if (regData.user && regData.user.id) {
            console.log(`   User ID: ${regData.user.id}`);
        } else {
            console.error('❌ User ID missing in response');
        }

    } catch (error) {
        console.error('❌ Registration Failed:', error.message);
        return; // Stop if registration fails
    }

    // 2. Login
    try {
        console.log(`\nAttempting Login for ${TEST_USER.email}...`);
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_USER.email,
                password: TEST_USER.password
            })
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
            throw new Error(loginData.message || 'Login failed');
        }

        console.log('✅ Login Successful!');

        if (loginData.token) {
            console.log('   Token received (length):', loginData.token.length);
        } else {
            console.error('❌ Token missing in response');
        }

        if (loginData.user && loginData.user.role_code) {
            console.log(`   Role: ${loginData.user.role_code}`);
        } else {
            console.log('   Note: Role code missing (might be intended if population failed)');
        }

    } catch (error) {
        console.error('❌ Login Failed:', error.message);
    }

    console.log('\n--- Verification Complete ---');
}

verifyAuth();
