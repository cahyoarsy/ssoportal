// Example of how to migrate authStorage.js to real database
// This file shows the structure for backend integration

// Example using fetch API to backend endpoints
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Register new user - Backend implementation
export async function registerUser({ email, password, fullName, confirmPassword }) {
  // Client-side validation (same as localStorage version)
  if (!email || !password || !fullName || !confirmPassword) {
    throw new Error('Semua field wajib diisi');
  }

  if (password !== confirmPassword) {
    throw new Error('Password dan konfirmasi password tidak cocok');
  }

  if (password.length < 6) {
    throw new Error('Password minimal 6 karakter');
  }

  if (!email.includes('@')) {
    throw new Error('Format email tidak valid');
  }

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        password,
        fullName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return {
      id: data.user.id,
      email: data.user.email,
      fullName: data.user.fullName,
      role: data.user.role,
    };
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Network error: Unable to connect to server');
    }
    throw error;
  }
}

// Login user - Backend implementation
export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Email dan password wajib diisi');
  }

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store auth token from backend
    if (data.token) {
      localStorage.setItem('auth-token', data.token);
    }

    return {
      id: data.user.id,
      email: data.user.email,
      fullName: data.user.fullName,
      role: data.user.role,
    };
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Network error: Unable to connect to server');
    }
    throw error;
  }
}

// Check if email exists - Backend implementation
export async function emailExists(email) {
  try {
    const response = await fetch(`${API_BASE}/auth/check-email?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    
    return data.exists || false;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
}

// Get user by email - Backend implementation
export async function getUserByEmail(email) {
  try {
    const token = localStorage.getItem('auth-token');
    const response = await fetch(`${API_BASE}/users/by-email?email=${encodeURIComponent(email)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      id: data.user.id,
      email: data.user.email,
      fullName: data.user.fullName,
      role: data.user.role,
      createdAt: data.user.createdAt,
      lastLogin: data.user.lastLogin,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Get registered emails (for validation) - Backend implementation
export async function getRegisteredEmails() {
  try {
    const response = await fetch(`${API_BASE}/users/emails`);
    const data = await response.json();
    
    return data.emails || [];
  } catch (error) {
    console.error('Error fetching emails:', error);
    return [];
  }
}

// Admin functions - Backend implementation
export async function makeUserAdmin(email) {
  const token = localStorage.getItem('auth-token');
  
  try {
    const response = await fetch(`${API_BASE}/admin/make-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to make user admin');
    }

    return true;
  } catch (error) {
    console.error('Error making user admin:', error);
    throw error;
  }
}

/*
Backend Implementation Example (Express.js + Sequelize/Prisma):

// routes/auth.js
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }
    
    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      role: 'user',
    });
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: 'Email tidak terdaftar' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Password salah' });
    }
    
    // Update last login
    await user.update({ lastLogin: new Date() });
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Database Model (Sequelize example):
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lastLogin: {
    type: DataTypes.DATE,
  },
});
*/