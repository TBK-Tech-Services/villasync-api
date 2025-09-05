import bcrypt from 'bcrypt';

export async function hashPassword(password:string): Promise<string> {
    const saltRounds = 10;
    try {
        const hash = bcrypt.hash(password , saltRounds);
        return hash;
    } 
    catch (err) {
        console.log(`Error while Hashing Password : ${err}`);
        throw err;
    }
}