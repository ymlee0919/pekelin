import { forwardRef, useRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { CommonProps } from "../../types/Common";

export interface DeleteServiceDialogProps extends CommonProps {
    imageUrl: string | undefined;
	category: string | undefined;
    onChange: () => void;
}

const DeleteCategoryDialog = forwardRef( (props: DeleteServiceDialogProps, ref) => {

    let modalRef = useRef<HTMLDialogElement>(null);
    const { handleSubmit } = useForm();

    useImperativeHandle(ref, () => {
            return {
                showModal: () => {
                    modalRef.current?.showModal();
                },
                close: () => {
                    modalRef.current?.close();
                }
            }
        });

        const onSubmit = async () => { 
            props.onChange();           
        };

    return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<dialog ref={modalRef} className="modal">
					<div className="modal-box">
						<h3 className="font-bold text-lg">Delete category</h3>
						<label className="form-control w-full max-w-xs">
							<div className="label">
								<span className="label-text">{props.category}</span>
							</div>
						</label>
						<div className="avatar">
							<div className="w-32 rounded">
								<img
									src={props.imageUrl && `http://localhost:3000/images/categories/${props.imageUrl}`}
								/>
							</div>
						</div>

						<p>Are you sure you want to delete this category?</p>
						<div className="modal-action">
							<button type="submit" className="btn btn-error btn-sm mr-5">
								Yes, delete
							</button>
							<a className="btn btn-sm" onClick={() => modalRef.current?.close()}>
								No, close
							</a>
						</div>
					</div>
				</dialog>
			</form>
		</>
	);

})

export default DeleteCategoryDialog;