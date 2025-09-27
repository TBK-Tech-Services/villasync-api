import bcrypt from 'bcrypt';

// Helper to Hash Password
export async function hashPassword(password:string): Promise<string> {
    const saltRounds = 10;
    try {
        const hash = bcrypt.hash(password , saltRounds);
        return hash;
    } 
    catch (error) {
        console.log(`Error while Hashing Password : ${error}`);
        throw new Error(`Error While Hashing Password : ${error}`);
    }
}