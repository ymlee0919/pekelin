import { useRef, useImperativeHandle, forwardRef } from "react";
import { CommonProps } from "../../types/Common";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { EventResult } from "../../types/Events";
import { AccountCreationDTO } from "../../store/remote/accounts/Accounts.Types";

export interface NewAccountDialogProps extends CommonProps {
    onChange: (account: AccountCreationDTO) => Promise<EventResult>;
}

const NewAccountDialog = forwardRef( (props : NewAccountDialogProps, ref) => {

    let modalRef = useRef<HTMLDialogElement>(null);

    const {register, reset, handleSubmit, formState: { errors }} = useForm<AccountCreationDTO>({
        defaultValues: {
            user: '', name: '', email: ''
        }
    });

    useImperativeHandle(ref, () => {
        return {
            showModal: () => {
                reset();
                modalRef.current?.showModal();
            }
        }
    });

    let onSubmit = async (data: AccountCreationDTO) => {
		let loadingToast = toast.loading("Creating account...");
		let result = await props.onChange(data);
		toast.dismiss(loadingToast);

		if (result.success) {
			modalRef.current?.close();
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	};

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <dialog ref={modalRef} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">New account</h3>
                    <div className="flex flex-row gap-3">
                        <div className="basis-5/12">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Name</span>
                                </div>
                                <input 
                                    {...register("name", {
                                        required: 'The name is required', 
                                        minLength: {
                                            value: 8, message: 'The name must contains 8 characters minimun'}
                                        }
                                    )} 
                                    type="text" 
                                    placeholder="Your name" 
                                    className="input input-bordered w-full max-w-xs" />

                                {errors.name && 
                                    <div className="label">
                                        <span className="label-text text-red-500 text-sm">{errors.name.message}</span>
                                    </div>}
                            </label>
                        </div>
                        <div className="basis-7/12">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Email</span>
                                </div>
                                <input 
                                    {...register("email", {
                                        required: 'The email is required'}
                                    )} 
                                    type="email" 
                                    placeholder="Personal email" 
                                    className="input input-bordered w-full max-w-xs" />

                                {errors.email && 
                                    <div className="label">
                                        <span className="label-text text-red-500 text-sm">{errors.email.message}</span>
                                    </div>}
                            </label>
                        </div>
                    </div>
                    <br></br>
                    <fieldset>
                        <legend>Credentials</legend>
                        <div className="flex flex-row gap-3">
							<div className="basis-1/2">
                                <label className="form-control w-full min-w-full">
                                    <div className="label">
                                        <span className="label-text">User</span>
                                    </div>
                                    <input 
                                        {...register('user', { 
                                            required: 'The user is required', 
                                            minLength: {
                                                value: 5, message: 'The user must contains 5 characters minimun'}
                                            }
                                        )} 
                                        type="text" 
                                        placeholder="User identifier" 
                                        className="input input-bordered w-full min-w-full" />
                                    {errors.user && 
                                        <div className="label">
                                            <span className="label-text text-red-500 text-sm">{errors.user.message}</span>
                                        </div>}
                                </label>
                            </div>

                            <div className="basis-1/2">
                                <label className="form-control w-full min-w-full">
                                    <div className="label">
                                        <span className="label-text">Password</span>
                                    </div>
                                    <input 
                                        {...register('password', { 
                                            required: 'The password is required', 
                                            minLength: {
                                                value: 8, message: 'The name must contains 8 characters minimun'}
                                            }
                                        )} 
                                        type="password" 
                                        placeholder="Password" 
                                        className="input input-bordered w-full min-w-full" />
                                        {errors.password && 
                                            <div className="label">
                                                <span className="label-text text-red-500 text-sm">{errors.password.message}</span>
                                            </div>}
                                </label>
                            </div>
							
                        </div>
                    </fieldset>
                    
                    <div className="modal-action">
                        <button type="submit" className="btn btn-info btn-sm mr-5">Add</button>
                        <a className="btn btn-sm" onClick={()=>modalRef.current?.close()}>Close</a>
                    </div>
                </div>
            </dialog>
        </form>
    </>
});

export default NewAccountDialog;