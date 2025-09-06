import bcrypt from 'bcrypt';

export async function comparePassword({password , hashedPassword} : {password: string ; hashedPassword: string}) : Promise<boolean> {
    try {
        const isPasswordSame = await bcrypt.compare(password , hashedPassword);
        return isPasswordSame;
    }
    catch (error) {
        console.log(`Error while Comparing Password : ${error}`);
        throw new Error(`Error While Comparing Password : ${error}`);
    }
}