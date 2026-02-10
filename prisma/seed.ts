import { PrismaClient, Villa_Status } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Seed Process ---');

    // 1. Permissions
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

    // 2. Roles
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

    // 3. Role-Permission Mapping
    for (const p of createdPermissions) {
        try {
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

    // 4. General Settings
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

    // 5. Admin User
    const hashedPassword = await bcrypt.hash('TBK@SecurePass#2026', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@tbkvillas.com' },
        update: {
            password: hashedPassword,
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

    // 6. Amenities
    const luxuryCat = await prisma.amenityCategory.upsert({
        where: { name: 'Luxury Features' },
        update: {},
        create: {
            name: 'Luxury Features',
            icon: 'star',
        }
    });

    const mockAmenities = ['Private Pool', 'Jacuzzi', 'Wi-Fi', 'Power Backup', 'AC', 'Kitchen'];
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

    // 7. Delete existing data
    await prisma.villaCaretaker.deleteMany({});
    await prisma.villaManager.deleteMany({});
    await prisma.villaImage.deleteMany({});
    await prisma.villa.deleteMany({
        where: { ownerId: adminUser.id }
    });

    // 8. Villas Data (Order as per document)
    const villasData = [
        // 1. TBK Villa 10
        {
            name: 'TBK Villa 10',
            location: 'https://maps.app.goo.gl/CXTn6bUzGEQ5iNrA8?g_st=iw',
            price: 23000,
            maxGuests: 8,
            bedrooms: 4,
            bathrooms: 3,
            description: 'Luxury villa with panoramic views.',
            imageUrl: 'https://tbkvillas.com/wp-content/uploads/2024/01/DSC4037-1.jpg',
            images: [
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC3935-1.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC3986-1.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC4013-1.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC4037-1.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC_3450-1.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC_3489-1.jpg',
            ],
            managers: ['9147374601'],
            caretakers: ['9732448871'],
        },
        // 2. TBK Villa 05
        {
            name: 'TBK Villa 05',
            location: 'https://maps.app.goo.gl/CXTn6bUzGEQ5iNrA8?g_st=iw',
            price: 24000,
            maxGuests: 8,
            bedrooms: 4,
            bathrooms: 3,
            description: 'Spacious villa with private pool and garden.',
            imageUrl: 'https://tbkvillas.com/wp-content/uploads/2024/03/AH0A0734.jpg',
            images: [
                'https://tbkvillas.com/wp-content/uploads/2024/03/AH0A0740.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/03/AH0A0728.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/03/AH0A0979.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/03/AH0A0805.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/03/AH0A0767.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/03/AH0A0788.jpg',
            ],
            managers: ['9147374601'],
            caretakers: ['7063640999'],
        },
        // 3. Kibana R4
        {
            name: 'Kibana R4',
            location: 'https://maps.app.goo.gl/UnjUSoctXomcqsgo8?g_st=iw',
            price: 22000,
            maxGuests: 6,
            bedrooms: 3,
            bathrooms: 2,
            description: 'Compact villa with efficient layout.',
            imageUrl: 'https://placehold.co/800x600/orange/white?text=Kibana+R4',
            images: [
                'https://placehold.co/800x600/orange/white?text=Kibana+R4+1',
                'https://placehold.co/800x600/orange/white?text=Kibana+R4+2',
                'https://placehold.co/800x600/orange/white?text=Kibana+R4+3',
                'https://placehold.co/800x600/orange/white?text=Kibana+R4+4',
                'https://placehold.co/800x600/orange/white?text=Kibana+R4+5',
            ],
            managers: ['9147374601'],
            caretakers: ['7821032220', '7319354519'],
        },
        // 4. TBK Villa 01
        {
            name: 'TBK Villa 01',
            location: 'https://maps.app.goo.gl/C8hFJ4YNE9LkakMr7?g_st=aw',
            price: 25000,
            maxGuests: 8,
            bedrooms: 4,
            bathrooms: 4,
            description: 'Premium villa with modern amenities and stunning views.',
            imageUrl: 'https://tbkvillas.com/wp-content/uploads/2024/01/AH0A6645-scaled.jpg',
            images: [
                'https://tbkvillas.com/wp-content/uploads/2026/01/AH0A6977-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/AH0A7040-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/AH0A7049-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/AH0A7076-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/AH0A7328-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/DJI_0981-1-scaled.jpg',
            ],
            managers: ['9147374601'],
            caretakers: ['6398263556', '9369287396'],
        },
        // 5. Zen Villa
        {
            name: 'Zen Villa',
            location: 'https://maps.app.goo.gl/JGP3geqrbQV7PYLx6?g_st=aw',
            price: 27000,
            maxGuests: 8,
            bedrooms: 4,
            bathrooms: 4,
            description: 'Peaceful retreat with zen-inspired design.',
            imageUrl: 'https://placehold.co/800x600/orange/white?text=Zen+Villa',
            images: [
                'https://placehold.co/800x600/orange/white?text=Zen+Villa+1',
                'https://placehold.co/800x600/orange/white?text=Zen+Villa+2',
                'https://placehold.co/800x600/orange/white?text=Zen+Villa+3',
                'https://placehold.co/800x600/orange/white?text=Zen+Villa+4',
                'https://placehold.co/800x600/orange/white?text=Zen+Villa+5',
            ],
            managers: ['9147374601'],
            caretakers: ['7428106445'],
        },
        // 6. Origin Villa
        {
            name: 'Origin Villa',
            location: 'https://maps.app.goo.gl/7zeecADxA1z4jURg7?g_st=aw',
            price: 24000,
            maxGuests: 6,
            bedrooms: 3,
            bathrooms: 3,
            description: 'Classic villa with authentic Goan charm.',
            imageUrl: 'https://placehold.co/800x600/orange/white?text=Origin+Villa',
            images: [
                'https://placehold.co/800x600/orange/white?text=Origin+Villa+1',
                'https://placehold.co/800x600/orange/white?text=Origin+Villa+2',
                'https://placehold.co/800x600/orange/white?text=Origin+Villa+3',
                'https://placehold.co/800x600/orange/white?text=Origin+Villa+4',
                'https://placehold.co/800x600/orange/white?text=Origin+Villa+5',
            ],
            managers: ['9147374601'],
            caretakers: ['9637057239'],
        },
        // 7. Zorita 06
        {
            name: 'Zorita 06',
            location: 'https://maps.app.goo.gl/ghtVFDh7ZDFcPeCZA?g_st=aw',
            price: 23000,
            maxGuests: 6,
            bedrooms: 3,
            bathrooms: 3,
            description: 'Contemporary villa with stylish interiors.',
            imageUrl: 'https://placehold.co/800x600/orange/white?text=Zorita+06',
            images: [
                'https://placehold.co/800x600/orange/white?text=Zorita+06+1',
                'https://placehold.co/800x600/orange/white?text=Zorita+06+2',
                'https://placehold.co/800x600/orange/white?text=Zorita+06+3',
                'https://placehold.co/800x600/orange/white?text=Zorita+06+4',
                'https://placehold.co/800x600/orange/white?text=Zorita+06+5',
            ],
            managers: ['9147374601'],
            caretakers: ['8972955166'],
        },
        // 8. TBK Villa 04
        {
            name: 'TBK Villa 04',
            location: 'https://maps.app.goo.gl/DTMew9JezBUCXdhS7?g_st=aw',
            price: 22000,
            maxGuests: 6,
            bedrooms: 3,
            bathrooms: 3,
            description: 'Cozy villa perfect for family getaways.',
            imageUrl: 'https://tbkvillas.com/wp-content/uploads/2024/02/WhatsApp-Image-2023-11-25-at-10.30.09-1.jpg',
            images: [
                'https://tbkvillas.com/wp-content/uploads/2024/02/WhatsApp-Image-2023-11-25-at-10.30.07-1.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/02/WhatsApp-Image-2023-11-25-at-10.30.03-2.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/02/WhatsApp-Image-2023-11-25-at-10.30.04-1.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/02/WhatsApp-Image-2023-11-25-at-10.30.06.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/02/WhatsApp-Image-2023-11-25-at-10.30.05.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/02/WhatsApp-Image-2023-11-25-at-10.30.02.jpg',
            ],
            managers: ['9147374601'],
            caretakers: ['8423789442'],
        },
        // 9. TBK Villa West View
        {
            name: 'TBK Villa West View',
            location: 'https://maps.app.goo.gl/CgTrwKUT8Tz6JDCy8?g_st=aw',
            price: 25000,
            maxGuests: 8,
            bedrooms: 4,
            bathrooms: 3,
            description: 'Villa with breathtaking western sunset views.',
            imageUrl: 'https://tbkvillas.com/wp-content/uploads/2025/05/DJI_0933.jpg',
            images: [
                'https://tbkvillas.com/wp-content/uploads/2025/05/DSC_7049.jpg',
                'https://tbkvillas.com/wp-content/uploads/2025/05/DJI_0923.jpg',
                'https://tbkvillas.com/wp-content/uploads/2025/05/AH0A6452.jpg',
                'https://tbkvillas.com/wp-content/uploads/2025/05/AH0A6421.jpg',
                'https://tbkvillas.com/wp-content/uploads/2025/05/AH0A6294.jpg',
                'https://tbkvillas.com/wp-content/uploads/2025/05/AH0A6111.jpg',
            ],
            managers: ['7066487849'],
            caretakers: ['9623856366', '9679477857'],
        },
        // 10. TBK Villa 08
        {
            name: 'TBK Villa 08',
            location: 'https://maps.app.goo.gl/DTMew9JezBUCXdhS7?g_st=aw',
            price: 20000,
            maxGuests: 6,
            bedrooms: 3,
            bathrooms: 2,
            description: 'Modern villa with excellent connectivity.',
            imageUrl: 'https://placehold.co/800x600/orange/white?text=TBK+Villa+08',
            images: [
                'https://placehold.co/800x600/orange/white?text=TBK+Villa+08+1',
                'https://placehold.co/800x600/orange/white?text=TBK+Villa+08+2',
                'https://placehold.co/800x600/orange/white?text=TBK+Villa+08+3',
                'https://placehold.co/800x600/orange/white?text=TBK+Villa+08+4',
                'https://placehold.co/800x600/orange/white?text=TBK+Villa+08+5',
            ],
            managers: ['7066487849'],
            caretakers: ['7498770339'],
        },
        // 11. TBK Villa 15
        {
            name: 'TBK Villa 15',
            location: 'https://maps.app.goo.gl/CXTn6bUzGEQ5iNrA8?g_st=iw',
            price: 26000,
            maxGuests: 10,
            bedrooms: 5,
            bathrooms: 4,
            description: 'Large villa ideal for group stays.',
            imageUrl: 'https://placehold.co/800x600/orange/white?text=TBK+Villa+15',
            images: [
                'https://placehold.co/800x600/orange/white?text=TBK+Villa+15+1',
                'https://placehold.co/800x600/orange/white?text=TBK+Villa+15+2',
                'https://placehold.co/800x600/orange/white?text=TBK+Villa+15+3',
                'https://placehold.co/800x600/orange/white?text=TBK+Villa+15+4',
                'https://placehold.co/800x600/orange/white?text=TBK+Villa+15+5',
            ],
            managers: ['7066487849'],
            caretakers: ['7864861015'],
        },
        // 12. Kibana Mirai R8
        {
            name: 'Kibana Mirai R8',
            location: 'https://maps.app.goo.gl/UnjUSoctXomcqsgo8?g_st=iw',
            price: 26000,
            maxGuests: 8,
            bedrooms: 4,
            bathrooms: 4,
            description: 'Futuristic villa with smart home features.',
            imageUrl: 'https://placehold.co/800x600/orange/white?text=Kibana+Mirai+R8',
            images: [
                'https://placehold.co/800x600/orange/white?text=Kibana+Mirai+R8+1',
                'https://placehold.co/800x600/orange/white?text=Kibana+Mirai+R8+2',
                'https://placehold.co/800x600/orange/white?text=Kibana+Mirai+R8+3',
                'https://placehold.co/800x600/orange/white?text=Kibana+Mirai+R8+4',
                'https://placehold.co/800x600/orange/white?text=Kibana+Mirai+R8+5',
            ],
            managers: ['7066487849'],
            caretakers: ['8293987935'],
        },
        // 13. Kibana Mirai L4
        {
            name: 'Kibana Mirai L4',
            location: 'https://maps.app.goo.gl/UnjUSoctXomcqsgo8?g_st=iw',
            price: 24000,
            maxGuests: 6,
            bedrooms: 3,
            bathrooms: 3,
            description: 'Modern villa with premium finishes.',
            imageUrl: 'https://placehold.co/800x600/orange/white?text=Kibana+Mirai+L4',
            images: [
                'https://placehold.co/800x600/orange/white?text=Kibana+Mirai+L4+1',
                'https://placehold.co/800x600/orange/white?text=Kibana+Mirai+L4+2',
                'https://placehold.co/800x600/orange/white?text=Kibana+Mirai+L4+3',
                'https://placehold.co/800x600/orange/white?text=Kibana+Mirai+L4+4',
                'https://placehold.co/800x600/orange/white?text=Kibana+Mirai+L4+5',
            ],
            managers: ['9147088903'],
            caretakers: ['8597686745'],
        },
        // 14. Calangute Villa
        {
            name: 'Calangute Villa',
            location: 'https://maps.app.goo.gl/gispovaU1qMHHDtH7?g_st=aw',
            price: 28000,
            maxGuests: 10,
            bedrooms: 5,
            bathrooms: 4,
            description: 'Beach-side villa near Calangute beach.',
            imageUrl: 'https://tbkvillas.com/wp-content/uploads/2024/01/DSC1514.jpg',
            images: [
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC1622.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC1514.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC2213.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC2312.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC2348.jpg',
            ],
            managers: ['9147088903'],
            caretakers: ['8371918498', '8388087031'],
        },
        // 15. TBK Villa 103
        {
            name: 'TBK Villa 103',
            location: 'https://maps.app.goo.gl/cGaABtuQs9g4sTw4A?g_st=aw',
            price: 28000,
            maxGuests: 10,
            bedrooms: 5,
            bathrooms: 4,
            description: 'Premium villa with top-notch facilities.',
            imageUrl: 'https://tbkvillas.com/wp-content/uploads/2024/01/DSC4675.jpg',
            images: [
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC4714.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC4687.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC4675.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC4658.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC4576.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/DSC4558.jpg',
            ],
            managers: ['9147088903'],
            caretakers: ['9091811361', '7972451548'],
        },
        // 16. TBK Villa Encanto
        {
            name: 'TBK Villa Encanto',
            location: 'https://maps.app.goo.gl/Xcr7ht3x35ggHRyS6?g_st=aw',
            price: 30000,
            maxGuests: 10,
            bedrooms: 5,
            bathrooms: 5,
            description: 'Enchanting villa with luxurious amenities.',
            imageUrl: 'https://tbkvillas.com/wp-content/uploads/2026/01/DSC4396-scaled.jpg',
            images: [
                'https://tbkvillas.com/wp-content/uploads/2026/01/DSC4144-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/DSC4291-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/DSC4330-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/DSC4342-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/DSC4384-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/DSC4411-scaled.jpg',
            ],
            managers: ['9147088903'],
            caretakers: ['9284914149'],
        },
        // 17. TBK Villa 11
        {
            name: 'TBK Villa 11',
            location: 'https://maps.app.goo.gl/DTMew9JezBUCXdhS7?g_st=aw',
            price: 22000,
            maxGuests: 6,
            bedrooms: 3,
            bathrooms: 3,
            description: 'Beautiful villa with modern interiors.',
            imageUrl: 'https://tbkvillas.com/wp-content/uploads/2024/02/PHOTO-2023-01-30-01-08-451.jpg',
            images: [
                'https://tbkvillas.com/wp-content/uploads/2024/02/PHOTO-2023-01-30-01-08-451.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/02/PHOTO-2023-01-30-01-08-47.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/02/PHOTO-2023-01-30-01-08-441.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/02/PHOTO-2023-01-30-01-08-431.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/02/PHOTO-2023-01-30-01-08-422.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/02/PHOTO-2023-01-30-01-08-44.jpg',
            ],
            managers: ['9147088903'],
            caretakers: ['9650840373'],
        },
        // 18. TBK Villa 09
        {
            name: 'TBK Villa 09',
            location: 'https://maps.app.goo.gl/CXTn6bUzGEQ5iNrA8?g_st=iw',
            price: 21000,
            maxGuests: 6,
            bedrooms: 3,
            bathrooms: 3,
            description: 'Elegant villa with serene surroundings.',
            imageUrl: 'https://tbkvillas.com/wp-content/uploads/2024/01/WhatsApp-Image-2023-01-23-at-15.55.39-1.jpg',
            images: [
                'https://tbkvillas.com/wp-content/uploads/2024/01/WhatsApp-Image-2023-01-23-at-15.55.37.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/WhatsApp-Image-2023-01-23-at-15.55.36.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/WhatsApp-Image-2023-01-23-at-15.55.41-1.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/WhatsApp-Image-2023-01-23-at-15.55.38-1.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/WhatsApp-Image-2023-01-23-at-15.55.41.jpg',
                'https://tbkvillas.com/wp-content/uploads/2024/01/WhatsApp-Image-2023-01-23-at-15.55.39-1.jpg',
            ],
            managers: ['9147088903'],
            caretakers: ['8082528342'],
        },
        // 19. Kibana Komorebi 01
        {
            name: 'Kibana Komorebi 01',
            location: 'https://maps.app.goo.gl/FBeS9qq19DBCUrQS8?g_st=aw',
            price: 25000,
            maxGuests: 8,
            bedrooms: 4,
            bathrooms: 3,
            description: 'Nature-inspired villa with forest views.',
            imageUrl: 'https://tbkvillas.com/wp-content/uploads/2026/01/DJI_0257-1-scaled.jpg',
            images: [
                'https://tbkvillas.com/wp-content/uploads/2026/01/DSC2693-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/DSC2819-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/DSC2948-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/DSC2975-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/DSC2993-scaled.jpg',
                'https://tbkvillas.com/wp-content/uploads/2026/01/DSC3062-scaled.jpg',
            ],
            managers: ['9147088903'],
            caretakers: ['9609874034'],
        },
    ];

    // Create villas with images, managers, and caretakers
    for (const villaData of villasData) {
        const { images, managers, caretakers, ...villaFields } = villaData;

        const villa = await prisma.villa.create({
            data: {
                ...villaFields,
                status: Villa_Status.AVAILABLE,
                ownerId: adminUser.id,
            }
        });

        // Add images
        await prisma.villaImage.createMany({
            data: images.map(url => ({
                url,
                villaId: villa.id
            }))
        });

        // Add managers
        await prisma.villaManager.createMany({
            data: managers.map(phone => ({
                phone,
                villaId: villa.id
            }))
        });

        // Add caretakers
        await prisma.villaCaretaker.createMany({
            data: caretakers.map(phone => ({
                phone,
                villaId: villa.id
            }))
        });

        console.log(`✅ ${villaData.name} created with ${images.length} images, ${managers.length} manager(s), ${caretakers.length} caretaker(s)`);
    }

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