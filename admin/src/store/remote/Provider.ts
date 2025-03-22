import { ValidationError } from "../../types/Errors";

/**
 * Interface to define a data provider
 */
export abstract class Provider<Payload, Search = any> {
	protected errorCode: number | undefined = undefined;
	protected errorInfo: any = {}

	public get lastErrorCode(): number | undefined {
		return this.errorCode;
	}

	public get lastErrorInfo() : any {
		return this.errorInfo;
	}

	public abstract load(params: Search): Promise<Payload | undefined>;
}

export abstract class AxiosProvider<Payload, Search = any> extends Provider<Payload, Search> {
	protected handleError(error: any, defaultMessage: string) {
		
		let {message, statusCode, errors} = error;
		let errorMessage = (!!message) ? message : defaultMessage;
		this.errorCode = !!statusCode ? statusCode : 400;
		this.errorInfo = errors;

		if(this.errorCode == 422) {
			throw new ValidationError(errorMessage, this.errorCode, errors);
		}
			
		
		throw Error(errorMessage);
	}
}
