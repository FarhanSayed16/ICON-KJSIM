import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Define minimal Schema to interact with it directly in the script
const RegistrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  college: String,
  department: String,
  events: [String],
  qrCode: String,
  checkedIn: { type: Boolean, default: false },
  checkedInAt: Date
}, { timestamps: true });

const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

const colleges = [
  'K J Somaiya Institute of Management',
  'K J Somaiya College of Engineering',
  'S. K. Somaiya College',
  'NMIMS Mumbai',
  'SPJIMR',
  'IIT Bombay',
  'VJTI Mumbai'
];

const names = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Siddharth', 'Rohan', 'Rahul', 'Aanya', 'Diya', 'Ananya', 'Priya', 'Kavya', 'Neha', 'Riya', 'Sneha'];
const lastNames = ['Patel', 'Sharma', 'Singh', 'Kumar', 'Deshmukh', 'Joshi', 'Kulkarni', 'Mehta', 'Shah', 'Nair'];
const allEvents = ['hackathon', 'datathon', 'bgmi-tournament', 'valorant-tournament', 'tech-debate', 'ui-ux-design'];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getMultipleRandom = (arr, num) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing in .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create 35 fake registrations
    const fakeRegs = [];
    for (let i = 0; i < 35; i++) {
      const name = `${getRandom(names)} ${getRandom(lastNames)}`;
      const email = `${name.replace(' ', '.').toLowerCase()}@example.com`;
      const numEvents = Math.floor(Math.random() * 3) + 1; // 1 to 3 events
      const events = getMultipleRandom(allEvents, numEvents);
      const isCheckedIn = Math.random() > 0.6; // 40% chance to be checked in

      fakeRegs.push({
        name,
        email,
        mobile: `98${Math.floor(Math.random() * 100000000)}`,
        college: getRandom(colleges),
        department: 'B.Tech CS',
        events,
        qrCode: `ICON2026-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        checkedIn: isCheckedIn,
        checkedInAt: isCheckedIn ? new Date(Date.now() - Math.random() * 10000000) : null
      });
    }

    await Registration.insertMany(fakeRegs);
    console.log(`Successfully seeded ${fakeRegs.length} registrations.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
