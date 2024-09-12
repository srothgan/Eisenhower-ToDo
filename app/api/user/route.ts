import { type NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '../../../libs/mongodb';
import User from "../../../models/user"
import bcrypt from 'bcryptjs';  // For hashing passwords

export async function POST(req: NextRequest, res: NextResponse) {
  await connectMongoDB();
    const { name, email, password, role, organization } = await req.json();
    const resetpassword =""
    // Validate required fields
    if (!name || !email || !password || !role || !organization) {
      return NextResponse.json({ message: 'All fields are required' },
        { status: 400 }
      );
    }

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: 'User already exist' },
            { status: 400 }
          );
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        organization,
        resetpassword
      });

      // Save the user to the database
      await newUser.save();

      return NextResponse.json({ message: "User registered." }, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "An error occurred while registering the user." },
        { status: 500 }
      );
    }
  
}
