import { AccountInfo } from "../../accounts/accounts.types";

export class AuthRequestContext {
    private _userId: number;
    private _user: string;
    private _userName: string;

    constructor(payload: AccountInfo){
        this._user = payload.user;
        this._userId = payload.userId;
        this._userName = payload.name;
    }

    set userId(userId: number) {
        this._userId = userId;
    }

    get userId() : number {
        return this._userId;
    }

    set user(user: string) {
        this._user = user;
    }

    get user() : string {
        return this._user
    }

    set userName(userName: string) {
        this._userName = userName;
    }

    get userName() : string {
        return this._userName;
    }

    get Obj() {
        return {
            userId: this._userId,
            user: this._user,
            userName: this._userName
        }
    }
}