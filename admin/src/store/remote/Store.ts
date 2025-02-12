export enum StoreStatus {
    EMPTY,   // For empty store
    LOADING, // Loading data
    READY,   // Information ready
    ERROR    // Error loading information
}

/**
 * Class to define a Store. Bridge between interface and data provider
 */
export abstract class Store<ContentType, SearchParams = any> {
	/**
	 * Loaded content
	 */
	protected _content: ContentType | undefined;

	/**
	 * Last reported error
	 */
	protected _error: any;

	/**
	 * Last error code
	 */
	protected _errorCode: number;

	/**
	 * Last search params used for search
	 */
	protected _lastParams: SearchParams | null;

	/**
	 * Constructor of the class
	 */
	protected constructor() {
		this._content = undefined;
		this._error = undefined;
		this._lastParams = null;
		this._errorCode = 0;
	}

	/**
	 * Register the last error
	 */
	protected registerError(message: string, code: number): void {
		this._error = message;
		this._errorCode = code;
	}

	protected abstract getData(params: SearchParams | null): Promise<ContentType | undefined>;

	/**
	 * Public method for load data
	 */
	public async load(params: SearchParams | null): Promise<StoreStatus> {
		let status: StoreStatus = StoreStatus.LOADING;
		this._lastParams = params;

		try {
			this._content = await this.getData(params);
			this._error = undefined;
			this._errorCode = 0;
			status = StoreStatus.READY;
		} catch (error) {
			this._content = undefined;
			this._error = String(error);
			this._errorCode = 400;
			status = StoreStatus.ERROR;
		}

		return status;
	}

	public async reload(): Promise<StoreStatus> {
		return await this.load(this._lastParams);
	}

	/**
	 * Return the content of the store
	 */
	public get content(): ContentType | undefined {
		return this._content;
	}

	/**
	 * Retrieve the last error
	 */
	public get lastError(): any {
		return this._error;
	}

	/**
	 * Retrieve the last error code
	 */
	public get lastErrorCode(): number {
		return this._errorCode;
	}

	/**
	 * Release the content
	 */
	public release(): void {
		this._content = undefined;
	}
}