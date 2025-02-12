import { Store } from "../Store";
import GlobalDataHttpProvider from "./GlobalData.HttpProvider";
import { DashboardContent } from "./Dashboard.Types";

export default class DashboarStore extends Store<DashboardContent> {
	private _provider: GlobalDataHttpProvider;

	constructor() {
		super();
		this._provider = new GlobalDataHttpProvider();
	}

	protected get provider(): GlobalDataHttpProvider {
		return this._provider as GlobalDataHttpProvider;
	}

	protected getData(): Promise<DashboardContent> {
		return this.provider.load();
	}
}