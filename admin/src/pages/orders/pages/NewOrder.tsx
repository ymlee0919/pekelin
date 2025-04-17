import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Link, useSearchParams  } from 'react-router-dom';
import RouterTable from '../../../router/router.table';
import { StoreStatus } from '../../../store/remote/Store';
import useStores from '../../../hooks/useStores';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Loading from '../../../components/Loading';
import ErrorMessage from '../../../components/ErrorMessage';
import { MdArrowDropDown, MdSearch } from 'react-icons/md';
import toast from 'react-hot-toast';
import { EventResult } from '../../../types/Events';
import { ErrorList, errorToEventResult } from '../../../types/Errors';
import { addOrder } from "../../../store/local/slices/globalSlice";
import { useDispatch } from "react-redux"; 

interface OrderFormData {
    clientId: number;
    title: string;
    details?: string;
    variantId?: number;
    productImage?: string;
}

const NewOrder = () => { 

    const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    const [loadingError, setLoadingError] = useState<string>("");
	const [selectedImage, setSelectedImage] = useState("");
    const [productSearchTerm, setProductSearchTerm] = useState("");
    const [clientSearchTerm, setClientSearchTerm] = useState("");

    const { register, handleSubmit, formState: { errors }, watch, setValue, setError} = useForm<OrderFormData>();
    const variantId = watch("variantId");
    const clientId = watch("clientId");

    const stores = useStores();
    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();
    const client = searchParams.get("client");

    const onSubmit: SubmitHandler<OrderFormData> = async (data: OrderFormData) => {
        
        let loadingToast = toast.loading("Creating order...");
        let result : EventResult;
        try {
            result = await stores.ordersStore.create(data);
        } catch (error)
        {
            result = errorToEventResult(error, "Unable to create the order");
        }

		toast.dismiss(loadingToast);

        if (result.success) {
			toast.success(result.message);

            setValue("title", "");
            setValue("details", "");
            setValue("productImage", "");
            setValue("variantId", 0);
            setProductSearchTerm("");
            setClientSearchTerm("");
            setSelectedImage("");
            
            dispatch(addOrder());

		} else {
			toast.error(result.message);

            if(result.info && result.errorCode === 422) {
                let errors = result.info as ErrorList;

                Object.keys(data).forEach((key: string) => {
                    if(errors.hasOwnProperty(key)) {
                        setError(key as keyof OrderFormData, { message: errors[key][0] }  )
                    }
                })
            }
		}

        try {
        } catch (err) {
        }
    };

    const load = () => {
        setStatus(StoreStatus.LOADING);

        // Load clients
        stores.clientsStore.load(null).then(
			(newStatus: StoreStatus) => {
                if(newStatus == StoreStatus.ERROR) {
                    setStatus(newStatus);
                    setLoadingError(stores.clientsStore.lastError);
                } else {
                    // Load products
                    stores.variantsListStore.load(null).then(
                        (listStatus: StoreStatus) => {
                            if(listStatus == StoreStatus.ERROR) {
                                setLoadingError(stores.variantsListStore.lastError);
                                
                            }
                            setStatus(listStatus);
                            if(client != null)
                                setValue("clientId", parseInt(client));    
                        }
                    )
                }
				
			}
		);
    }
    
	useEffect(() => {
		load();
		return () => {stores.clientsStore.release()}
	}, []);

    return (
        <>
        <Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: RouterTable.orders.root, label: "Orders" },
                    { url: ".", label: "New" },
				]}
			/>

			{status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <ErrorMessage text={loadingError} /> : ""}

			{status == StoreStatus.READY ? (
				/** Main component */
				<>

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="panel lg:mx-5 shadow-md">
                <div className="panel-header panel-header-lighten">
                    <span className="title">New order</span>
                </div>
                <div className="panel-content">
                    <div className="flex flex-wrap gap-5 pb-3">
                        <div className="md:w-3/12 w-11/12">
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">Client</span>
                                </div>
                                <div className="dropdown w-full">
                                    <label tabIndex={0} className="btn btn-outline w-full justify-between">
                                        {clientId ? stores.clientsStore.content?.find(item => item.clientId === clientId)?.name || "Select" : "Select client"}
                                        <MdArrowDropDown className="w-4 h-4" />
                                    </label>
                                    <div
                                        tabIndex={0}  
                                        className='dropdown-content shadow bg-base-100 rounded-box w-full z-50'
                                        style={{ maxHeight: "300px", overflowX: "auto" }}
                                    >
                                        <div className="p-2 sticky top-0 bg-base-100 z-10 border-b">
                                            <label className="input input-sm input-bordered flex items-center gap-2">
                                            <MdSearch className="w-4 h-4 opacity-70" />
                                            <input
                                                type="text"
                                                className="grow"
                                                placeholder="Search client..."
                                                value={clientSearchTerm}
                                                onChange={(e) => setClientSearchTerm(e.target.value)}
                                                autoFocus
                                            />
                                            </label>
                                        </div>
                                        <ul>
                                            {stores.clientsStore.content?.filter((item) => {
                                                    if(clientSearchTerm.length <= 2)
                                                        return true;
                                                    return item.name.toLowerCase().includes(clientSearchTerm.toLowerCase())
                                                }
                                                ).map((item) => (
                                                <li key={item.clientId} className="hover:bg-base-200" onClick={() => {
                                                    setValue("clientId", item.clientId);
                                                    
                                                }}>
                                                    <a>
                                                        <div className="flex flex-col p-2">
                                                            <span className="font-medium">{item.name}</span>
                                                            <span className="text-xs text-gray-500">{item.place}</span>
                                                        </div>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div className="md:w-8/12 w-11/12">
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">Title</span>
                                </div>
                                <input
                                    {...register("title", {
                                        required: 'The title name is required',
                                        minLength: {
                                            value: 5,
                                            message: "The title name must contains 5 characters minimun",
                                        },
                                    })}
                                    type="text"
                                    placeholder="Order title"
                                    className="input input-bordered"
                                />

                                {errors.title && (
                                    <div className="label">
                                        <span className="label-text text-red-500 text-sm">{errors.title.message}</span>
                                    </div>
                                )}
                            </label>
                        </div>
                        <div className="w-11/12">
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text">Details</span>
                                </div>
                                <textarea 
                                    className="textarea textarea-bordered"
                                    placeholder="Details"
                                    {...register("details", {   
                                        minLength: {
                                            value: 10,
                                            message: "The details name must contains 10 characters minimun",
                                        },
                                    })}>

                                </textarea>
                                {errors.details && (
                                    <div className="label">
                                        <span className="label-text text-red-500 text-sm">{errors.details.message}</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                    <fieldset>
                        <legend>Product</legend>
                        <div className="flex flex-wrap gap-2 lg:gap-5">
                            <div className="md:w-2/12 w-10/12">
                                {!!selectedImage ? (
                                    <div className="avatar">
                                        <div className="w-32 rounded">
                                            <img src={(import.meta.env.VITE_IMG_URL ?? '') + selectedImage} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-base-300 grid h-32 w-32 place-items-center">No image</div>
                                )}
                            </div>
                            <div className="md:w-8/12 w-full">
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text">Product</span>
                                    </div>
                                    <div className="dropdown dropdown-top w-full">
                                        <label tabIndex={0} className="btn btn-outline w-full justify-between">
                                            {variantId ? stores.variantsListStore.content?.find(variant => variant.variantId === variantId)?.name || "Select" : "Select Product"}
                                            <MdArrowDropDown className="w-4 h-4" />
                                        </label>
                                        <div
                                            tabIndex={0}  
                                            className='dropdown-content shadow bg-base-100 rounded-box w-full'
                                            style={{ maxHeight: "300px", overflowX: "auto" }}
                                        >
                                            
                                            <ul>
                                                {stores.variantsListStore.content?.filter((variant) => {
                                                        if(productSearchTerm.length <= 2)
                                                            return true;
                                                        return variant.name.toLowerCase().includes(productSearchTerm.toLowerCase())
                                                    }
                                                    ).map((variant) => (
                                                    <li key={variant.variantId} className="hover:bg-base-200" onClick={() => {
                                                        setValue("variantId", variant.variantId);
                                                        setSelectedImage(variant.remoteUrl);
                                                        setValue("productImage", variant.remoteUrl);
                                                    }}>
                                                        <a>
                                                            <div className="flex flex-col p-2">
                                                                <span className="font-medium">{variant.name}</span>
                                                                <span className="text-xs text-gray-500">{variant.category} / {variant.product}</span>
                                                            </div>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="p-2 sticky bottom-0 bg-base-100 z-10 border-b">
                                                <label className="input input-sm input-bordered flex items-center gap-2">
                                                <MdSearch className="w-4 h-4 opacity-70" />
                                                <input
                                                    type="text"
                                                    className="grow"
                                                    placeholder="Search products..."
                                                    value={productSearchTerm}
                                                    onChange={(e) => setProductSearchTerm(e.target.value)}
                                                    autoFocus
                                                />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text">Image</span>
                                    </div>
                                    <input
                                        type="text"
                                        className="input w-full"
                                        {...register("productImage")}
                                        readOnly
                                    />
                                </label>
                            </div>
                        </div>
                        
                    </fieldset>
                </div>
                <div className="panel-footer text-right">
                    <button type="submit" className="btn btn-info btn-sm mr-5">Create</button>
                    <Link className="btn btn-sm" to={RouterTable.orders.root}>Cancel</Link>
                </div>
            </div>
        </form>
        </>
        /** END OF Main component */
			) : null}
		</>
	);
}

export default NewOrder;