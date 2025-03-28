import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { MdClose, MdOutlineCheck } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import RouterTable from '../../../router/router.table';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { Client, ClientDTO } from '../../../store/remote/clients/Clients.Types';
import { EventResult } from '../../../types/Events';
import { ErrorList, errorToEventResult } from '../../../types/Errors';
import useStores from '../../../hooks/useStores';
import toast from 'react-hot-toast';

interface ClientFormValues {
	name: string;
	place: string;
	phone?: string;
}

const NewClient: React.FC = () => {
	const { register, handleSubmit, setError, formState: { errors }} = useForm<ClientFormValues>();
	const stores = useStores();
	const navigate = useNavigate();

	const add = async (client: ClientDTO) : Promise<EventResult<Client | ErrorList | null>> => {
		try {
			let result = await stores.clientsStore.create(client);
			return result;
		} catch (error) {
			return errorToEventResult(error, "Unable to add the client");
		}
	}

	const onSubmit: SubmitHandler<ClientFormValues> = async (data) => {
		let loadingToast = toast.loading("Creating client...");

        // Remove confirmation from data
        let result = await add(data);
        toast.dismiss(loadingToast);

        // Treat resutl
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

	return (
		<>
		<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: RouterTable.clients.root, label: "Clients" },
					{ url: ".", label: "New" },
				]}
			/>
			<form onSubmit={handleSubmit(onSubmit)} >
				<div className="panel">
					<div className="panel-header">
						<span className="title">New Client</span>
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
							<MdOutlineCheck className="text-xl" />Create
						</button>
						<Link to={RouterTable.roles.root} className="btn bg-base-300 btn-sm mt-0">
							<MdClose className="text-xl" /> Cancel
						</Link>
					</div>
				</div>
			</form>
		</>
	);
};

export default NewClient;