import { PrismaClient } from '@prisma/client';
import { crypt } from "./../src/services/crypt/crypt.service";

const prisma = new PrismaClient();

async function main() {
    // Basic account
    let accounts = await prisma.accounts.count();
    if(accounts == 0)
        await prisma.accounts.create({
            data: {
                user: 'admin',
                name: 'Administrator',
                email: 'sample@email.com',
                password: crypt('Admin.2025')
            }
        });
    
    let modules = await prisma.systemModule.count();
    if(modules == 0)
        await prisma.systemModule.createMany({
            data: [
                { module: 'Roles', details: 'Manage system roles'},
                { module: 'Account', details: 'Manage user accounts'},
                { module: 'Categories', details: 'Manage product categories'},
                { module: 'Products', details: 'Manage products and product variants'},
                { module: 'Review', details: 'Manage client reviews'},
                { module: 'Clients', details: 'Manage clients'},
            ]
        })

    console.log('Seed process completed')
}

main()
    .catch(e => { throw e; })
    .finally(async () => {
        await prisma.$disconnect(); 
});