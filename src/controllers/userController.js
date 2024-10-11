const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendMail = require("../services/mailService");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UserController {
  async index(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      //   res.status(200).send(users);
      res.status(200).render("users.ejs", { users: users });
      // res.status(200).send(users);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Database error");
    }
  }

  async getRegisterPage(req, res) {
    try {
      res.render("createUser.ejs");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Database error");
    }
  }

  async register(req, res) {
    try {
      let { username, password, email, roleId } = req.body;

      roleId = roleId ?? 2; //2: user role

      await UserModel.addUser(username, password, email, roleId);

      const emailContent = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h1 style="color: #4CAF50;">Chào mừng, ${username}!</h1>
          <p>Cảm ơn bạn đã đăng ký tài khoản trên website của chúng tôi.</p>
          <p><strong>Email đăng ký:</strong> ${email}</p>
          <p>Chúc bạn học tập thật tốt và tận dụng mọi tính năng mà chúng tôi cung cấp để việc học tiếng Nhật của bạn trở nên thú vị hơn!</p>
          <hr style="border: none; border-top: 1px solid #eee;">
          <p style="font-size: 0.9em;">Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi qua email này để được hỗ trợ.</p>
          <p style="font-size: 0.9em;">Trân trọng,<br/>Đội ngũ hỗ trợ</p>
        </div>
      `;

      await sendMail(
        email,
        "Chào mừng bạn đến với website của chúng tôi",
        emailContent
      );

      res.status(201).send({
        message: "Email sent successfully",
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: "Error sending email !" });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const { username, email, roleId } = req.body;
      const user = await UserModel.getUserById(id);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      await UserModel.updateUser(id, username, email, roleId);
      res.status(200).send({ message: "User updated successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: "Error updating user" });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const user = await UserModel.getUserById(id);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      await UserModel.deleteUser(id);
      res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: "Error deleting user" });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await UserModel.getUserByUsername(username);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res
          .status(401)
          .send({ message: "Invalid username or password" });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).send({ message: "Login successful", token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: "Error during login" });
    }
  }
}

module.exports = new UserController();
