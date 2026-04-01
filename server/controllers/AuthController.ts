import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// Controllers For User Registration
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    //encrpt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    //setting user data in session
    req.session.isLoggedIn = true;
    req.session.userId = newUser._id.toString();
    return res.json({
      message: "User registered successfully",
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//controllers for user login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const {email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password || "");
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    //setting user data in session
    req.session.isLoggedIn = true;
    req.session.userId = user._id.toString();
    return res.json({
      message: "User logged in successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//controllers for user logout
export const logoutUser = (req: Request, res: Response) => {
    req.session.destroy((error:any) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
        return res.json({ message: "User logged out successfully" });
    });
};

//controllers for user verify
export const verifyUser = async (req: Request, res: Response) => {
    try {
        const {userId} = req.session;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.json({ message: "User verified successfully", user });
    } catch (error:any) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}