import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const { user, token } = await AuthService.registerUser({ name, email, phone, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      token
    });
  } catch (err: any) {
    console.error("Register error:", err.message);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const { user, token } = await AuthService.loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      token
    });
  } catch (err: any) {
    console.error("Login error:", err.message);
    return res.status(400).json({ success: false, message: err.message || "Invalid credentials" });
  }
};

export const logout = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (err: any) {
    console.error("Logout error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
