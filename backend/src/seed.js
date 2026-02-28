const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {
    console.log('Seeding default users...');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const managerPassword = await bcrypt.hash('manager123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@gasflow.com' },
        update: {},
        create: {
            email: 'admin@gasflow.com',
            name: 'System Admin',
            password: adminPassword,
            role: 'ADMIN',
            phone: '9999999999'
        },
    });

    const manager = await prisma.user.upsert({
        where: { email: 'manager@gasflow.com' },
        update: {},
        create: {
            email: 'manager@gasflow.com',
            name: 'Sales Manager',
            password: managerPassword,
            role: 'MANAGER',
            phone: '8888888888'
        },
    });

    console.log('Seeding completed:');
    console.log('- Admin: admin@gasflow.com / admin123');
    console.log('- Manager: manager@gasflow.com / manager123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
