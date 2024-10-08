const connection = require("../config/database");
const bcrypt = require("bcryptjs");

class UserModel {
  static async getAllUsers() {
    const query = "SELECT * FROM users";
    try {
      const [results] = await connection.execute(query);
      return results;
    } catch (error) {
      throw new Error("Database query error");
    }
  }

  static async getUserById(id) {
    const query = "SELECT * FROM users WHERE id = ?";
    try {
      const [results] = await connection.execute(query, [id]);
      return results[0];
    } catch (error) {
      throw new Error("Error fetching user by ID");
    }
  }

  static async getUserByUsername(username) {
    const query = `
      SELECT u.*, r.role 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE u.username = ?`;
    try {
      const [results] = await connection.execute(query, [username]);
      return results[0];
    } catch (error) {
      throw new Error("Error fetching user by username");
    }
  }

  static async addUser(username, password, email, roleId) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, password, email, role_id) VALUES (?, ?, ?, ?)`;
    try {
      const [results] = await connection.execute(query, [
        username,
        hashedPassword,
        email,
        roleId,
      ]);
      return results;
    } catch (error) {
      throw new Error("Error inserting user");
    }
  }

  static async updateUser(id, username, email, roleId) {
    const query = `UPDATE users SET username = ?, email = ?, role_id = ? WHERE id = ?`;
    try {
      const [results] = await connection.execute(query, [
        username,
        email,
        roleId,
        id,
      ]);
      return results;
    } catch (error) {
      throw new Error("Error updating user");
    }
  }

  static async deleteUser(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    try {
      const [results] = await connection.execute(query, [id]);
      return results;
    } catch (error) {
      throw new Error("Error deleting user");
    }
  }

  static async checkUserRole(userId, requiredRole) {
    const query =
      "SELECT r.role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?";
    try {
      const [results] = await connection.execute(query, [userId]);
      if (results.length > 0 && results[0].role_name === requiredRole) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error("Error checking user role");
    }
  }
}

module.exports = UserModel;
