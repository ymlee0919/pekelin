import { useRef, useImperativeHandle, forwardRef } from "react";
import { CommonProps } from "../../types/Common";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { EventResult } from "../../types/Events";
import { AccountCredentialsUpdateDTO } from "../../store/remote/accounts/Accounts.Types";


export interface CredentialsAccountDialogProps extends CommonProps {
    user: string;
    onChange: (account: AccountCredentialsUpdateDTO) => Promise<EventResult>;
}

const CredentialsAccountDialog = forwardRef( (props : CredentialsAccountDialogProps, ref) => {

    let modalRef = useRef<HTMLDialogElement>(null);

    const {register, reset, setValue, handleSubmit, formState: { errors }} = useForm<AccountCredentialsUpdateDTO>({
        defaultValues: {
            user: props.user
        }
    });

    useImperativeHandle(ref, () => {
        return {
            showModal: () => {
                reset();
                setValue("user", props.user);
                modalRef.current?.showModal();
            }
        }
    });

    let onSubmit = async (data: AccountCredentialsUpdateDTO) => {
		let loadingToast = toast.loading("Updating credentials...");
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
                    <h3 className="font-bold text-lg">Update credentials</h3>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">User: {props.user}</span>
                        </div>
                    </label>
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
                                            required: 'The user identifier is required', 
                                            minLength: {
                                                value: 8, message: 'The name must contains 8 characters minimun'}
                                            }
                                        )} 
                                        type="text" 
                                        placeholder="User identifier" 
                                        className="input input-bordered w-full min-w-full" />
                                </label>
                            </div>

                            <div className="basis-1/2">
                                <label className="form-control w-full min-w-full">
                                    <div className="label">
                                        <span className="label-text">Password</span>
                                    </div>
                                    <input 
                                        {...register('password', { 
                                            minLength: {
                                                value: 8, message: 'The name must contains 8 characters minimun'}
                                            }
                                        )} 
                                        type="password" 
                                        placeholder="Password" 
                                        className="input input-bordered w-full min-w-full" />
                                        <div className="label">
                                            <span className="label-text text-gray-700 text-xs">Provide a new password if you want to change the current</span>
                                        </div>
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

export default CredentialsAccountDialog;