import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { User } from '../../components/lib/db'; // Adjust the path as necessary

export async function POST(request: Request) {
  try {
    // Read the form data
    const formData = await request.formData();

    // Extract fields from the form data
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const passwordagain = formData.get('passwordagain') as string;

    // Basic validation
    if (!username || !email || !password || !passwordagain) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }
    
    if (password !== passwordagain) {
      return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ username, email, password_hash });
    return NextResponse.json({ message: 'User created', user }, { status: 201 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
