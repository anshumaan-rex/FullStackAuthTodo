import Token from "../models/token.js";
import User from "../models/user.js";
import sendEmail from "../utils/sendEmail.js";
import {
  resetPasswordSchema,
  validateUserLoginSchema,
  validateUserSignupSchema,
} from "../validations/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const validate = validateUserSignupSchema.safeParse(req.body);
    if (!validate.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: validate.error.issues.map((issue) => ({
          path: issue.path[0],
          error: issue.message,
        })),
      });
    }
    const { name, email, password } = validate.data;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "user already exists with this email",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      isVerified: false,
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await Token.create({ user: newUser._id, token, expiresAt });

    const verifyURL = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    try {
      await sendEmail({
        to: email,
        subject: "Verify your account",
        text: `Click to verify: ${verifyURL}`,
        html: `<p>Click <a href="${verifyURL}">here</a> to verify your account.</p>`,
      });
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr.message);

      await Token.deleteMany({ user: newUser._id }).catch(() => {});
      await User.findByIdAndDelete(newUser._id).catch(() => {});
      return res.status(500).json({
        success: false,
        message:
          "Failed to send verification email. Please try signing up again later.",
      });
    }

    const { password: _, ...safeUser } = newUser.toObject();
    return res.status(201).json({
      success: true,
      message: "Signup successfull. Verification email has been sent",
      user: safeUser,
    });
  } catch (err) {
    console.error("Error in signup:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const verify = async (req, res) => {
  try {
    const token = req.query?.token;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "token not found" });
    }
    const dbToken = await Token.findOne({ token });
    if (!dbToken) {
      return res
        .status(400)
        .json({ success: false, message: "invalid or missing token!" });
    }
    if (dbToken.expiresAt < Date.now()) {
      await Token.deleteOne({ _id: dbToken._id });
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    const user = await User.findById(dbToken.user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }

    user.isVerified = true;
    await user.save();

    await Token.deleteOne({ _id: dbToken._id });
    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const validate = validateUserLoginSchema.safeParse(req.body);
    if (!validate.success) {
      return res.status(400).json({
        success: false,
        errors: validate.error.issues.map((issue) => ({
          path: issue.path[0],
          message: issue.message,
        })),
      });
    }

    const { email, password } = validate.data;
    const user = await User.findOne({ email }).select("+password");
    const isMatched = await bcrypt.compare(password, user?.password);

    if (!user || !isMatched) {
      return res.status(404).json({
        success: false,
        message: "Invalid login credentials",
      });
    }
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Please verify your email first" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user.toObject();

    return res.status(200).json({ success: true, message: "Logged in successfully", safeUser });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Error in loggin out", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  const email = req.body?.email;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email id is required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found with this email",
      });
    }
    await Token.deleteMany({ user: user._id });
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await Token.create({ user: user._id, expiresAt, token });

    const resetPasswordURL = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    try {
      await sendEmail({
        to: email,
        subject: "Password reset verification link for your Todo",
        text: "Click on the link for password rest",
        html: `This is the password reset link requested for resetting your Todo account password. <b><a href=${resetPasswordURL}>Verify here </a></b>`,
      });
    } catch (emailErr) {
      console.error(
        "Failed too send the rest password email verification link",
        emailErr.message
      );

      await Token.deleteMany({ user: user._id });
      return res.status(500).json({
        success: false,
        message:
          "Failed too send the rest password email verification link. Please try again later.",
      });
    }
    return res.status(200).json({
    success: true,
    message: "Password reset link sent to your email"
});

  } catch (err) {
    console.error("Error in forgot password verification:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const resetPassword = async (req,res) => {
  const token = req.query?.token;
  if(!token){
    return res.status(404).json({
      success: false,
      message: "Token missing in url"
    });
  }

  try{
    const dbToken = await Token.findOne({ token });
    if(!dbToken){
      return res.status(404).json({
        success: false,
        message: "Token not found"
      });
    }

    if (dbToken.expiresAt < Date.now()) {
      await Token.deleteOne({ _id: dbToken._id });
      return res.status(400).json({
        success: false,
        message: "Token has expired. Please request a new reset link"
      });
    }

    const user = await User.findById(dbToken.user);
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const validate = resetPasswordSchema.safeParse(req.body);
    if(!validate.success){
      return res.status(400).json({
        success: false,
        errors: validate.error.issues.map((issue) => ({
          path: issue.path[0],
          error: issue.message
        }))
      });
    }

    const { password } = validate.data;
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await Token.deleteOne({ _id: dbToken._id });

    return res.status(200).json({
      success: true,
      message: "Password has been updated"
    });

  }catch(err){
    console.error("Error in updating password", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}