import { verifyToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient();
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try{
        const {userId}:any = verifyToken(req);
        const stock =await prisma.stock.findUnique({
            where:{
                id:parseInt(params.id),
                userId: userId
            },
        });
        if(!stock){
            return NextResponse.json({error:"stock not found"},{status:404})
        }
        return NextResponse.json({stock},{status:200});
    }catch(error){
        return NextResponse.json({error:"Failed to Fetch Stock"},{status:500});
    }
}
export async function PUT(req:NextRequest,{ params }: { params: { id: string } }){
    try{
        const { userId }:any = verifyToken(req);
        const { stockName, ticker, buyPrice,quantity } = await req.json();
        const updatedStock = await prisma.stock.update({
            where: {
                id:parseInt(params.id),
                userId:userId,
            },
            data: {
                stockName,
                ticker,
                quantity,
                buyPrice,
            }
        });
        return NextResponse.json({updatedStock},{status:200});
    }catch(error){
        return NextResponse.json({error:"Failed to Update stock"},{status:500});
    }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { userId }:any = verifyToken(req);
  
      const deletedStock = await prisma.stock.deleteMany({
        where: {
          id: parseInt(params.id),
          userId: userId, 
        },
      });
  
      if (deletedStock.count === 0) {
        return NextResponse.json({ error: "Stock not found or unauthorized" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Stock deleted successfully" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete stock" }, { status: 401 });
    }
  }