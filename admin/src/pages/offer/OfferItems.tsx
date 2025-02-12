import { MouseEvent, useState, useRef, useEffect, MutableRefObject} from "react";
import { MdOutlineAdd, MdDelete, MdEditSquare } from "react-icons/md";
import { CommonProps } from "../../types/Common";

import { OfferInfo, IOfferItem } from "../../store/remote/offers/OfferInfo";

import NewOfferItemDialog from "./dialogs/NewOfferItemDialog";
import EditOfferItemDialog, {HTMLEditOfferDialogElement} from "./dialogs/EditOfferItemDialog";
import DeleteOfferItemDialog from "./dialogs/DeleteOfferItemDialog";
import { EmptyEvent } from "../../types/Events";

export interface OfferItemsProps extends CommonProps {
    offer: MutableRefObject<OfferInfo>,
	onUpdate : EmptyEvent
}

const OfferItems = (props: OfferItemsProps) => {

	let [state, setState] = useState(0);
    let [selectedItem, setSelectedItem] = useState<IOfferItem|null>(null);

    const addModalRef = useRef<HTMLDialogElement>(null);
    const editModalRef = useRef<HTMLEditOfferDialogElement>(null);
    const deleteModalRef = useRef<HTMLDialogElement>(null);

	let render = () => {
		setState(state + Date.now());
		props.onUpdate();
	};

    const onDelete = () => {
        let result = props.offer.current?.deleteItem(selectedItem?.offerItemId ?? 0);
        if(result?.success)
            setSelectedItem(null);
        return result;
    }

	useEffect(() => {
		if(props.offer.current)
			props.offer.current.onRender = render;
	}, []);

    return (
		<>
			<div className="overflow-x-auto">
				<p className="text-sm italic">Describe what your offer have</p>
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
								<th>Content</th>
								<th>Details</th>
							</tr>
						</thead>
						<tbody>
							{/* row 1 */}
							{props.offer.current?.Items.map((item) => (
								<tr
									className={`hover ${item.offerItemId == selectedItem?.offerItemId ? "active" : ""}`}
									data-id={item.offerItemId}
									key={item.offerItemId}
									onClick={(e: MouseEvent<HTMLTableRowElement>) => {
										if(props.offer.current)
											setSelectedItem(
												props.offer.current.get(parseInt(e.currentTarget.getAttribute("data-id") ?? "0"))
											);
									}}
								>
									<td data-label="Content">{item.itemName}</td>
									<td data-label="Details">{item.itemDetails ?? "&nbsp;"}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<NewOfferItemDialog
				ref={addModalRef}
				onChange={(item: string, details: string | undefined) => {
					return props.offer.current.addItem(item, details);
				}}
			/>

			<EditOfferItemDialog
				ref={editModalRef}
				onChange={(item: string, details: string | undefined) => {
					return props.offer.current.updateItem(selectedItem?.offerItemId ?? 0, item, details);
				}}
			/>

			<DeleteOfferItemDialog
				ref={deleteModalRef}
				offerLabel={selectedItem?.itemName ?? ""}
				onChange={onDelete}
			/>
		</>
	);
}

export default OfferItems;