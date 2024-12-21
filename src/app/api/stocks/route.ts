import { verifyToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req:NextRequest){
    try{
        const { userId }:any = verifyToken(req);
        const stocks = await prisma.stock.findMany({
            where:{
                userId: userId
            }
        });
        return NextResponse.json({stocks},{status:200});
    }catch(error){
        return NextResponse.json({error:"Failed to fetch stocks"},{status:500});
    }
}
export async function POST(req:NextRequest){
    try{
        const { userId }:any = verifyToken(req);
        const { stockName, ticker, buyPrice } = await req.json();
        if (!stockName || !ticker || !buyPrice) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }
        const userExists = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
          });
      
          if (!userExists) {
            return NextResponse.json({ error: 'User not found' }, { status: 400 });
          }
        const newStock = await prisma.stock.create({
            data:{
                stockName,
                ticker,
                buyPrice,
                userId: userId,
            },
        });

        console.log(newStock);
        return NextResponse.json({newStock},{status:201});
    }catch(error){
        return NextResponse.json({error:"Failed to create stock"},{status:500});
    }
}