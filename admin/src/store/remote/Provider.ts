/**
 * Interface to define a data provider
 */
export abstract class Provider<Payload, Search = any> {
	protected errorCode: number | undefined = undefined;

	public get lastErrorCode(): number | undefined {
		return this.errorCode;
	}

	public abstract load(params: Search): Promise<Payload | undefined>;
}

export abstract class AxiosProvider<Payload, Search = any> extends Provider<Payload, Search> {
	protected handleError(error: any, defaultMessage: string) {
		
		let errorMessage = (!!error.message) ? error.message : defaultMessage;
		this.errorCode = !!error.statusCode ? error.statusCode : 400;
		
		throw Error(errorMessage);
	}
}
