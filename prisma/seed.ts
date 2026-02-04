import { PrismaClient, Villa_Status } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Seed Process ---');

    // 1. Permissions (Mock Data) - Upsert use kiya hai taaki duplicate error na aaye
    const permissions = [
        'view_dashboard', 'manage_villas', 'manage_bookings',
        'manage_users', 'manage_expenses', 'view_reports'
    ];

    const createdPermissions = await Promise.all(
        permissions.map(p =>
            prisma.permission.upsert({
                where: { name: p },
                update: {},
                create: { name: p }
            })
        )
    );
    console.log('✅ Permissions created or verified');

    // 2. Roles (Admin, Manager, Staff)
    const roles = ['Admin', 'Manager', 'Staff'];
    const createdRoles = await Promise.all(
        roles.map(r =>
            prisma.role.upsert({
                where: { name: r },
                update: {},
                create: { name: r }
            })
        )
    );
    console.log('✅ Roles created or verified');

    // 3. Role-Permission Mapping (Admin gets everything)
    // FIX: Array.map par .catch() nahi chalta, isliye loop use kiya hai
    for (const p of createdPermissions) {
        try {
            // Pehle check karo ki mapping hai ya nahi
            const existingMapping = await prisma.rolePermission.findFirst({
                where: {
                    roleId: createdRoles[0].id,
                    permissionId: p.permissionId
                }
            });

            if (!existingMapping) {
                await prisma.rolePermission.create({
                    data: {
                        roleId: createdRoles[0].id,
                        permissionId: p.permissionId
                    }
                });
            }
        } catch (e) {
            console.log(`⚠️ Mapping skipped for permission: ${p.name}`);
        }
    }
    console.log('✅ Role-Permission mapping completed');

    // 4. General Settings - Purana delete karke naya create (Idempotency)
    await prisma.generalSetting.deleteMany({});
    await prisma.generalSetting.create({
        data: {
            businessName: 'TBK Villa Management',
            contactEmail: 'contact@tbkvillas.com',
            phoneNumber: '9876543210',
            admin1Name: 'Jairaj',
            admin1Email: 'jairaj@tbkvillas.com',
        }
    });
    console.log('✅ General Settings updated');

    // 5. User Creation (Admin Account)
    const hashedPassword = await bcrypt.hash('TBK@SecurePass#2026', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@tbkvillas.com' },
        update: {
            password: hashedPassword, // Password update kar dega agar user pehle se hai
            roleId: createdRoles[0].id
        },
        create: {
            firstName: 'Sahil',
            lastName: 'Ladhania',
            email: 'admin@tbkvillas.com',
            password: hashedPassword,
            roleId: createdRoles[0].id
        }
    });
    console.log('✅ Admin User created or updated');

    // 6. Amenity Category & Amenities - Upsert to handle unique name 
    const luxuryCat = await prisma.amenityCategory.upsert({
        where: { name: 'Luxury Features' },
        update: {},
        create: {
            name: 'Luxury Features',
            icon: 'star',
        }
    });

    const mockAmenities = ['Private Pool', 'Jacuzzi'];
    for (const name of mockAmenities) {
        await prisma.amenity.upsert({
            where: {
                name_categoryId: { name, categoryId: luxuryCat.id }
            },
            update: {},
            create: { name, categoryId: luxuryCat.id }
        });
    }
    console.log('✅ Amenities settled');

    // 7. Mock Villas - Pehle purani mock villas delete karo taaki duplicate na ho
    await prisma.villa.deleteMany({
        where: { ownerId: adminUser.id }
    });

    await prisma.villa.createMany({
        data: [
            {
                name: 'The Royal Palms',
                location: 'Anjuna, Goa',
                price: 35000,
                maxGuests: 8,
                bedrooms: 4,
                bathrooms: 4,
                description: 'A massive beachfront villa with modern aesthetics.',
                status: Villa_Status.AVAILABLE,
                imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
                ownerId: adminUser.id
            },
            {
                name: 'Hilltop Retreat',
                location: 'Lonavala',
                price: 22000,
                maxGuests: 6,
                bedrooms: 3,
                bathrooms: 3,
                description: 'Quiet hilltop villa perfect for weekend escapes.',
                status: Villa_Status.AVAILABLE,
                imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
                ownerId: adminUser.id
            }
        ]
    });
    console.log('✅ Mock Villas added');

    console.log('--- Seeding Completed Successfully! ---');
}

main()
    .catch((e) => {
        console.error('❌ Seeding Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });