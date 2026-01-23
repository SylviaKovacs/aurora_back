import sequelize from '../src/config/db.js';
import '../src/models/Appointment.js';

const services = [
  { key: 'noi_vagas', label: 'Női hajvágás', duration: 45, price: 8500 },
  { key: 'ferfi_vagas', label: 'Férfi hajvágás', duration: 30, price: 5500 },
  { key: 'arctisztitas', label: 'Arctisztítás', duration: 60, price: 12000 },
  { key: 'gel_lakk', label: 'Gél lakkozás', duration: 45, price: 6500 },
  { key: 'masszazs_60', label: 'Masszázs – 60 perc', duration: 60, price: 10000 }
];

const times = ['10:00', '11:00', '12:00', '13:00', '14:00'];

const toDateStr = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

async function run() {
  try {
    const Appointment = sequelize.models.Appointment;
    if (!Appointment) {
      throw new Error('Appointment model not found');
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const appointments = services.map((s, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + (i + 1));
      return {
        name: 'Teszt Vendég',
        email: 'teszt.vendeg@example.com',
        phone: '06301234567',
        serviceKey: s.key,
        serviceLabel: s.label,
        durationMinutes: s.duration,
        price: s.price,
        date: toDateStr(d),
        time: times[i],
        staffName: 'Teszt szakember',
        status: 'confirmed',
        staffId: null,
        userId: null
      };
    });

    await Appointment.bulkCreate(appointments);
    console.log('5 teszt foglalás létrehozva.');
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('Hiba a teszt foglalások létrehozásakor:', err);
    try { await sequelize.close(); } catch {}
    process.exit(1);
  }
}

run();
