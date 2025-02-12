import { Injectable } from "@nestjs/common";
import { AccountInfo } from "../accounts/accounts.types";
import { decrypt } from "src/services/crypt/crypt.service";
import { DatabaseService } from "src/services/database/database.service";
import { InvalidOperationError } from "src/api/common/errors/invalid.error";

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

    async login(credentials: Credentials) : Promise<AccountInfo|null>
    {
        let account = await this.database.accounts.findFirst({
            where: {
                user: credentials.user
            }, select: {
                userId: true, user: true, name: true, password: true, email: true
            }
        });

        if(!account)
            throw new InvalidOperationError('Invalid credentials');

        let {password, ...userAccount} = account;
        let decrypted = decrypt(password);

        if(decrypted != credentials.password)
            throw new InvalidOperationError('Invalid credentials');

        return userAccount;
    }

}