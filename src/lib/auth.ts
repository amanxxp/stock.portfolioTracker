import jwt from "jsonwebtoken";
import { NextRequest} from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; 

export const verifyToken = (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // Returns payload like { userId: number }
  } catch (error) {
    throw new Error("Unauthorized");
  }
};