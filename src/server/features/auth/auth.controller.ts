import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { clearAuthCookie, setAuthCookie } from "./auth.cookies";
import type { LoginInput } from "./auth.validation";

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body as LoginInput);
    setAuthCookie(res, result.token);
    res.status(200).json({
      message: "Logged in successfully",
      user: result.user,
    });
  }

  async logout(_req: Request, res: Response): Promise<void> {
    clearAuthCookie(res);
    res.status(200).json({ message: "Logged out successfully" });
  }

  async me(req: Request, res: Response): Promise<void> {
    const user = await authService.getMe(req.user!.sub);
    res.status(200).json({ user });
  }
}

export const authController = new AuthController();
