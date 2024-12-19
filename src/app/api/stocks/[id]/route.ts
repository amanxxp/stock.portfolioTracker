import { PrismaClient } from "@prisma/client/extension";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
interface params{
    id:string;
}
export async function GET(params:params){
    try{
        const stock =await prisma.stock.findUnique({
            where:{id:parseInt(params.id)},
        });
        if(!stock){
            return NextResponse.json({error:"stock not found"},{status:404})
        }
        return NextResponse.json({stock},{status:200});
    }catch(error){
        return NextResponse.json({error:"Failed to Fetch Stock"},{status:500});
    }
}
export async function PUT(req:NextRequest,params:params){
    try{
        const { stockName, ticker, buyPrice } = await req.json();
        const updatedStock = await prisma.stock.update({
            where: { id: parseInt(params.id) },
            data: {
                stockName,
                ticker,
                buyPrice,
            }
        });
        return NextResponse.json({updatedStock},{status:200});
    }catch(error){
        return NextResponse.json({error:"Failed to Update stock"},{status:500});
    }
}
export async function DELETE(params:params) {
    try{
        await prisma.stock.delete({
            where:{id:parseInt(params.id)}
        });
        return NextResponse.json({message:"Stock deleted successfully"},{status:204});
    }catch(error){
        return NextResponse.json({error:"Failed to Delete the stock"},{status:500});
    }
}