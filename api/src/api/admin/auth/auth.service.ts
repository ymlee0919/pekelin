import { Injectable } from "@nestjs/common";
import { decrypt } from "src/services/crypt/crypt.service";
import { DatabaseService } from "src/services/database/database.service";
import { InvalidOperationError } from "src/common/errors/invalid.error";
import { UserAuth } from "./auth.types";

export interface Credentials {
    readonly user: string;
    readonly password: string;
}

/**
 * Service for authentication
 */
@Injectable()
export class AuthService {

    /**
     * Constructor of the class
     * @param database Database provider service
     */
    constructor(private readonly database:DatabaseService){}

    async login(credentials: Credentials) : Promise<UserAuth|null>
    {
        let account = await this.database.accounts.findFirst({
            where: {
                user: credentials.user
            }, select: {
                userId: true,
                user: true,
                name: true,
                email: true,
                password: true,
                Role: {
                    select: {role: true, modules: {
                        select: {
                            module: true
                        }
                    }},
                    
                }
            }
        });

        if(!account)
            throw new InvalidOperationError('Invalid credentials');

        let {password, ...userAccount} = account;
        let decrypted = decrypt(password);

        if(decrypted != credentials.password)
            throw new InvalidOperationError('Invalid credentials');


        let {Role, ...item} = userAccount;
        return {role: Role.role, ...item, permissions: Role.modules.map(module => module.module)};
    }

}