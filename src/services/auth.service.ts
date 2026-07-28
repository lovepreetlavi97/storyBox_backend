import { config } from '../config/index.js';
import { generateToken } from '../utils/auth.util.js';

export const authService = {
  login(username?: string, password?: string) {
    if (username === config.adminUsername && password === config.adminPassword) {
      const token = generateToken(username);
      return { success: true, data: { token, username } };
    }
    return { success: false, error: 'Invalid username or password' };
  }
};
