import jwt from 'jsonwebtoken';
import type { JWT_Payload } from '../../types/auth/payload';

// Helper to Generate JWT Token
export async function generateJWT({firstName , lastName , email , role} : JWT_Payload) : Promise<string> {
    try {
        const payload : JWT_Payload = { firstName, lastName, email, role };

        const secret_key = process.env.SECRET_KEY;

        if(!secret_key){
            throw new Error("SECRET_KEY is not defined in environment variables");
        }

        const jwt_token = jwt.sign(payload , secret_key);

        return jwt_token;
    }
    catch (error) {
        console.log(`Error Generating JWT : ${error}`);
        throw new Error(`Error Generating JWT : ${error}`);    
    }
}