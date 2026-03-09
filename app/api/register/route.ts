// import { NextRequest, NextResponse } from 'next/server';

// interface RegisterData {
//   name: string;
//   email: string;
//   password: string;
//   birthMonth: number;
//   birthYear: number;
//   gender: string;
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body: RegisterData = await request.json();

//     // Validation
//     if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0 || body.name.length > 50) {
//       return NextResponse.json({ error: 'Please provide a valid name (max 50 characters)' }, { status: 400 });
//     }

//     if (!body.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(body.email)) {
//       return NextResponse.json({ error: 'Please provide a valid email' }, { status: 400 });
//     }

//     if (!body.password || body.password.length < 6) {
//       return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
//     }

//     if (!body.birthMonth || body.birthMonth < 1 || body.birthMonth > 12) {
//       return NextResponse.json({ error: 'Please provide a valid birth month (1-12)' }, { status: 400 });
//     }

//     if (!body.birthYear || body.birthYear < 1900 || body.birthYear > new Date().getFullYear()) {
//       return NextResponse.json({ error: 'Please provide a valid birth year' }, { status: 400 });
//     }

//     if (!body.gender || !['male', 'female', 'other', 'prefer-not-to-say'].includes(body.gender)) {
//       return NextResponse.json({ error: 'Please provide a valid gender' }, { status: 400 });
//     }

//     // Here you would save to database, but for now, just return success
//     return NextResponse.json({ success: true, message: 'User registered successfully' });
//   } catch (error) {
//     return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
//   }
// }