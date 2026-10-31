import 'dotenv/config';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { sequelize } from '../config/database.js';

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log('--- KET NOI DATABASE THANH CONG ---');

    const adminEmail = (process.env.ADMIN_SEED_EMAIL || 'admin.lab@example.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'Admin@Secure2026!';
    const adminFullName = 'Administrator Lab 07';

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log(`[INFO] Tai khoan admin (${adminEmail}) da ton tai voi role: ${existingAdmin.role}`);
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log(`[UPDATE] Da cap nhat role thanh 'admin' cho ${adminEmail}`);
      }
    } else {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      const newAdmin = await User.create({
        fullName: adminFullName,
        email: adminEmail,
        passwordHash,
        role: 'admin',
      });
      console.log(`[SUCCESS] Da seed tai khoan admin thanh cong!`);
      console.log(`- ID: ${newAdmin.id}`);
      console.log(`- Email: ${newAdmin.email}`);
      console.log(`- Role: ${newAdmin.role}`);
      console.log(`- Password: [PROTECTED / BCRYPT COST 12]`);
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Seed admin that bai:', error);
    process.exit(1);
  }
}

seedAdmin();
