import { pushUserToCloud, fetchUsersFromCloud } from './supabaseClient';

export interface UserCredential {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'management' | 'kitchen';
  title: string;
  pin: string;
  department?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  isDefault?: boolean;
}

const USERS_STORAGE_KEY = 'royal_ember_user_credentials_v2';
const CURRENT_USER_KEY = 'royal_ember_current_auth_user_v2';

export const DEFAULT_USERS: UserCredential[] = [
  {
    id: 'user-admin-default',
    name: 'System Administrator',
    username: 'admin',
    password: 'admin123',
    role: 'management',
    title: 'General Manager',
    pin: '9901',
    department: 'Management',
    phone: '+91 98450 11000',
    email: 'admin@royalember.com',
    createdAt: new Date().toISOString(),
    isDefault: true,
  },
  {
    id: 'user-kitchen-default',
    name: 'Executive Head Chef',
    username: 'kitchen',
    password: 'kitchen123',
    role: 'kitchen',
    title: 'Kitchen Station Lead',
    pin: '1234',
    department: 'Kitchen Brigade',
    phone: '+91 98450 22000',
    email: 'kitchen@royalember.com',
    createdAt: new Date().toISOString(),
    isDefault: true,
  },
  {
    id: 'user-chef-vikram',
    name: 'Chef Vikram Sharma',
    username: 'chef_vikram',
    password: 'vikram123',
    role: 'kitchen',
    title: 'Executive Chef',
    pin: '1234',
    department: 'Kitchen Brigade',
    phone: '+91 98450 67890',
    email: 'vikram.chef@royalember.com',
    createdAt: new Date().toISOString(),
    isDefault: false,
  },
  {
    id: 'user-manager-indiranagar',
    name: 'Manager Indiranagar',
    username: 'manager_indiranagar',
    password: 'manager123',
    role: 'management',
    title: 'Store Operations Lead',
    pin: '9901',
    department: 'Management',
    phone: '+91 98450 12345',
    email: 'manager.indiranagar@royalember.com',
    createdAt: new Date().toISOString(),
    isDefault: false,
  },
];

