import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
export async function POST(req:NextRequest){
    try{
        const {email,password} = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h",
          });
      
          return NextResponse.json({ message: "Login successful", token,user}, { status: 200 });
      
    }catch(error){
        return NextResponse.json({error:"Failed to login"},{status:500});
    }
}