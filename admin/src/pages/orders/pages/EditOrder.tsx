import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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

interface OrderFormData {
    clientId: number;
    title: string;
    details?: string;
    variantId?: number;
    productImage?: string;
}

const EditOrder = () => { 

    const { orderId } = useParams<{ orderId: string }>();
    const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    const [loadingError, setLoadingError] = useState<string>("");
	const [selectedImage, setSelectedImage] = useState("");
    const [productSearchTerm, setProductSearchTerm] = useState("");
    const [clientSearchTerm, setClientSearchTerm] = useState("");

    const { register, handleSubmit, formState: { errors }, watch, reset, setValue, setError} = useForm<OrderFormData>();
    const variantId = watch("variantId");
    const clientId = watch("clientId");
    const navigate = useNavigate();

    const stores = useStores();

    const onSubmit: SubmitHandler<OrderFormData> = async (data: OrderFormData) => {
        
        let loadingToast = toast.loading("Updating order...");
        let result : EventResult;
        try {
            result = await stores.ordersStore.update(orderId || 0, data);
        } catch (error)
        {
            result = errorToEventResult(error, "Unable to update the order");
        }

		toast.dismiss(loadingToast);

        if (result.success) {
			toast.success(result.message);
            navigate(RouterTable.orders.root);
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
    };

    const load = async () => {

        setStatus(StoreStatus.LOADING);

        // Load clients
        let status = await stores.clientsStore.load(null);
        if(status == StoreStatus.ERROR){
            setStatus(status);
            setLoadingError(stores.clientsStore.lastError);
            return;
        }

        status = await stores.variantsListStore.load(null);
        if(status == StoreStatus.ERROR) {
            setLoadingError(stores.variantsListStore.lastError);
            return;
        }

        try {
            let order = await stores.ordersStore.get(orderId || 0);
            setStatus(StoreStatus.READY);

            reset({
                clientId: order.clientId,
                title: order.title,
                details: order.details,
                productImage: order.productImage
            });

            setValue("title", order.title);
            setValue("details", order.details);
            setValue("productImage", order.productImage);

            setSelectedImage(order.productImage || '');
            
            setProductSearchTerm("");
            setClientSearchTerm("");
        } catch (error) {
            setStatus(StoreStatus.ERROR);
            setLoadingError(error instanceof Error ? error.message : 'Unable to load the requested order');
        }
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
                    { url: ".", label: "Edit" },
				]}
			/>

			{status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <ErrorMessage text={loadingError} /> : ""}

			{status == StoreStatus.READY ? (
				/** Main component */
				<>

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="panel mx-5 shadow-md">
                <div className="panel-header panel-header-lighten">
                    <span className="title">Update order</span>
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
                            {/*<label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Client</span>
                                </div>
                                <select 
                                    {...register("clientId")} 
                                    className="select select-bordered"
                                >
                                        {stores.clientsStore.content?.map((client: Client) => {
                                            return <option key={client.clientId} value={client.clientId}>{client.name}</option>
                                        })}
                                </select>

                                {errors.clientId && (
                                    <div className="label">
                                        <span className="label-text text-red-500 text-sm">{errors.clientId.message}</span>
                                    </div>
                                )}
                            </label>
                            */}
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
                        <div className="flex flex-wrap gap-5">
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
                            <div className="md:w-8/12 w-11/12">
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
                                            {stores.variantsListStore.content?.filter((variant) => 
                                                {
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
                    <button type="submit" className="btn btn-info btn-sm mr-5">Apply</button>
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

export default EditOrder;