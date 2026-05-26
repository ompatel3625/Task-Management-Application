require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔄 Connecting to MySQL...');
    
    // Connect to MySQL (without database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL');

    // Create database
    console.log('🔄 Creating database...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'tasksphere'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('✅ Database created/verified');

    // Use database
    await connection.query(`USE ${process.env.DB_NAME || 'tasksphere'}`);

    // Create users table
    console.log('🔄 Creating users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        avatar VARCHAR(255) DEFAULT NULL,
        isActive TINYINT(1) DEFAULT 1,
        resetPasswordToken VARCHAR(255) DEFAULT NULL,
        resetPasswordExpires DATETIME DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Users table created');

    // Create tasks table
    console.log('🔄 Creating tasks table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT DEFAULT NULL,
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
        dueDate DATE DEFAULT NULL,
        userId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_userId (userId),
        INDEX idx_status (status),
        INDEX idx_priority (priority),
        INDEX idx_dueDate (dueDate)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tasks table created');

    // Check if admin exists
    const [existingAdmin] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      ['admin@tasksphere.com']
    );

    if (existingAdmin.length === 0) {
      // Create admin user
      console.log('🔄 Creating admin user...');
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@tasksphere.com', hashedPassword, 'admin']
      );
      
      console.log('✅ Admin user created');
      console.log('📧 Email: admin@tasksphere.com');
      console.log('🔑 Password: Admin@123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Test the connection with query
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`\n✅ Database setup complete! Total users: ${rows[0].count}`);
    
    console.log('\n🎉 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Make sure MySQL is running');
    console.error('2. Check your .env file credentials');
    console.error('3. Ensure DB_PASSWORD is correct');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup
setupDatabase();
