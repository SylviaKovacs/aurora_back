import assert from 'node:assert/strict';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const jsonHeaders = { 'Content-Type': 'application/json' };

const uniqueId = Date.now();
const testUser = {
  name: `Test User ${uniqueId}`,
  email: `test${uniqueId}@example.com`,
  password: 'Test1234!@#',
  confirmPassword: 'Test1234!@#',
  newsletter: false
};

const testAppointment = {
  name: testUser.name,
  email: testUser.email,
  phone: '+36123456789',
  serviceKey: 'teszt_szolgaltatas',
  serviceLabel: 'Teszt szolgáltatás',
  durationMinutes: 45,
  date: '2026-02-01',
  time: '10:15',
  staffName: 'Teszt szakember'
};

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { res, data };
}

async function run() {
  console.log('API smoke test indul:', BASE_URL);

  // Register
  let r = await request('/api/auth/register', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(testUser)
  });
  assert.equal(r.res.status, 201, `Register status ${r.res.status}`);
  assert.ok(r.data?.user?.email === testUser.email, 'Register email mismatch');
  console.log('OK: register');

  // Login
  r = await request('/api/auth/login', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email: testUser.email, password: testUser.password })
  });
  assert.equal(r.res.status, 200, `Login status ${r.res.status}`);
  assert.ok(r.data?.token, 'Missing token');
  const token = r.data.token;
  console.log('OK: login');

  // Get me
  r = await request('/api/users/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(r.res.status, 200, `Me status ${r.res.status}`);
  assert.ok(r.data?.email === testUser.email, 'Me email mismatch');
  console.log('OK: /users/me');

  // Create appointment (public)
  r = await request('/api/appointments', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(testAppointment)
  });
  assert.equal(r.res.status, 201, `Create appointment status ${r.res.status}`);
  assert.ok(r.data?.id, 'Missing appointment id');
  console.log('OK: create appointment');

  // Get appointments list
  r = await request('/api/appointments');
  assert.equal(r.res.status, 200, `Appointments list status ${r.res.status}`);
  assert.ok(Array.isArray(r.data), 'Appointments list is not array');
  console.log('OK: appointments list');

  // Newsletter subscribe (accept 201 or 200)
  r = await request('/api/newsletter', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email: `newsletter${uniqueId}@example.com` })
  });
  assert.ok([200, 201].includes(r.res.status), `Newsletter status ${r.res.status}`);
  console.log('OK: newsletter subscribe');

  console.log('API smoke test: SIKER');
}

run().catch(err => {
  console.error('API smoke test: HIBA');
  console.error(err);
  process.exit(1);
});
