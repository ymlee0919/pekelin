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

    console.log('Seed process completed')
}

main()
    .catch(e => { throw e; })
    .finally(async () => {
        await prisma.$disconnect(); 
});