export class InternalDatabaseError extends Error {

    constructor(message:string){
        super(message);
        this.name = "InternalDatabaseError"
    }

}