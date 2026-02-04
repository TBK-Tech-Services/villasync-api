import { PrismaClient, Villa_Status } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Seed Process ---');

    // 1. Permissions (Mock Data)
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
    console.log('✅ Permissions created');

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
    console.log('✅ Roles created');

    // 3. Role-Permission Mapping (Admin gets everything)
    await Promise.all(
        createdPermissions.map(p =>
            prisma.rolePermission.create({
                data: {
                    roleId: createdRoles[0].id, // Admin Role
                    permissionId: p.permissionId
                }
            })
        ).catch(() => console.log('⚠️ Permissions mapping already exists'))
    );

    // 4. General Settings
    await prisma.generalSetting.create({
        data: {
            businessName: 'TBK Villa Management',
            contactEmail: 'contact@tbkvillas.com',
            phoneNumber: '9876543210',
            admin1Name: 'Jairaj',
            admin1Email: 'jairaj@tbkvillas.com',
        }
    });
    console.log('✅ General Settings added');

    // 5. User Creation (Admin Account)
    const hashedPassword = await bcrypt.hash('TBK@SecurePass#2026', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@tbkvillas.com' },
        update: {},
        create: {
            firstName: 'Sahil',
            lastName: 'Ladhania',
            email: 'admin@tbkvillas.com',
            password: hashedPassword,
            roleId: createdRoles[0].id // Linked to Admin Role
        }
    });
    console.log('✅ Admin User created');

    // 6. Amenity Category & Amenities
    const luxuryCat = await prisma.amenityCategory.create({
        data: {
            name: 'Luxury Features',
            icon: 'star',
            amenities: {
                create: [
                    { name: 'Private Pool' },
                    { name: 'Jacuzzi' }
                ]
            }
        }
    });
    console.log('✅ Amenities created');

    // 7. Mock Villas
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