import React from 'react';
import { useController, Control } from 'react-hook-form';
import { CommonProps } from '../../../types/Common';


interface RatingProps extends CommonProps {
    control: Control<any>;
    name: string;
}

const Rating: React.FC<RatingProps> = ({ control, name }) => {
    const {  field: { onChange, value }, } = useController({
        name,
        control,
        defaultValue: 0,
    });

    return (
        <div className="rating gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <input
                key={star}
                type="radio"
                name={name}
                className={`mask mask-star-2 bg-yellow-400`}
                value={star}
                checked={value === star}
                defaultChecked={(star == 1)}
                onChange={() => onChange(star)}
            />
        ))}
        </div>
    );
};

export default Rating;
