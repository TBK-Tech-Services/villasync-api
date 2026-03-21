import prisma from "../db/DB.ts";
import type { User } from "../types/general/userData.ts";
import { createAdminSchema, type createAdminData, } from "../validators/data-validators/auth/createAdmin.ts";
import { InternalServerError, NotFoundError } from "../utils/errors/customErrors.ts";
import { randomInt } from "crypto";

// Service to Get a User
export async function getUserService({ email } : {email : string}): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where : {
        email : email
      },
      select : {
        id : true,
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
    console.error(`Error while getting user: ${error}`);
    throw new InternalServerError("Failed to retrieve user information");
  }
};

// Service to Get an Admin
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
        id : true,
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
    console.error(`Error while getting admin: ${error}`);
    throw new InternalServerError("Failed to retrieve admin information");
  }
};

// Service to Create an Admin
export async function createAdminService({firstName , lastName , email , password , role} : createAdminData): Promise<createAdminData | null> {
  try {
    const adminRole = await prisma.role.findUnique({
      where : {
        name : 'Admin'
      }
    });

    if(!adminRole){ 
      throw new NotFoundError("Admin role not found. Please contact system administrator.");
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
      throw new InternalServerError("Failed to create admin user");
    }

    return createAdminSchema.parse({
      ...newUser,
      role : newUser.role?.name
    });
  } 
  catch (error) {
    if (error instanceof NotFoundError || error instanceof InternalServerError) {
      throw error;
    }
    console.error(`Error while creating admin: ${error}`);
    throw new InternalServerError("Failed to create admin user");
  }
};

// Service to Get Permissions By Role
export async function getPermissionsByRole(role: string): Promise<string[] | void> {
    try {
      const permissions = await prisma.rolePermission.findMany({
        where : {
          role : {
            name : role
          }
        },
        include : {
          permission : true
        }
      });

      return permissions.map((rp) => rp.permission.name);
    }
    catch (error) {
      console.error(`Error while getting permissions by role: ${error}`);
      throw new InternalServerError("Failed to retrieve role permissions");
    }
}

// Service to Create Password Reset OTP
export async function createPasswordResetOtpService({ email } : { email: string }): Promise<string> {
  try {
    // Invalidate all previous unused OTPs for this email
    await prisma.passwordResetToken.updateMany({
      where : {
        email : email,
        isUsed : false
      },
      data : {
        isUsed : true
      }
    });

    const otp = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await prisma.passwordResetToken.create({
      data : {
        email : email,
        otp : otp,
        expiresAt : expiresAt
      }
    });

    return otp;
  }
  catch (error) {
    console.error("Error while creating password reset OTP:", error);
    throw new InternalServerError("Failed to create password reset OTP");
  }
}

// Service to Verify OTP and Mark as Used
export async function verifyAndConsumeOtpService({ email, otp } : { email: string; otp: string }): Promise<boolean> {
  try {
    const token = await prisma.passwordResetToken.findFirst({
      where : {
        email : email,
        otp : otp,
        isUsed : false,
        expiresAt : {
          gt : new Date()
        }
      }
    });

    if (!token) {
      return false;
    }

    await prisma.passwordResetToken.update({
      where : { id : token.id },
      data : { isUsed : true }
    });

    return true;
  }
  catch (error) {
    console.error(`Error while verifying OTP: ${error}`);
    throw new InternalServerError("Failed to verify OTP");
  }
}

// Service to Update User Password
export async function updateUserPasswordService({ email, hashedPassword } : { email: string; hashedPassword: string }): Promise<void> {
  try {
    await prisma.user.update({
      where : { email : email },
      data : { password : hashedPassword }
    });
  }
  catch (error) {
    console.error(`Error while updating user password: ${error}`);
    throw new InternalServerError("Failed to update password");
  }
}