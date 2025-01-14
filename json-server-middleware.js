const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

module.exports = (req, res, next) => {
  const dbPath = path.join(__dirname, "db.json");

  // Helper function to read/write db
  const readDb = () => JSON.parse(fs.readFileSync(dbPath, "utf8"));
  const writeDb = (data) =>
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  // Handle registration
  if (req.method === "POST" && req.path === "/auth/register") {
    try {
      const { email, password, name } = req.body;
      const db = readDb();

      // Check if user already exists
      const existingUser = db.users.find((user) => user.email === email);
      if (existingUser) {
        res.status(400).json({
          message: "User already exists",
          status: 400,
        });
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add user to the database
      db.users.push(newUser);

      // Add registration record
      const registrationRecord = {
        userId: newUser.id,
        email: newUser.email,
        timestamp: new Date().toISOString(),
      };
      if (!Array.isArray(db.auth.register)) {
        db.auth.register = [];
      }
      db.auth.register.push(registrationRecord);

      writeDb(db);

      // Send response without password
      const { password: _, ...userWithoutPassword } = newUser;
      res.json({
        data: {
          user: userWithoutPassword,
          access_token: "mock_access_token_" + Date.now(),
        },
        status: 200,
      });
      return;
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        message: "Internal server error",
        status: 500,
      });
      return;
    }
  }

  // Handle login
  if (req.method === "POST" && req.path === "/auth/login") {
    try {
      const { email, password } = req.body;
      const db = readDb();

      // Find user
      const user = db.users.find(
        (user) => user.email === email && user.password === password
      );

      if (!user) {
        res.status(401).json({
          message: "Invalid credentials",
          status: 401,
        });
        return;
      }

      // Add login record
      const loginRecord = {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      };
      if (!Array.isArray(db.auth.login)) {
        db.auth.login = [];
      }
      db.auth.login.push(loginRecord);

      writeDb(db);

      // Send response without password
      const { password: _, ...userWithoutPassword } = user;
      const access_token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        SECRET_KEY,
        { expiresIn: "24h" }
      );
      res.json({
        data: {
          user: userWithoutPassword,
          access_token: access_token,
        },
        status: 200,
      });
      return;
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Internal server error",
        status: 500,
      });
      return;
    }
  }

  // Handle forgot password
  if (req.method === "POST" && req.path === "/auth/forgot-password") {
    try {
      const { email } = req.body;
      const db = readDb();
      const user = db.users.find((u) => u.email === email);

      if (!user) {
        res.status(404).json({
          message: "User not found",
          status: 404,
        });
        return;
      }

      // Generate reset access_token (in production this would be sent via email)
      const resetaccess_token = jwt.sign({ userId: user.id }, SECRET_KEY, {
        expiresIn: "1h",
      });

      // Store reset access_token in db (in a real app, this would be hashed)
      if (!db.resetaccess_tokens) db.resetaccess_tokens = [];
      db.resetaccess_tokens.push({
        userId: user.id,
        access_token: resetaccess_token,
        expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
      });
      writeDb(db);

      res.json({
        message: "Password reset instructions sent to email",
        data: { resetaccess_token }, // In production, don't send this in response
        status: 200,
      });
      return;
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        message: "Internal server error",
        status: 500,
      });
      return;
    }
  }

  // Handle reset password
  if (req.method === "POST" && req.path === "/auth/reset-password") {
    try {
      const { access_token, newPassword } = req.body;
      const db = readDb();

      // Verify access_token
      const decoded = jwt.verify(access_token, SECRET_KEY);
      const user = db.users.find((u) => u.id === decoded.userId);

      if (!user) {
        res.status(404).json({
          message: "Invalid reset access_token",
          status: 404,
        });
        return;
      }

      // Update password
      user.password = newPassword;
      user.updatedAt = new Date().toISOString();
      writeDb(db);

      res.json({
        message: "Password reset successful",
        status: 200,
      });
      return;
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        message: "Invalid or expired reset access_token",
        status: 500,
      });
      return;
    }
  }

  // Handle get current user
  if (req.method === "GET" && req.path === "/auth/me") {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
          message: "Unauthorized",
          status: 401,
        });
        return;
      }

      const access_token = authHeader.split(" ")[1];
      const decoded = jwt.verify(access_token, SECRET_KEY);
      const db = readDb();
      const user = db.users.find((u) => u.id === decoded.id);

      if (!user || !user.isActive) {
        res.status(401).json({
          message: "User not found or inactive",
          status: 401,
        });
        return;
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({
        data: userWithoutPassword,
        status: 200,
      });
      return;
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(401).json({
        message: "Invalid access_token",
        status: 401,
      });
      return;
    }
  }

  next();
};
