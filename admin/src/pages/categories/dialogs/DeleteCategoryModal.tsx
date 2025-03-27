import { useForm } from "react-hook-form";
import { CommonProps } from "../../../types/Common";
import { EmptyEvent } from "../../../types/Events";
import toast from "react-hot-toast";
import { CategoryContent } from "../../../store/remote/categories/Categories.Types";
import useStores from "../../../hooks/useStores";
import { errorToEventResult } from "../../../types/Errors";

export interface DeleteCategoryModalProps extends CommonProps {
	category: CategoryContent;
    reload: EmptyEvent;
	onClose: EmptyEvent;
}

const DeleteCategoryModal = (props: DeleteCategoryModalProps) => {

    const { handleSubmit } = useForm();
	const stores = useStores();

	let deleteCategory = async () => {
        try {
			let result = await stores.categoryStore.delete(props.category.categoryId);
			if (result.success) props.reload();
			return result;
		}
		catch (error) {
			return errorToEventResult(error, "Unable to delete the category");
		}
    }

	const onSubmit = async () => {
		let loadingToast = toast.loading('Deleting category...');
		let result = await deleteCategory();
		toast.dismiss(loadingToast);

		if(result.success)
			toast.success(result.message);
		else
			toast.error(result.message);        
	};

    return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<dialog   className="modal modal-open">
					<div className="modal-box bg-base-200">
						<h3 className="font-bold text-lg">Delete category</h3>
						<div className="flex gap-2 py-3">
							<div >
								<div className="avatar">
									<div className="w-32 rounded">
										<img
											src={(import.meta.env.VITE_IMG_URL ?? '') + props.category.icon}
										/>
									</div>
								</div>
							</div>
							<div className="flex-1 content-start">
								<span className="text-xl">{props.category.category}</span>
							</div>
						</div>
						
						<p>Are you sure you want to delete this category?</p>
						<div className="modal-action">
							<button type="submit" className="btn btn-error btn-sm mr-5">
								Yes, delete
							</button>
							<a className="btn btn-sm" onClick={() => props.onClose()}>
								No, close
							</a>
						</div>
					</div>
				</dialog>
			</form>
		</>
	);

}

export default DeleteCategoryModal;