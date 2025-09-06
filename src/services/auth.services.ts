import prisma from "../db/DB.ts";
import { signupSchema, type SignupData } from "../validators/data-validators/auth/signup.ts";

export async function getUserService({ email } : {email : string}): Promise<SignupData | null> {
  try {
    const user = await prisma.user.findUnique({
      where : {
        email : email
      },
      select : {
        firstName : true,
        lastName : true,
        email : true,
        password : true,
        role : true
      }
    });

    if(!user){
      return null;
    }

    return signupSchema.parse(user);
  } 
  catch (error) {
    const message = error instanceof Error ? (error.message) : String(error);
    console.error(`Error while getting a User : ${message}`);
    throw new Error(`Error while getting a User : ${message}`);
  }
}

export async function signupUserService({firstName , lastName , email , password , role} : SignupData): Promise<SignupData | null> {
  try {
    const newUser = await prisma.user.create({
      data : {
        firstName : firstName,
        lastName : lastName,
        email : email,
        password : password,
        role : role
      },
      select : {
        firstName : true,
        lastName : true,
        email : true,
        password : true,
        role : true,
      }
    })

    if(!newUser){
      return null;
    }

    return signupSchema.parse(newUser);
  } 
  catch (error) {
    const message = error instanceof Error ? (error.message) : String(error);
    console.error(`Error while signing up : ${message}`);
    throw new Error(`Error while signing up : ${message}`);
  }
}
  
export async function logoutUserService(): Promise<void> {
    try {

    } 
    catch (error) {
      console.error(error);
    }
}
  
export async function forgotPasswordService(): Promise<void> {
    try {

    } 
    catch (error) {
      console.error(error);
    }
}
  
export async function changePasswordService(): Promise<void> {
    try {

    } 
    catch (error) {
      console.error(error);
    }
}