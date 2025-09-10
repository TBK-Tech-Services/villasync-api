import type { Permission } from "@prisma/client";
import prisma from "../db/DB.ts";

export async function getAllPermissionsService(): Promise<Permission[]> {
    try {
        const permissions = await prisma.permission.findMany();
        return permissions;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting all Permissions : ${message}`);
        throw new Error(`Error while getting all Permissions : ${message}`);
    }
}

export async function inviteNewUserService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

export async function updateUserService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

export async function getGeneralSettingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function updateGeneralSettingsService(): Promise<void>{
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function getAllVillasSettingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function updateVillaSettingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function updateNotificationSettingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function getAllUsersService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function updateBackupSettingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function exportAllDataService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}