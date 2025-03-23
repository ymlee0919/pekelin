import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Rating from "../Rating";
import { useState } from 'react';
import HttpProvider from "../../services/HttpProvider";
import { CommonProps } from '../../types/Common';

interface ReviewFormProps extends CommonProps {
    url: string,
    clientName: string
}

interface ReviewFormValues {
    rate: number;
    comment: string;
}

enum FormStatus {
    Ready, Sending, Success
}

const ReviewForm = (props: ReviewFormProps) => {

    const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.Ready);
    const { handleSubmit, control } = useForm<ReviewFormValues>();

    const onSubmit: SubmitHandler<ReviewFormValues> = (data: ReviewFormValues) => {
        setFormStatus(FormStatus.Sending);

        HttpProvider.post<ReviewFormValues, boolean>('/review/' + props.url, data).then(() => {
            setFormStatus(FormStatus.Success);
        }).catch(() => {
            setFormStatus(FormStatus.Success);
        })
    };

    return <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pt-24 pb-10 bg-base-200 px-5 text-gray-600">
            <p className='text-sm pt-3 '>
                Hola {props.clientName}. <br></br><br></br> Es un gusto tenerte de vuelta. Nos gustaría saber cómo te sentiste con nosotros y cuánto te gustó nuestro producto. Será rápido.
            </p>
            <label className="form-control w-full max-w-xs py-7">
                <div className="label">
                    <span className="label-text text-gray-600">Qué puntuación nos darías?</span>
                </div>
                <Controller
                    name="rate"
                    control={control}
                    defaultValue={1}
                    render={({ field }) => <Rating {...field} control={control}/>}
                    />
            </label>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text text-gray-600">Pudieras dejarnos algún comentario?</span>
                </div>
                <Controller
                    name="comment"
                    control={control}
                    render={({ field }) => (
                        <textarea
                        {...field}
                        className="textarea textarea-bordered"
                        placeholder="Su comentario"
                        disabled={formStatus == FormStatus.Success}
                        />
                    )}
                />
            </label>
            <div className='text-center mt-5'>
            {
                (formStatus != FormStatus.Success) ?
                    <button type="submit" disabled={formStatus == FormStatus.Sending} className="btn btn-primary btn-sm ">
                        {formStatus == FormStatus.Ready ? 'Aceptar' : 'Procesando...'}
                    </button>
                : <>
                    <p className='text-sm'>
                        Hemos guardado su reseña.<br></br>
                        Gracias por su comentario y por su tiempo.
                    </p>
                </>
            }
            </div>
            
            
        </div>
    </form>
}

export default ReviewForm;