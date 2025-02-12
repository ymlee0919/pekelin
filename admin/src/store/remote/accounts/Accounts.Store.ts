import { Store } from "../Store";
import { EventResult } from "../../../types/Events";
import AccountsHttpProvider from "./Accounts.HttpProvider";
import { 
	AccountContent, 
	AccountCreationDTO, 
	AccountCredentialsUpdateDTO,
	AccountUpdateDTO, 
	CreatedAccount, 
	UpdatedAccount
} from "./Accounts.Types";

export default class AccountsStore extends Store<Array<AccountContent>> {
	private _provider: AccountsHttpProvider;

	constructor() {
		super();
		this._provider = new AccountsHttpProvider();
	}

	protected getData(): Promise<Array<AccountContent>> {
		return this._provider.load();
	}

	protected get provider(): AccountsHttpProvider {
		return this._provider as AccountsHttpProvider;
	}

	get(userId: number): AccountContent | undefined {
		return this._content?.find((account: AccountContent) => {
			return account.userId == userId;
		});
	}

	async create(newAccount: AccountCreationDTO): Promise<EventResult<CreatedAccount | null>> {
		try {
			let created = await this.provider.createAccount(newAccount);

			return {
				success: true,
				message: "Account successfully created",
				info: created,
			};
		} catch (error) {
			return {
				success: false,
				errorCode: this.provider.lastErrorCode ?? 0,
				message: String(error),
			};
		}
	}

	async update(
		accountId: string | number,
		newAccount: AccountUpdateDTO
	): Promise<EventResult<UpdatedAccount | null>> {
		try {
			let id = typeof accountId == "string" ? parseInt(accountId) : accountId;
			let updated = await this.provider.updateAccount(id, newAccount);

			return {
				success: true,
				message: "Account successfully updated",
				info: updated,
			};
		} catch (error) {
			return {
				success: false,
				errorCode: this.provider.lastErrorCode ?? 0,
				message: String(error),
			};
		}
	}

	async updateCredentials(
		accountId: string | number,
		newAccount: AccountCredentialsUpdateDTO
	): Promise<EventResult<UpdatedAccount | null>> {
		try {
			let id = typeof accountId == "string" ? parseInt(accountId) : accountId;
			let updated = await this.provider.updateCredentials(id, newAccount);

			return {
				success: true,
				message: "Credentials successfully updated",
				info: updated
			};
		} catch (error) {
			return {
				success: false,
				errorCode: this.provider.lastErrorCode ?? 0,
				message: String(error),
			};
		}
	}

	async delete(accountId: string | number): Promise<EventResult> {
		try {
			let id = typeof accountId == "string" ? parseInt(accountId) : accountId;
			await this.provider.deleteAccount(id);

			return {
				success: true,
				message: "Account successfully deleted",
			};
		} catch (error) {
			return {
				success: false,
				errorCode: this.provider.lastErrorCode ?? 0,
				message: String(error),
			};
		}
	}
}

