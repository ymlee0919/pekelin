import { EventResult } from "./Events";

export type ErrorList = {
	[key : string] : Array<string>
};

export class ValidationError extends Error {
    private _statusCode: number;
    private _details?: ErrorList;
  
    constructor(message: string, statusCode: number, details?: ErrorList) {
        super(message); // Call the parent class constructor (Error)
        
        this.name = this.constructor.name; // Set the error name to the class name
        this._statusCode = statusCode; // Add a custom status code
        this._details = details; // Add additional details (optional)
    
        // Restore the prototype chain (optional but recommended)
        Object.setPrototypeOf(this, new.target.prototype);
    }

    get statusCode() : number {
        return this._statusCode;
    }

    get details() : ErrorList | undefined {
        return this._details;
    }

}

export function errorToEventResult(error: any, defaultMessage : string) : EventResult<ErrorList | null> {
    if(error instanceof ValidationError)
        return {
            message: error.message,
            success: false,
            errorCode: error.statusCode,
            info: error.details
        }
    
    return {
        message: (error instanceof Error) ? error.message : defaultMessage,
        success: false,
        errorCode: 400
    }
}