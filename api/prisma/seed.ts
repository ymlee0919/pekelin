import { PrismaClient } from '@prisma/client';
import { crypt } from "./../src/services/crypt/crypt.service";

const prisma = new PrismaClient();

async function main() {
    // Basic account
    await prisma.roles.deleteMany();
    await prisma.systemModule.deleteMany();
    await prisma.accounts.deleteMany();
    
    await prisma.accounts.create({
        data: {
            user: 'admin',
            name: 'Administrator',
            email: 'sample@email.com',
            password: crypt('Admin.2025'),
            Role: {
                create: {
                    role: 'Administrator',
                    details: 'System administrator',
                    modules: {
                        create : [
                            { module: 'Roles', details: 'Manage system roles'},
                            { module: 'Account', details: 'Manage user accounts'},
                            { module: 'Categories', details: 'Manage product categories'},
                            { module: 'Products', details: 'Manage products and product variants'},
                            { module: 'Review', details: 'Manage client reviews'},
                            { module: 'Clients', details: 'Manage clients'},
                            { module: 'Orders', details: 'Manage client orders'},
                            { module: 'Production', details: 'Manage the production process'},
                        ]
                    }
                }
            }
        }
    });
    
    
    

    console.log('Seed process completed')
}

main()
    .catch(e => { throw e; })
    .finally(async () => {
        await prisma.$disconnect(); 
});