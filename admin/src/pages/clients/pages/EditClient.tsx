import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { MdClose, MdOutlineCheck } from 'react-icons/md';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RouterTable from '../../../router/router.table';
import useStores from '../../../hooks/useStores';
import { StoreStatus } from '../../../store/remote/Store';
import { Client } from '../../../store/remote/clients/Clients.Types';
import Loading from '../../../components/Loading';
import ErrorMessage from '../../../components/ErrorMessage';
import Breadcrumbs from '../../../components/Breadcrumbs';
import toast from 'react-hot-toast';
import { EventResult } from '../../../types/Events';
import { ErrorList, errorToEventResult } from '../../../types/Errors';

interface ClientFormValues {
	name: string;
	place: string;
	phone?: string;
}

const NewClient: React.FC = () => {
	const { register, handleSubmit, setError, setValue, formState: { errors }} = useForm<ClientFormValues>();
	const { clientId } = useParams<{ clientId: string }>();
  	const navigate = useNavigate();
	const stores = useStores();

	const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
	const [error, setLoadingError] = useState<string>("");

	const onSubmit: SubmitHandler<ClientFormValues> = async (data) => {

        let loadingToast = toast.loading("Updating client...");
        let result : EventResult;
        try {
            result = await stores.clientsStore.update(clientId || 0, data);
        } catch (error)
        {
            result = errorToEventResult(error, "Unable to update the client");
        }

		toast.dismiss(loadingToast);

        if (result.success) {
			toast.success(result.message);
            navigate(RouterTable.clients.root);
		} else {
			toast.error(result.message);

            if(result.info && result.errorCode === 422) {
                let errors = result.info as ErrorList;

                Object.keys(data).forEach((key: string) => {
                    if(errors.hasOwnProperty(key)) {
                        setError(key as keyof ClientFormValues, { message: errors[key][0] }  )
                    }
                })
            }
		}
	};


	const load = () => {
		setStatus(StoreStatus.LOADING);
		
		stores.clientsStore.get(parseInt(clientId || '0')).then((client: Client) => {
			setStatus(StoreStatus.READY)
			setValue("name", client.name);
			setValue("place", client.place);
			setValue("phone", client.phone);
		}).catch(
			(reason) => { {
					setStatus(StoreStatus.ERROR);
					setLoadingError(reason instanceof Error ? reason.message : "Unable to load the selected client")
				}
			}	
		) 
	}

	useEffect(() => {
		if(typeof clientId == "undefined") {
			setLoadingError("Invalid client");
			setStatus(StoreStatus.ERROR)
		} 
		else 
			load();

		return () => {stores.permissionsStore.release()}
	},[]);

	return (
		<>
			<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: RouterTable.clients.root, label: "Clients" },
					{ url: ".", label: "Edit" },
				]}
			/>
			
            {status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <ErrorMessage text={error} /> : ""}

			{status == StoreStatus.READY ? (
                <>
			<form onSubmit={handleSubmit(onSubmit)} >
				<div className="panel lg:mx-5 shadow-md">
					<div className="panel-header panel-header-lighten">
						<span className="title">Update client</span>
					</div>
					<div className="panel-content">
						<div className="flex flex-wrap gap-3">
							{/* Name Field */}
							<div className="lg:w-4/12 sm:w-11/12">
								<div className="form-control mb-4">
									<label className="label">
										<span className="label-text">Name</span>
									</label>
									<input
										type="text"
										placeholder="Client Name"
										className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
										{...register('name', { required: 'Name is required', minLength: { value: 3, message: 'Name must be at least 3 characters' } })}
									/>
									{errors.name && <span className="text-error text-sm">{errors.name.message}</span>}
								</div>
							</div>

							{/* Place Field */}
							<div className="lg:w-4/12 sm:w-11/12">
								<div className="form-control mb-4">
									<label className="label">
										<span className="label-text">Place</span>
									</label>
									<input
										type="text"
										placeholder="Client Place"
										className={`input input-bordered ${errors.place ? 'input-error' : ''}`}
										{...register('place', { required: 'Place is required', minLength: { value: 5, message: 'Place must be at least 5 characters' } })}
									/>
									{errors.place && <span className="text-error text-sm">{errors.place.message}</span>}
								</div>
							</div>

							{/* Phone Field */}
							<div className="lg:w-3/12 sm:w-11/12">
								<div className="form-control mb-4">
									<label className="label">
										<span className="label-text">Phone (Optional)</span>
									</label>
									<input
										type="text"
										placeholder="Phone Number"
										className="input input-bordered"
										{...register('phone', {
											pattern: {
											value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
											message: 'Phone number is invalid',
											},
										})}
							
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="panel-footer text-right">
						<button className="btn btn-primary btn-sm mx-4" type="submit">
							<MdOutlineCheck className="text-xl" />Apply
						</button>
						<Link to={RouterTable.clients.root} className="btn bg-base-300 btn-sm mt-0">
							<MdClose className="text-xl" /> Cancel
						</Link>
					</div>
				</div>
			</form>
			</>) : null }
		</>
	);
};

export default NewClient;