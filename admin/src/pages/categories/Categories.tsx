import { useEffect, useState} from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { StoreStatus } from "../../store/remote/Store";
import useStores from "../../hooks/useStores";
import { MdOutlineAdd, MdEdit, MdDelete } from "react-icons/md";
import Loading from "../../components/Loading";
import ErrorMessage  from "../../components/ErrorMessage";

import { useDispatch } from "react-redux"; 
import { CategoryContent } from "../../store/remote/categories/Categories.Types";
import { setCategories } from "../../store/local/slices/globalSlice";
import { Link } from "react-router-dom";
import DeleteCategoryModal from "./dialogs/DeleteCategoryModal";
import RouterTable from "../../router/router.table";

const Categories = () => {
    const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    const dispatch = useDispatch();
    
    let [selected, setSelected] = useState<CategoryContent | undefined>(undefined);

    const stores = useStores();

    const reload = () => {
        setStatus(StoreStatus.LOADING);
        setSelected(undefined);
        
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

    return (
		<>
			<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: ".", label: "Categorires" },
				]}
			/>

			{status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <ErrorMessage text={stores.categoryStore.lastError} /> : ""}

			{status == StoreStatus.READY ? (
				/** Main component */
				<>
					<div className="text-right">
						<Link to={RouterTable.categories.new}
							className="btn btn-primary btn-sm">
							<MdOutlineAdd className="text-xl" /> Add
						</Link>
						<br></br>
						<br></br>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
											<Link
                                                to={RouterTable.categories.edit(category.categoryId)}
												className="btn btn-info btn-xs btn-outline btn-ghost"
											>
												<MdEdit className="text-lg" />
											</Link>
											<button
												data-img={category.categoryId}
												className="btn btn-error btn-xs btn-outline btn-ghost"
												onClick={() => setSelected(category)}
											>
												<MdDelete className="text-lg" />
											</button>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{selected && 
                        <DeleteCategoryModal 
                            category={selected}
                            onClose={() => setSelected(undefined)}
                            reload={reload}
                        />
                    }
				</>
			) : (
				/** END OF Main component */
				""
			)}
		</>
	);
}

export default Categories;