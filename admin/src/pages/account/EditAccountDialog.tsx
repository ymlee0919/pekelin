import { useRef, useImperativeHandle, forwardRef } from "react";
import { CommonProps } from "../../types/Common";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { EventResult } from "../../types/Events";
import { AccountUpdateDTO, UpdatedAccount } from "../../store/remote/accounts/Accounts.Types";
import { ErrorList } from "../../types/Errors";


export interface EditAccountDialogProps extends CommonProps {
	name: string;
    email: string;
	onApply: (account: AccountUpdateDTO) => Promise<EventResult<UpdatedAccount | ErrorList | null>>;
}

const EditAccountDialog = forwardRef( (props : EditAccountDialogProps, ref) => {

    let modalRef = useRef<HTMLDialogElement>(null);

    const {register, reset, setValue, setError, handleSubmit, formState: { errors }} = useForm<AccountUpdateDTO>({
        defaultValues: {
           name: props.name, email: props.email
        }
    });

    useImperativeHandle(ref, () => {
        return {
            showModal: () => {
                reset();
                setValue("name", props.name);
                setValue("email", props.email);
                modalRef.current?.showModal();
            }
        }
    });

    let onSubmit = async (data: AccountUpdateDTO) => {
		let loadingToast = toast.loading("Updating account...");
		let result = await props.onApply(data);
		toast.dismiss(loadingToast);

		if (result.success) {
			modalRef.current?.close();
			toast.success(result.message);
		} else {
			toast.error(result.message);

            if(result.info && result.errorCode === 422) {
                let errors = result.info as ErrorList;

                Object.keys(data).forEach((key: string) => {
                    if(errors.hasOwnProperty(key)) {
                        setError(key as keyof AccountUpdateDTO, { message: errors[key][0] }  )
                    }
                })
            }
		}
	};

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <dialog ref={modalRef} className="modal">
                <div className="modal-box bg-base-200">
                    <h3 className="font-bold text-lg">Update account</h3>
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
                            placeholder="Provide a new name" 
                            className="input input-bordered w-full max-w-xs" />

                        {errors.name && 
                            <div className="label">
                                <span className="label-text text-red-500 text-sm">{errors.name.message}</span>
                            </div>}
                    </label>

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

                    <div className="modal-action">
                        <button type="submit" className="btn btn-info btn-sm mr-5">Apply</button>
                        <a className="btn btn-sm" onClick={()=>modalRef.current?.close()}>Close</a>
                    </div>
                </div>
            </dialog>
        </form>
    </>
});

export default EditAccountDialog;