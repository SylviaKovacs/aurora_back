import sequelize from './src/config/db.js';
import './src/models/User.js';
import './src/models/Service.js';
import './src/models/Product.js';
import './src/models/Appointment.js';
import './src/models/Order.js';
import './src/models/OrderItem.js';

async function seed() {
  try {
    console.log("🌱 Seed futtatása...");

    // Idegen kulcsok kikapcsolása
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Táblák újragenerálása
    await sequelize.sync({ force: true });

    // Idegen kulcsok visszakapcsolása
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log("✅ Adatbázis újragenerálva");

    // Admin user
    const admin = await sequelize.models.User.create({
      name: "Aurora Admin",
      email: "admin@aurora.hu",
      password: "admin123",
      role: "admin"
    });
    console.log("✅ Admin user létrehozva");

    // Szolgáltatások
    const services = await sequelize.models.Service.bulkCreate([
      { name: "Női hajvágás", price: 6500 },
      { name: "Férfi hajvágás", price: 4500 },
      { name: "Hajfestés", price: 15000 },
      { name: "Melír", price: 13000 },
      { name: "Manikűr", price: 8000 },
      { name: "Gépi pedikűr", price: 9000 }
    ]);
    console.log("✅ Szolgáltatások feltöltve");

    // Termékek
    const products = await sequelize.models.Product.bulkCreate([
      { name: "Professzionális sampon", price: 3200, stock: 30 },
      { name: "Hajbalzsam", price: 3500, stock: 25 },
      { name: "Hajvégápoló olaj", price: 4800, stock: 15 },
      { name: "Körömlakk - piros", price: 1800, stock: 50 }
    ]);
    console.log("✅ Termékek feltöltve");

    // ✅ IDŐPONTOK
    await sequelize.models.Appointment.bulkCreate([
      {
        userId: admin.id,
        serviceId: services[0].id,
        date: "2025-01-15",
        appointment_time: "2025-01-15 10:00:00",
        status: "booked"
      },
      {
        userId: admin.id,
        serviceId: services[2].id,
        date: "2025-01-16",
        appointment_time: "2025-01-16 14:00:00",
        status: "completed"
      },
      {
        userId: admin.id,
        serviceId: services[4].id,
        date: "2025-01-17",
        appointment_time: "2025-01-17 09:30:00",
        status: "cancelled"
      }
    ]);
    console.log("✅ Időpontok feltöltve");

    // ✅ RENDELÉSEK
    const order1 = await sequelize.models.Order.create({
      userId: admin.id,
      productId: products[0].id,   // modelled miatt kell
      quantity: 1,
      totalPrice: 2 * products[0].price + products[1].price,
      status: "paid"
    });

    // ✅ RENDELÉS TÉTELEK
    await sequelize.models.OrderItem.bulkCreate([
      {
        orderId: order1.id,
        productId: products[0].id,
        quantity: 2,
        price: products[0].price
      },
      {
        orderId: order1.id,
        productId: products[1].id,
        quantity: 1,
        price: products[1].price
      }
    ]);

    console.log("✅ Rendelések és tételek feltöltve");

    console.log("🌱 Seed teljesen kész!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Seed hiba:", err);
    process.exit(1);
  }
}

seed();
