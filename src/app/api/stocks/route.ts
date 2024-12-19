import { PrismaClient } from "@prisma/client/extension";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(){
    try{
        const stocks = await prisma.stock.findMany();
        return NextResponse.json({stocks},{status:200});
    }catch(error){
        return NextResponse.json({error:"Failed to fetch stocks"},{status:500});
    }
}
export async function POST(req:NextRequest){
    try{
        const { stockName, ticker, buyPrice, userId } = await req.json();
        if (!stockName || !ticker || !buyPrice || !userId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }
        const newStock = await prisma.stock.create({
            data:{
                stockName,
                ticker,
                buyPrice,
                userId: parseInt(userId),
            },
        });
        return NextResponse.json({newStock},{status:201});
    }catch(error){
        return NextResponse.json({error:"Failed to create stock"},{status:500});
    }
}