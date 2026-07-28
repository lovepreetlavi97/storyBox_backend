import { config } from '../config/index.js';
import { AdminModel } from '../models/index.js';
import { generateToken, hashPassword, verifyPassword } from '../utils/auth.util.js';

export const authService = {
  async ensureDefaultAdmin() {
    try {
      const count = await AdminModel.countDocuments();
      if (count === 0) {
        const defaultAdmin = new AdminModel({
          username: 'xpernexadmin',
          email: 'xpernexadmin@gmail.com',
          passwordHash: hashPassword('xpernex2026')
        });
        await defaultAdmin.save();
        console.log('Default admin created: xpernexadmin@gmail.com / xpernex2026');
      }
    } catch (err) {
      console.error('Error ensuring default admin:', err);
    }
  },

  async login(usernameOrEmail?: string, password?: string) {
    if (!usernameOrEmail || !password) {
      return { success: false, error: 'Username/Email and password are required' };
    }

    const inputClean = usernameOrEmail.trim().toLowerCase();

    // 1. Search Admin in database by email or username
    const admin = await AdminModel.findOne({
      $or: [
        { email: inputClean },
        { username: inputClean }
      ]
    });

    if (admin) {
      const isValid = verifyPassword(password, admin.passwordHash);
      if (isValid) {
        const token = generateToken(admin.email);
        return { success: true, data: { token, username: admin.email } };
      }
    }

    // 2. Legacy config fallback (for backwards compatibility)
    if (
      (inputClean === config.adminUsername.toLowerCase() || inputClean === 'xpernexadmin@gmail.com') &&
      (password === config.adminPassword || password === 'xpernex2026')
    ) {
      const token = generateToken('xpernexadmin@gmail.com');
      return { success: true, data: { token, username: 'xpernexadmin@gmail.com' } };
    }

    return { success: false, error: 'Invalid username or password' };
  }
};
