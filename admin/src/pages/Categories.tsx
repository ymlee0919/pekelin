import { useEffect, useState, MouseEvent, useRef } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { StoreStatus } from "../store/remote/Store";
import useStores from "../hooks/useStores";
import { MdOutlineAdd, MdEdit, MdDelete } from "react-icons/md";
import Loading from "../components/Loading";
import Error  from "../components/Error";

import NewCategoryDialog from "./categories/NewCategoryDialog";
import DeleteCategoryDialog from "./categories/DeleteCategoryDialog";
import UpdateCategoryDialog from "./categories/UpdateCategoryDialog";

import { useDispatch } from "react-redux"; 
import { CategoryContent, CreatedCategory, UpdatedCategory } from "../store/remote/categories/Categories.Types";
import { setCategories } from "../store/local/slices/globalSlice";
import { EventResult } from "../types/Events";
import { ErrorList, errorToEventResult } from "../types/Errors";

interface HTMLEditCategoryDialogElement extends HTMLDialogElement {
    showDialog : (category: string, description: string) => void;
}

const Categories = () => {
    const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    const dispatch = useDispatch();
    
    let [selected, setSelected] = useState<CategoryContent | undefined>(undefined);
    
    let addModalRef = useRef<HTMLDialogElement>();
    let updateModalRef = useRef<HTMLEditCategoryDialogElement>();
    let deleteModalRef = useRef<HTMLDialogElement>();

    const stores = useStores();

    let selectCategory = (categoryId: number | string) : CategoryContent | undefined => {
        let id = (typeof categoryId == "string") ? parseInt(categoryId) : categoryId;
        let category = stores.categoryStore.get(id);
        setSelected(category);
        return category;
    }

    let handleEditBtnClick = (e : MouseEvent<HTMLButtonElement>) => {
        let selected = selectCategory(e.currentTarget.getAttribute('data-img') ?? '0');
        updateModalRef.current?.showDialog(selected?.category || '', selected?.description || '');
    }

    let handleDeleteBtnClick = (e : MouseEvent<HTMLButtonElement>) => {
        selectCategory(e.currentTarget.getAttribute('data-img') || '0');
        deleteModalRef.current?.showModal()
    }

    const reload = () => {
        setStatus(StoreStatus.LOADING);
        selectCategory(0);
        
        stores.categoryStore.load(null).then(
            (newStatus: StoreStatus) => {
                setStatus(newStatus);
                if(newStatus == StoreStatus.READY && stores.categoryStore.content)
                    dispatch(setCategories(stores.categoryStore.content.length))
            }
        );
    }
    
    useEffect(() => {
        reload();
        return () => {stores.categoryStore.release()}
    }, []);

    let addCategory = async (data: FormData) : Promise<EventResult<CreatedCategory | ErrorList | null>> => {
        try {
            let result = await stores.categoryStore.addCategory(data);
            if (result.success) reload();
            return result;
        } catch (error) {
            return errorToEventResult(error, "Unable to create the category");
        }
    }

    let updateCategory = async (data: FormData) : Promise<EventResult<UpdatedCategory | ErrorList | null>> => {
        if(selected) {
            try {
                let result = await stores.categoryStore.updateCategory(selected.categoryId, data);
                if (result.success) reload();
                return result;
            } catch (error) {
                return errorToEventResult(error, "Unable to update the category");
            }
        }

        return {
            message: 'Not selected category',
            success: false,
            errorCode: 100
        }
    }

    let deleteCategory = async () => {
        if(selected) {
            try {
                let result = await stores.categoryStore.delete(selected.categoryId);
                if (result.success) reload();
                return result;
            }   
            catch (error) {
                return errorToEventResult(error, "Unable to delete the category");
            }
        }

        return {
            message: 'Not selected category',
            success: false,
            errorCode: 100
        }
    }
    
    return (
		<>
			<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: ".", label: "Categorires" },
				]}
			/>

			{status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <Error text={stores.categoryStore.lastError} /> : ""}

			{status == StoreStatus.READY ? (
				/** Main component */
				<>
					<div className="text-right">
						<a
							className="btn btn-primary btn-sm"
							onClick={() => {
								addModalRef.current?.showModal();
							}}
						>
							<MdOutlineAdd className="text-xl" /> Add
						</a>
						<br></br>
						<br></br>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {
                        stores.categoryStore.content?.length == 0 ? <>
                            <br></br>
                            <br></br>
                            <br></br>
                            <p className="text-center">No categories registered</p>
                        </> :

                        stores.categoryStore.content?.map((category: CategoryContent) => {
							return (
								<div key={category.categoryId} className="card card-compact bg-base-100 shadow-xl">
									<figure>
										<img
											src={(import.meta.env.VITE_IMG_URL ?? '') + category.remoteUrl}
											alt={category.category}
										></img>
									</figure>
									<div className="card-body">
										<h2 className="card-title">{category.category}</h2>
										<p>{category.description}</p>
										<div className="card-actions justify-end">
											<button
												data-img={category.categoryId}
												className="btn btn-info btn-xs btn-outline btn-ghost"
												onClick={handleEditBtnClick}
											>
												<MdEdit className="text-lg" />
											</button>
											<button
												data-img={category.categoryId}
												className="btn btn-error btn-xs btn-outline btn-ghost"
												onClick={handleDeleteBtnClick}
											>
												<MdDelete className="text-lg" />
											</button>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					<NewCategoryDialog 
                        ref={addModalRef} 
                        onApply={addCategory} 
                    />

					<UpdateCategoryDialog
						ref={updateModalRef}
						imageUrl={selected?.remoteUrl}
						onApply={updateCategory}
					/>

					<DeleteCategoryDialog
						ref={deleteModalRef}
						category={selected?.category}
						imageUrl={selected?.remoteUrl}
						onApply={deleteCategory}
					/>
				</>
			) : (
				/** END OF Main component */
				""
			)}
		</>
	);
}

export default Categories;