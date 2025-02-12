import HttpProvider from "../HttpProvider";
import { AxiosProvider } from "../Provider";
import { CreatedCategory, CategoryContent, UpdatedCategory } from "./Categories.Types";

export default class GalleryHttpProvider extends AxiosProvider<Array<CategoryContent>> {
	async load(): Promise<Array<CategoryContent>> {
		try {
			return await HttpProvider.get<null, Array<CategoryContent>>("/categories");
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load the categories");
		}
	}

	async addCategory(data: FormData): Promise<CreatedCategory | null> {
		try {
			let created = await HttpProvider.post<FormData, CreatedCategory>("/categories", data);
			return created;
		} catch (error: any) {
			this.handleError(error, "Unable to create the service");
		}
		return null;
	}

	async updateCategory(categoryId: number, data: FormData): Promise<UpdatedCategory | null> {
		try {
			let updated = await HttpProvider.patch<FormData, UpdatedCategory>(`/categories/${categoryId}`, data);
			return updated;
		} catch (error: any) {
			this.handleError(error, "Unable to update the service");
		}
		return null;
	}

	async delete(categoryId: number): Promise<boolean> {
		try {
			await HttpProvider.delete<any, any>(`/categories/${categoryId}`);
		} catch (error: any) {
			this.handleError(error, "Unable to delete the service");
		}
		return true;
	}
}