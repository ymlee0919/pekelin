import HttpProvider from "../HttpProvider";
import { AxiosProvider } from "../Provider";
import { DashboardContent } from "./Dashboard.Types";

export default class GlobalDataHttpProvider extends AxiosProvider<DashboardContent> {
	async load(): Promise<DashboardContent> {
		try {
			return await HttpProvider.get<null, DashboardContent>("/app");
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load general information");
		}
	}
}