export const authService = {
  getUsers(): UserCredential[] {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure default admin always exists
          const hasAdmin = parsed.some((u: UserCredential) => u.username.toLowerCase() === 'admin');
          if (!hasAdmin) {
            parsed.unshift(DEFAULT_USERS[0]);
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to read users from localStorage:', e);
    }

    // Initialize with defaults if empty
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  },

  saveUsers(users: UserCredential[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      // Notify other tabs
      window.dispatchEvent(new Event('auth_users_updated'));
    } catch (e) {
      console.error('Failed to save users:', e);
    }
  },

  createUser(userData: {
    name: string;
    username: string;
    password: string;
    role: 'management' | 'kitchen';
    title?: string;
    pin?: string;
    department?: string;
    phone?: string;
    email?: string;
  }): { success: boolean; user?: UserCredential; error?: string } {
    const trimmedUsername = userData.username.trim().toLowerCase();
    if (!trimmedUsername) {
      return { success: false, error: 'Username is required.' };
    }
    if (!userData.password || userData.password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }
    if (!userData.name.trim()) {
      return { success: false, error: 'Full name is required.' };
    }

    const users = this.getUsers();
    const existing = users.find(u => u.username.toLowerCase() === trimmedUsername);
    if (existing) {
      return { success: false, error: `Username "${userData.username}" is already taken.` };
    }

    const pin = (userData.pin && userData.pin.trim().length === 4) 
      ? userData.pin.trim() 
      : userData.role === 'kitchen' ? '1234' : '9901';

    const newUser: UserCredential = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: userData.name.trim(),
      username: trimmedUsername,
      password: userData.password,
      role: userData.role,
      title: userData.title?.trim() || (userData.role === 'kitchen' ? 'Kitchen Chef' : 'Operations Supervisor'),
      pin: pin,
      department: userData.department?.trim() || (userData.role === 'kitchen' ? 'Kitchen Brigade' : 'Management'),
      phone: userData.phone?.trim() || '+91 98450 00000',
      email: userData.email?.trim() || `${trimmedUsername}@royalember.com`,
      createdAt: new Date().toISOString(),
      isDefault: false,
    };

    users.push(newUser);
    this.saveUsers(users);

    // Asynchronously push to Supabase Cloud PostgreSQL
    pushUserToCloud(newUser).catch(err => console.warn('[Cloud Sync] User push bypassed, saved locally:', err));

    return { success: true, user: newUser };
  },

  updateUser(id: string, updates: Partial<UserCredential>): { success: boolean; user?: UserCredential; error?: string } {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
      return { success: false, error: 'User not found.' };
    }

    if (updates.username) {
      const trimmed = updates.username.trim().toLowerCase();
      const conflict = users.find(u => u.id !== id && u.username.toLowerCase() === trimmed);
      if (conflict) {
        return { success: false, error: `Username "${updates.username}" is already taken.` };
      }
      updates.username = trimmed;
    }

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    this.saveUsers(users);

    // If updating current user, refresh storage
    const current = this.getCurrentUser();
    if (current && current.id === id) {
      this.setCurrentUser(updatedUser);
    }

    return { success: true, user: updatedUser };
  },

  deleteUser(id: string): { success: boolean; error?: string } {
    const users = this.getUsers();
    const target = users.find(u => u.id === id);
    if (!target) {
      return { success: false, error: 'User not found.' };
    }
    if (target.isDefault || target.username.toLowerCase() === 'admin') {
      return { success: false, error: 'The default administrator account cannot be deleted.' };
    }

    const filtered = users.filter(u => u.id !== id);
    this.saveUsers(filtered);

    // If current logged in user was deleted, log out
    const current = this.getCurrentUser();
    if (current && current.id === id) {
      this.logout();
    }

    return { success: true };
  },

  authenticate(username: string, password: string): { success: boolean; user?: UserCredential; error?: string } {
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      return { success: false, error: 'Please enter both username and password.' };
    }

    const users = this.getUsers();
    const user = users.find(u => u.username.toLowerCase() === cleanUsername);

    if (!user) {
      return { success: false, error: 'Account does not exist. Please check your username.' };
    }

    if (user.password !== cleanPassword) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    // Set active session
    this.setCurrentUser(user);
    return { success: true, user };
  },

  authenticatePin(pin: string, preferredRole?: 'management' | 'kitchen'): { success: boolean; user?: UserCredential; error?: string } {
    const cleanPin = pin.trim();
    if (cleanPin.length !== 4) {
      return { success: false, error: 'PIN must be exactly 4 digits.' };
    }

    const users = this.getUsers();
    
    // 1. Try finding by preferred role + PIN
    let match = preferredRole ? users.find(u => u.role === preferredRole && u.pin === cleanPin) : undefined;

    // 2. Try finding by PIN across all users
    if (!match) {
      match = users.find(u => u.pin === cleanPin);
    }

    // 3. Fallback master PINs
    if (!match && (cleanPin === '9901' || cleanPin === '1234' || cleanPin === '0000')) {
      const fallbackRole = (cleanPin === '1234') ? 'kitchen' : 'management';
      match = users.find(u => u.role === fallbackRole) || DEFAULT_USERS.find(u => u.role === fallbackRole);
    }

    if (match) {
      this.setCurrentUser(match);
      return { success: true, user: match };
    }

    return { success: false, error: 'Invalid 4-digit PIN.' };
  },

  getCurrentUser(): UserCredential | null {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to get current user:', e);
    }
    return null;
  },

  setCurrentUser(user: UserCredential | null): void {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
      window.dispatchEvent(new Event('auth_user_changed'));
    } catch (e) {
      console.error('Failed to set current user:', e);
    }
  },

  logout(): void {
    this.setCurrentUser(null);
  },

  resetToDefaults(): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    this.logout();
    window.dispatchEvent(new Event('auth_users_updated'));
  },

  async syncWithCloud(): Promise<void> {
    try {
      const cloudUsers = await fetchUsersFromCloud();
      if (cloudUsers && cloudUsers.length > 0) {
        const localUsers = this.getUsers();
        let modified = false;

        for (const cu of cloudUsers) {
          const exists = localUsers.some(lu => lu.username.toLowerCase() === cu.username.toLowerCase());
          if (!exists) {
            localUsers.push({
              id: cu.id || `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              name: cu.full_name || cu.username,
              username: cu.username.toLowerCase(),
              password: cu.password_hash || 'admin123',
              role: cu.role === 'STORE_MANAGER' ? 'management' : 'kitchen',
              title: cu.role === 'STORE_MANAGER' ? 'General Manager' : 'Kitchen Station Lead',
              pin: cu.pin_code || (cu.role === 'STORE_MANAGER' ? '9901' : '1234'),
              department: cu.department || (cu.role === 'STORE_MANAGER' ? 'Management' : 'Kitchen Brigade'),
              phone: cu.phone,
              email: cu.email,
              createdAt: cu.created_at || new Date().toISOString(),
              isDefault: cu.username.toLowerCase() === 'admin',
            });
            modified = true;
          }
        }

        if (modified) {
          this.saveUsers(localUsers);
        }
      }
    } catch (err) {
      console.warn('[Cloud Sync] Failed to sync users from PostgreSQL cloud:', err);
    }
  }
};

