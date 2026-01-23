import bcrypt from 'bcrypt';
import sequelize from './src/config/db.js';
import './src/models/User.js';
import './src/models/Service.js';
import './src/models/Appointment.js';

async function seed() {
  try {
    console.log('Seed futtatasa...');

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Adatbazis ujrageneralva');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await sequelize.models.User.create({
      name: 'Aurora Admin',
      email: 'admin@aurora.hu',
      password: adminPassword,
      role: 'admin'
    });
    console.log('Admin user letrehozva');

    const services = await sequelize.models.Service.bulkCreate([
      { name: 'Noi hajvagas', price: 6500, duration: 45 },
      { name: 'Ferfi hajvagas', price: 4500, duration: 30 },
      { name: 'Hajfestes', price: 15000, duration: 90 },
      { name: 'Melir', price: 13000, duration: 120 },
      { name: 'Manikur', price: 8000, duration: 45 },
      { name: 'Gepi pedikur', price: 9000, duration: 60 }
    ]);
    console.log('Szolgaltatasok feltoltve');

    await sequelize.models.Appointment.bulkCreate([
      {
        name: admin.name,
        email: admin.email,
        phone: '0600000000',
        serviceKey: 'noi_hajvagas',
        serviceLabel: services[0].name,
        durationMinutes: services[0].duration,
        price: services[0].price,
        date: '2025-01-15',
        time: '10:00',
        staffName: 'Teszt Szakember',
        status: 'booked'
      },
      {
        name: admin.name,
        email: admin.email,
        phone: '0600000000',
        serviceKey: 'hajfestes',
        serviceLabel: services[2].name,
        durationMinutes: services[2].duration,
        price: services[2].price,
        date: '2025-01-16',
        time: '14:00',
        staffName: 'Teszt Szakember',
        status: 'completed'
      },
      {
        name: admin.name,
        email: admin.email,
        phone: '0600000000',
        serviceKey: 'manikur',
        serviceLabel: services[4].name,
        durationMinutes: services[4].duration,
        price: services[4].price,
        date: '2025-01-17',
        time: '09:30',
        staffName: 'Teszt Szakember',
        status: 'cancelled'
      }
    ]);
    console.log('Idopontok feltoltve');

    console.log('Seed kesz');
    process.exit(0);
  } catch (err) {
    console.error('Seed hiba:', err);
    process.exit(1);
  }
}

seed();
