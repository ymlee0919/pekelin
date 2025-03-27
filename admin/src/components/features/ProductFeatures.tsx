import { MouseEvent, useState, useRef, MutableRefObject} from "react";
import { MdOutlineAdd, MdDelete, MdEditSquare } from "react-icons/md";
import { CommonProps } from "../../types/Common";

import { ProductFeaturesList, IProductFeature, FeatureStatus } from "../../store/remote/products/ProductFeatures";

import NewFeatureDialog from "./NewFeatureDialog";
import EditOfferItemDialog, {HTMLEditFeatureDialogElement} from "./EditFeatureDialog";
import DeleteOfferItemDialog from "./DeleteFeatureDialog";
import { EmptyEvent } from "../../types/Events";

export interface ProductFeaturesProps extends CommonProps {
    features: MutableRefObject<ProductFeaturesList>,
	onUpdate: EmptyEvent
}

const ProductFeatures = (props: ProductFeaturesProps) => {

    let [selectedItem, setSelectedItem] = useState<IProductFeature|null>(null);

    const addModalRef = useRef<HTMLDialogElement>(null);
    const editModalRef = useRef<HTMLEditFeatureDialogElement>(null);
    const deleteModalRef = useRef<HTMLDialogElement>(null);

	const onAdd = (title: string, content: string | undefined) => {
		let result = props.features.current.addItem(title, content);
		if(result?.success)
			setSelectedItem(null);
		props.onUpdate();
		return result;
	}

	const onUpdate = (title: string, details: string | undefined) => {
		let result = props.features.current.updateItem(selectedItem?.featureId ?? 0, title, details);
		if(result?.success)
			setSelectedItem(null);
		props.onUpdate();
		return result;
	}
	
    const onDelete = () => {
        let result = props.features.current?.deleteItem(selectedItem?.featureId ?? 0);
        if(result?.success)
            setSelectedItem(null);
		props.onUpdate();
        return result;
    }

    return (
		<>
			<div className="overflow-x-auto">
				<p className="text-sm italic">Product features</p>
				<div className="border-2 border-solid border-gray-300">
					<div className="navbar bg-gray-300 min-h-1 p-1">
						<a
							className="btn btn-ghost text-slate-500 btn-sm text-sm mr-2 rounded-none"
							onClick={() => addModalRef.current?.showModal()}
						>
							<MdOutlineAdd /> Add
						</a>

						<a
							className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
								selectedItem ?? "btn-disabled"
							}`}
							onClick={() => {
								editModalRef.current?.setValues(selectedItem);
								editModalRef.current?.showModal();
							}}
						>
							<MdEditSquare /> Edit
						</a>

						<a
							className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
								selectedItem ?? "btn-disabled"
							}`}
							onClick={() => deleteModalRef.current?.showModal()}
						>
							<MdDelete /> Delete
						</a>
					</div>
					<table className="table table-grid">
						{/* head */}
						<thead>
							<tr>
								<th>Feature</th>
								<th>Details</th>
							</tr>
						</thead>
						<tbody>
							{/* row 1 */}
							{props.features.current?.list.map((item) => (
								item.status == FeatureStatus.Deleted ||
								<tr
									className={`hover ${item.featureId == selectedItem?.featureId ? "bg-base-300 font-semibold" : ""}`}
									data-id={item.featureId}
									key={item.featureId}
									onClick={(e: MouseEvent<HTMLTableRowElement>) => {
										if(props.features.current)
											setSelectedItem(
												props.features.current.get(parseInt(e.currentTarget.getAttribute("data-id") ?? "0"))
											);
									}}
								>
									<td data-label="Content">{item.title}</td>
									<td data-label="Details">{item.content ?? "&nbsp;"}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<NewFeatureDialog
				ref={addModalRef}
				onChange={onAdd}
			/>

			<EditOfferItemDialog
				ref={editModalRef}
				onChange={onUpdate}
			/>

			<DeleteOfferItemDialog
				ref={deleteModalRef}
				feature={selectedItem?.title ?? ""}
				onChange={onDelete}
			/>
		</>
	);
}

export default ProductFeatures;