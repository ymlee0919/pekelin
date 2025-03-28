import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { MdImageSearch } from "react-icons/md";
import { ErrorList, errorToEventResult } from "../../../types/Errors";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import useStores from "../../../hooks/useStores";
import { EventResult } from "../../../types/Events";
import { UpdatedCategory } from "../../../store/remote/categories/Categories.Types";
import { StoreStatus } from "../../../store/remote/Store";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import RouterTable from "../../../router/router.table";

type FormValues = { file: FileList; category: string; description: string };

const EditCategory = () => {

	const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
	const [image, setImage] = useState<string>("");

    const { register, setValue, handleSubmit, setError, watch, formState : {errors} } = useForm<FormValues>();
	const [preview, setPreview] = useState<string | null>(null);
	const file = watch("file");

	const navigate = useNavigate();
	const params = useParams();
	const categoryId = params.id || '0';
	const stores = useStores();

	let updateCategory = async (data: FormData) : Promise<EventResult<UpdatedCategory | ErrorList | null>> => {
        try {
			let id = parseInt(categoryId);
			let result = await stores.categoryStore.updateCategory(id, data);
			return result;
		} catch (error) {
			return errorToEventResult(error, "Unable to update the category");
		}
    }

    const onSubmit: SubmitHandler<FormValues> = async (data) => { 
        // Prepare data
		const formData = new FormData(); 
        if (file) {
            formData.append('image', file[0]);
        }
		formData.append("category", data.category);
		formData.append("description", data.description);
        
		// Treat the response
		let loadingToast = toast.loading("Updating category...");
		let result = await updateCategory(formData);
		toast.dismiss(loadingToast);

		if (result.success) {
			toast.success(result.message);
			navigate(RouterTable.categories.root);
		} else {
			toast.error(result.message);

            if(result.info && result.errorCode === 422) {
                let errors = result.info as ErrorList;

                Object.keys(data).forEach((key: string) => {
                    if(errors.hasOwnProperty(key)) {
                        setError(key as keyof FormValues, { message: errors[key][0] }  )
                    }
                })
            }
		}
    };

	useEffect(() => {
		if (file && file.length > 0) {
			const selectedFile = file[0];
			if (selectedFile && selectedFile.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setPreview(reader.result as string);
				};
				reader.readAsDataURL(selectedFile);
			} else {
				setPreview(null);
			}
		}
	}, [file]);

	useEffect(() => {
        stores.categoryStore.load(null).then(
            (newStatus: StoreStatus) => {
                setStatus(newStatus);
                if (newStatus == StoreStatus.READY && stores.categoryStore.content){
                    let category = stores.categoryStore.get(parseInt(categoryId));
                    if(category) {
                        setValue("category", category.category);
						setValue("description", category.description);
						setImage(category.icon);
                    }
                    else
                        setStatus(StoreStatus.ERROR);
                }
            }
        );
    }, []);

    return (
		<>
		<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: "/categories", label: "Categories" },
					{ url: ".", label: "New" },
				]}
			/>
			
			{status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <ErrorMessage text={stores.accountsStore.lastError} /> : ""}
			{status == StoreStatus.READY ? (
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="panel mx-5 shadow-md">
					<div className="panel-header panel-header-lighten">
						<span className="title">Edit category</span>
					</div>
					<div className="panel-content">
						<div className="flex flex-wrap gap-5">
							<div className="md:w-2/12 w-10/12">
								<label className="form-control w-full max-w-xs">
									<div className="label">
										<span className="label-text">
											Image <span className="text-gray-500 text-xs">(600px x 400px)</span>
										</span>
									</div>
								</label>
								<div className="indicator">
									<span className="indicator-item indicator-bottom z-50">
										<label
											htmlFor="editCategoryUpload"
											className="flex  bg-slate-700 hover:bg-slate-500 text-sm text-white px-2 py-1 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]"
										>
											<MdImageSearch className="text-2xl pr-2" />
												Search
											<input
												type="file"
												id="editCategoryUpload"
												{...register("file")}
												accept="image/*"
												className="hidden"
											/>
										</label>
									</span>
									<div className="stack">
										{preview && (
											<div className="avatar">
												<div className="w-32 rounded">
													<img src={preview} className="opacity-95" />
												</div>
											</div>
										)}
										<div className="avatar">
											<div
												className="w-32 rounded"
												style={
													preview
														? {
																transform: "translateY(7%) translateX(7%) scale(100%)",
														}
														: {}
												}
											>
												<img
													src={
														(import.meta.env.VITE_IMG_URL ?? '') + image
													}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="label">
									<span className="label-text text-gray-500 text-xs italic pl-2 pt-2">
										Upload a new image only if you want to update the current
									</span>
								</div>
							</div>
							<div className="md:w-8/12 w-11/12">
								<label className="form-control w-full max-w-xs">
									<div className="label">
										<span className="label-text">Category</span>
									</div>
									<input
										{...register("category", {
											required: "The category name is required",
											minLength: {
												value: 5,
												message: "The category name must contains 5 characters minimun",
											},
										})}
										type="text"
										placeholder="Category name"
										className="input input-bordered w-full max-w-xs"
									/>

									{errors.category && (
										<div className="label">
											<span className="label-text text-red-500 text-sm">{errors.category.message}</span>
										</div>
									)}
								</label>

								<label className="form-control w-full max-w-xs">
									<div className="label">
										<span className="label-text">Description</span>
									</div>
									<textarea 
										className="textarea textarea-bordered"
										placeholder="Description"
										{...register("description", {
											required: 'The description name is required',
											minLength: {
												value: 10,
												message: "The description name must contains 10 characters minimun",
											},
										})}>

									</textarea>
									{errors.description && (
										<div className="label">
											<span className="label-text text-red-500 text-sm">{errors.description.message}</span>
										</div>
									)}
								</label>
							</div>
						</div>
					</div>
					<div className="panel-footer text-right">
						<button type="submit" className="btn btn-info btn-sm mr-5">Apply</button>
						<Link className="btn btn-sm" to={RouterTable.categories.root}>Cancel</Link>
					</div>
				</div>
			</form>) : <></>
        }
		</>
	);

}

export default EditCategory;