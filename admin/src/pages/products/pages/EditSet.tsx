import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { MdOutlineCheck, MdClose } from "react-icons/md";
import { useForm } from "react-hook-form";

import Breadcrumbs from "../../../components/Breadcrumbs";
import { ProductFeaturesList } from "../../../store/remote/products/ProductFeatures";
import ProductFeatures from "../../../components/features/ProductFeatures";
import toast from "react-hot-toast";
import useStores from "../../../hooks/useStores";
import { EmptyEvent, EventResult } from "../../../types/Events";
import { BasicCategory, BasicProduct, SetsForm } from "../../../store/remote/sets/Sets.Types";

import { MdImageSearch } from "react-icons/md";
import { StoreStatus } from "../../../store/remote/Store";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import { ErrorList, errorToEventResult } from "../../../types/Errors";
import RouterTable from "../../../router/router.table";


let features: ProductFeaturesList = new ProductFeaturesList();

/**
 * Page for new product
 */
const EditSet = () => {

    let [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    let [image, setImage] = useState<string>("");

    const stores = useStores();
    const navigate = useNavigate();
    const refFeatures = useRef<ProductFeaturesList>(features);
	const params = useParams();
    
    const {register, 
		clearErrors, 
		setError, 
		setValue, 
		watch, 
		reset, 
		handleSubmit, 
		formState: { errors }} = useForm<SetsForm & { items: number }>();

    const [preview, setPreview] = useState<string | null>(null);
	const file = watch("image");
    const categoryId = watch("categoryId");
    const product1 = watch("product1");
    const product2 = watch("product2");
    
    const onItemsUpdated = () => {
        setValue("items", refFeatures.current.list.length);
        if(refFeatures.current.list.length > 0)
            clearErrors("items");
        else
            setError("items", { message: "The product must have at least one feature" });
    }

    const submitRef = useRef<EmptyEvent>();

    useEffect(() => {
        stores.setSourceStore.load(null).then(
            (newPreStatus: StoreStatus) => { 
                if(newPreStatus == StoreStatus.READY) {
                    stores.setsStore.load({productId: parseInt(params.id ?? '0')})
                        .then( (newStatus : StoreStatus) => {
                            if(stores.setsStore.content)
                            {
                                refFeatures.current = new ProductFeaturesList(stores.setsStore.content.Features);
                                setImage(stores.setsStore.content.remoteUrl);
                                setValue("categoryId", stores.setsStore.content.categoryId);
                                setValue("product1", stores.setsStore.content.product1);
                                setValue("product2", stores.setsStore.content.product2);
                                setValue("name", stores.setsStore.content.name);
                                setValue("gender", stores.setsStore.content.gender == "M");
                                setValue("price", stores.setsStore.content.price);
                                setValue("basePrice", stores.setsStore.content.basePrice);
                                setValue("description", stores.setsStore.content.description);
                                setValue("isBestSeller", stores.setsStore.content.isBestSeller);
                                setValue("isNew", stores.setsStore.content.isNew);
                                setValue("visible", stores.setsStore.content.visible);
                                setValue("items", stores.setsStore.content.Features.length);
                            }
                                
                            setStatus(newStatus);
                        })
                } else {
                    setStatus(newPreStatus);
                }
                
            }
        );

        
		
			reset();
			submitRef.current = handleSubmit(onSumbit);
        
        // Unmount the component and create a new offer info for new page
        return () => {stores.setsStore.release()}
    }, []);

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
            }
        );
		return () => { stores.categoryStore.release() }
	}, []);

    const onSumbit = async (data: SetsForm) => {
        // Append information
        const formData = new FormData(); 
        
        for (const key in data) {
            if (data.hasOwnProperty(key) && key != 'image' && key != 'items' && key != 'gender') {
                formData.append(key, data[key as keyof SetsForm] as string);
            }
        }
        
        if (file) {
            formData.append('image', file[0]);
        } else {
            if(data.image && data.image.length == 1)
                formData.append('image', data.image[0]);
        }

        formData.append("gender", data.gender ? "M" : "F");
        formData.append('features', JSON.stringify(refFeatures.current.list));

        // Send to backend
        let loadingToast = toast.loading("Updating product...");

        let result : EventResult;
        try {
            result = await stores.productsStore.update(params.id ?? '0', formData);
        } catch (error)
        {
            result = errorToEventResult(error, "Unable to create the product");
        }

		toast.dismiss(loadingToast);

        if (result.success) {
			toast.success(result.message);
            navigate(RouterTable.products.root);
		} else {
			toast.error(result.message);

            if(result.info && result.errorCode === 422) {
                let errors = result.info as ErrorList;

                Object.keys(data).forEach((key: string) => {
                    if(errors.hasOwnProperty(key)) {
                        setError(key as keyof SetsForm, { message: errors[key][0] }  )
                    }
                })
            }
		}
    }

    return <>
        <Breadcrumbs pages={[
            { url: '/', label: 'Dashboard' },
            { url: '/products', label: 'Products' },
            { url: stores.setsStore.content ? `/products/${stores.setsStore.content.productId}` : '.', label: stores.setsStore.content?.name || 'Product' },
            { url: '.', label: 'Edit set' },
        ]} />

        {status == StoreStatus.LOADING ? <Loading /> : ''}
        {status == StoreStatus.ERROR ? <ErrorMessage text={stores.productsStore.lastError} /> : ''}
        { status == StoreStatus.READY ? 
           
            /* Main component */
            <div className="panel">
                <div className="panel-header">
                    <span className="title">Edit product set</span>
                </div>
                <div className="panel-content">
                    <form>
                        <div className="flex flex-wrap gap-3">
                            <div className="w-full md:w-3/12 sm:w-5/12">
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text">Image <span className="text-gray-500 text-xs">(500px x 500px)</span></span>
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
												{...register("image")}
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
												<img src={(import.meta.env.VITE_IMG_URL ?? '') + image}/>
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
                            <div className="w-full md:w-8/12 sm:w-7/12">
                                
                                <div className="flex flex-wrap gap-3">
                                    
                                    <div className="w-full md:w-6/12 sm:w-10/12">
                                        <label className="form-control w-full max-w-xs">
                                            <div className="label">
                                                <span className="label-text">Product name</span>
                                            </div>
                                            <input 
                                                {...register("name", {
                                                    required: 'The name is requiered', 
                                                    minLength: {
                                                        value: 5, message: 'The name must contains 5 characters minimun'}
                                                    }
                                                )} 
                                                type="text" 
                                                placeholder="Name of the product" 
                                                className="input input-bordered w-full max-w-xs"
                                            />
                                            {errors.name && 
                                                <div className="label">
                                                    <span className="label-text text-red-500 text-sm">{errors.name.message}</span>
                                                </div>}
                                        </label>
                                    </div>

                                    <div className="w-full md:w-5/12 sm:w-5/12">
                                        <label className="form-control w-full max-w-xs">
                                            <div className="label">
                                                <span className="label-text">Category</span>
                                            </div>
                                            <select 
                                                {...register("categoryId", {
                                                    validate: value => value !== 0 || "Please select a category",
                                                    onChange: () => {
                                                        setValue("product1", 0);
                                                        setValue("product2", 0);
                                                    },
                                                })} 
                                                defaultValue={categoryId}
                                                className="select select-bordered w-full max-w-xs"
                                            >
                                                    <option disabled value={0}>Select a category</option>
                                                    {stores.setSourceStore.content?.map((category: BasicCategory) => {
                                                        return <option key={category.categoryId} value={category.categoryId}>{category.category}</option>
                                                    })}
                                            </select>
                                            {errors.categoryId && 
                                                <div className="label">
                                                    <span className="label-text text-red-500 text-sm">{errors.categoryId.message}</span>
                                                </div>}
                                        </label>
                                    </div>

                                    <div className="w-full md:w-5/12 sm:w-5/12">
                                        <label className="form-control w-full max-w-xs">
                                            <div className="label">
                                                <span className="label-text">First product</span>
                                            </div>
                                            <select 
                                                {...register("product1", {
                                                    validate: value => value !== 0 || "Please select the first product",
                                                    onChange: () => {
                                                        setValue("product2", 0);
                                                    }
                                                })} 
                                                defaultValue={product1}
                                                className="select select-bordered w-full max-w-xs"
                                            >
                                                <option disabled value={0}>{categoryId == 0 ? 'Select the category' : 'Select a product'}</option>
                                                    {stores.setSourceStore.getProductsOf(categoryId).map((product: BasicProduct) => {
                                                        return <option key={product.productId} value={product.productId}>{product.name}</option>
                                                    })}
                                            </select>
                                            {errors.product1 && 
                                                <div className="label">
                                                    <span className="label-text text-red-500 text-sm">{errors.product1.message}</span>
                                                </div>}
                                        </label>
                                    </div>

                                    <div className="w-full md:w-5/12 sm:w-5/12">
                                        <label className="form-control w-full max-w-xs">
                                            <div className="label">
                                                <span className="label-text">Second product</span>
                                            </div>
                                            <select 
                                                {...register("product2", {
                                                    validate: value => value !== 0 || "Please select the second product",
                                                })} 
                                                defaultValue={product2}
                                                className="select select-bordered w-full max-w-xs"
                                            >
                                                <option disabled value={0}>{categoryId == 0 ? 'Select the category' : ( product1 == 0 ? 'Select the first product' : 'Select the second product')}</option>
                                                {stores.setSourceStore.getProductsOf(categoryId)
                                                    .filter((product: BasicProduct) => {
                                                        return categoryId != 0 && product1 != 0 && product.productId != product1
                                                    })
                                                    .map((product: BasicProduct) => {
                                                        return <option key={product.productId} value={product.productId}>{product.name}</option>
                                                    })
                                                }
                                            </select>
                                            {errors.product2 && 
                                                <div className="label">
                                                    <span className="label-text text-red-500 text-sm">{errors.product2.message}</span>
                                                </div>}
                                        </label>
                                    </div>

                                    <div className="w-full md:w-3/12 sm:w-6/12">
                                        <label className="form-control w-full">
                                            <div className="label">
                                                <span className="label-text">Base price</span>
                                            </div>
                                            <input 
                                                type="number" 
                                                placeholder="Basic product price" 
                                                className="input input-bordered w-full max-w-xs"
                                                {...register("basePrice", {
                                                    required: "The base price is required", 
                                                    valueAsNumber: true,
                                                    min: {
                                                        value: 1, message: 'The product must cost more than $1'}
                                                    }
                                                )}  
                                            />
                                            {errors.basePrice && 
                                                <div className="label">
                                                    <span className="label-text text-red-500 text-sm">{errors.basePrice.message}</span>
                                                </div>}
                                        </label>
                                    </div>

                                    <div className="w-full md:w-3/12 sm:w-6/12">
                                        <label className="form-control w-full">
                                            <div className="label">
                                                <span className="label-text">Price</span>
                                            </div>
                                            <input 
                                                type="number" 
                                                placeholder="Selling price" 
                                                className="input input-bordered w-full max-w-xs"
                                                {...register("price", {
                                                    required: "The selling price is required", 
                                                    valueAsNumber: true,
                                                    min: {
                                                        value: 1, message: 'The product must cost more than $1'}
                                                    }
                                                )}  
                                            />
                                            {errors.price && 
                                                <div className="label">
                                                    <span className="label-text text-red-500 text-sm">{errors.price.message}</span>
                                                </div>}
                                        </label>
                                    </div>

                                    <div className="w-full md:w-3/12 sm:w-6/12">
                                        <label className="form-control w-full">
                                            <div className="label">
                                                <span className="label-text">Gender</span>
                                            </div>
                                            
                                            <label className="label cursor-pointer">
                                                <span className="label-text">Male</span>
                                                <input type="checkbox" {...register("gender")} className="toggle toggle-success" defaultChecked />
                                                <span className="label-text">Female</span>
                                            </label>
                                        </label>
                                    </div>

                                    <div className="w-full">
                                        <label className="form-control w-full">
                                            <div className="label">
                                                <span className="label-text">Description</span>
                                            </div>
                                            <textarea 
                                                className="textarea textarea-bordered" 
                                                placeholder="Description"
                                                {...register("description", {
                                                    minLength: {
                                                        value: 5, message: 'The name must contains 5 characters minimun'
                                                    }
                                                })}
                                            ></textarea>
                                            {errors.description && 
                                                <div className="label">
                                                    <span className="label-text text-red-500 text-sm">{errors.description.message}</span>
                                                </div>}
                                        </label>
                                    </div>

                                    <div className="w-full">
                                        <fieldset id="product-view">
                                            <legend>View</legend>
                                            <div className="flex flex-wrap">
                                                <div className="w-full md:w-4/12 sm:w-11/12">
                                                    <div className="form-control">
                                                        <label className="label cursor-pointer justify-start">
                                                            <input 
                                                                type="checkbox" 
                                                                {...register("isNew")}
                                                                defaultChecked={false}
                                                                className="checkbox checkbox-primary" />
                                                            <span className="label-text px-2">Is new</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="w-full md:w-4/12 sm:w-11/12">
                                                    <div className="form-control">
                                                        <label className="label cursor-pointer justify-start">
                                                            <input 
                                                                type="checkbox" 
                                                                {...register("isBestSeller")}
                                                                defaultChecked={false}
                                                                className="checkbox checkbox-primary" />
                                                            <span className="label-text px-2">Is Best Seller</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="w-full md:w-4/12 sm:w-11/12">
                                                    <div className="form-control">
                                                        <label className="label cursor-pointer justify-start">
                                                            <input 
                                                                type="checkbox" 
                                                                defaultChecked={true}
                                                                {...register("visible")}
                                                                className="checkbox checkbox-primary" />
                                                            <span className="label-text px-2">Visible</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>                  
                            </div>
                        </div>
                        <input 
                            type="hidden" 
                            className="hidden"
                            {...register("items", {
                                required: true, 
                                valueAsNumber: true,
                                min: {
                                    value: 1, message: 'The product must have at least one feature'}
                                }
                            )}
                        />
                    </form>
                    <br></br>

                    <ProductFeatures features={refFeatures} onUpdate={onItemsUpdated} />
                    
                    {errors.items && 
                        <div className="label">
                            <span className="label-text text-red-500 text-sm">{errors.items.message}</span>
                        </div>}
                </div>
                <div className="panel-footer text-right">
                    <button 
                        className="btn btn-primary btn-sm mx-4" 
                        type="button"
                        onClick={() => {if(submitRef.current) submitRef.current()}}
                    >
                        <MdOutlineCheck className="text-xl" />Update
                    </button>
                    <NavLink to={RouterTable.products.root} className="btn bg-base-300 btn-sm mt-0">
                        <MdClose className="text-xl" /> Cancel
                    </NavLink>
                </div>
            </div>
            /* END of Main component */
            : <></>
        }
    </>
}

export default EditSet;