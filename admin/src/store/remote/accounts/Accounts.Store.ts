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
		
		let created = await this.provider.createAccount(newAccount);
		
		return {
			success: true,
			message: "Account successfully created",
			info: created,
		};
	}

	async update(
		accountId: string | number,
		newAccount: AccountUpdateDTO
	): Promise<EventResult<UpdatedAccount | null>> {

		let id = typeof accountId == "string" ? parseInt(accountId) : accountId;
		let updated = await this.provider.updateAccount(id, newAccount);

		return {
			success: true,
			message: "Account successfully updated",
			info: updated,
		};
	}

	async updateCredentials(
		accountId: string | number,
		newAccount: AccountCredentialsUpdateDTO
	): Promise<EventResult<UpdatedAccount | null>> {

		let id = typeof accountId == "string" ? parseInt(accountId) : accountId;
		let updated = await this.provider.updateCredentials(id, newAccount);

		return {
			success: true,
			message: "Credentials successfully updated",
			info: updated
		};
	}

	async delete(accountId: string | number): Promise<EventResult> {
		
		let id = typeof accountId == "string" ? parseInt(accountId) : accountId;
		await this.provider.deleteAccount(id);

		return {
			success: true,
			message: "Account successfully deleted",
		};
	}
}

