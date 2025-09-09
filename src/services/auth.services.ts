import prisma from "../db/DB.ts";
import type { User } from "../types/general/userData.ts";
import { createAdminSchema, type createAdminData, } from "../validators/data-validators/auth/createAdmin.ts";

export async function getUserService({ email } : {email : string}): Promise<User | null> {
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
        role : {
          select : {
            name : true
          }
        }
      }
    })

    if(!user){
      return null;
    }

    return {
      ...user,
      role : user.role?.name ?? ""
    };
  }
  catch (error) {
    const message = error instanceof Error ? (error.message) : String(error);
    console.error(`Error while getting a User : ${message}`);
    throw new Error(`Error while getting a User : ${message}`);
  }
}

export async function getAdminService({ email , role } : {email : string , role : string}): Promise<createAdminData | null> {
  try {
    const user = await prisma.user.findUnique({
      where : {
        email : email,
        role : {
          name : role
        }
      },
      select : {
        firstName : true,
        lastName : true,
        email : true,
        role : {
          select : {
            name : true
          }
        }
      }
    });

    if(!user){
      return null;
    }

    return createAdminSchema.parse(user);
  } 
  catch (error) {
    const message = error instanceof Error ? (error.message) : String(error);
    console.error(`Error while getting a Admin : ${message}`);
    throw new Error(`Error while getting a Admin : ${message}`);
  }
}

export async function createAdminService({firstName , lastName , email , password , role} : createAdminData): Promise<createAdminData | null> {
  try {
    const adminRole = await prisma.role.findUnique({
      where : {
        name : 'Admin'
      }
    });

    if(!adminRole){ 
      throw new Error("Admin role not found. Please seed the database with an 'ADMIN' role first.");
    }

    const newUser = await prisma.user.create({
      data : {
        firstName : firstName,
        lastName : lastName,
        email : email,
        password : password,
        role : {
          connect : {
            id : adminRole.id
          }
        }
      },
      select : {
        firstName : true,
        lastName : true,
        email : true,
        password : true,
        role : {
          select : {
            name : true
          }
        }
      }
    })

    if(!newUser){
      return null;
    }

    return createAdminSchema.parse({
      ...newUser,
      role : newUser.role?.name
    });
  } 
  catch (error) {
    const message = error instanceof Error ? (error.message) : String(error);
    console.error(`Error while creating admin : ${message}`);
    throw new Error(`Error while creating admin : ${message}`);
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