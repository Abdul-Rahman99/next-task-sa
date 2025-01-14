import { NextApiRequest, NextApiResponse } from "next";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { User } from "@/types";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

interface DbCollection {
  find: (query: Record<string, unknown>) => DbCollection;
  value: () => unknown;
  push: (data: unknown) => DbCollection;
  write: () => void;
}

interface DbInstance {
  get: (collection: string) => DbCollection;
}

interface ExtendedRequest extends NextApiRequest {
  user?: {
    id: string;
    role: string;
  };
  app: {
    db: DbInstance;
  };
  url: string;
}

interface DbUser {
  id: string;
  email: string;
  password: string;
  role: string;
}

export default function authMiddleware(
  req: ExtendedRequest,
  res: NextApiResponse,
  next: () => void
) {
  const path = req.url;

  // Login route
  if (req.method === "POST" && path === "/auth/login") {
    const { email, password } = req.body;
    const db = req.app.db;
    const user = db.get("users").find({ email, password }).value() as
      | DbUser
      | undefined;

    if (user) {
      const access_token = sign({ id: user.id, role: user.role }, SECRET_KEY);
      const userData = { ...user, password: undefined };

      // Log the login attempt
      db.get("auth.login")
        .push({
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString(),
        })
        .write();

      res.json({
        data: {
          user: userData,
          access_token,
        },
        status: 200,
      });
      return;
    }

    res.status(401).json({
      message: "Invalid credentials",
      status: 401,
    });
    return;
  }

  // Register route
  if (req.method === "POST" && path === "/auth/register") {
    const { email, password, name } = req.body;
    const db = req.app.db;

    const existingUser = db.get("users").find({ email }).value() as
      | User
      | undefined;
    if (existingUser) {
      res.status(400).json({
        message: "User already exists",
        status: 400,
      });
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: "user" as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.get("users").push(newUser).write();
    const access_token = sign(
      { id: newUser.id, role: newUser.role },
      SECRET_KEY
    );

    res.json({
      data: {
        user: { ...newUser, password: undefined } as User,
        access_token,
      },
      status: 200,
    });
    return;
  }

  // Authenticate other routes
  if (req.headers.authorization) {
    const access_token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = verify(access_token, SECRET_KEY) as JwtPayload;
      req.user = { id: decoded.id as string, role: decoded.role as string };
      next();
    } catch {
      res.status(401).json({
        message: "Invalid access_token",
        status: 401,
      });
    }
  } else {
    next();
  }
}
