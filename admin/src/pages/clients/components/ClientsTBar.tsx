import { MdAddLink, MdDelete, MdEditSquare, MdOutlineAdd, MdOutlineAssignmentTurnedIn, MdSearch } from "react-icons/md";
import { CommonProps } from "../../../types/Common";
import { Client } from "../../../store/remote/clients/Clients.Types";
import { Link, useNavigate } from "react-router-dom";
import { EmptyEvent, EventResult } from "../../../types/Events";
import RouterTable from "../../../router/router.table";
import RoleBasedComponent from "../../../components/RoleBasedComponent";
import toast from "react-hot-toast";
import useStores from "../../../hooks/useStores";
import { errorToEventResult } from "../../../types/Errors";
import { useState } from "react";

interface ClientsTBarProps extends CommonProps {
    selectedItem: Client | null,
    onClickDelete: EmptyEvent,
    onFilterChange: (entry: string) => void;
}

const ClientsTBar = (props : ClientsTBarProps) => {

    const stores = useStores();
    const navigate = useNavigate();
    let [entry, setEntry] = useState<string>("");
    
    const setFilter = (value: string) => {
        setEntry(value);
        props.onFilterChange(value);
    }

    const createLink = async () : Promise<EventResult> => {
        if(props.selectedItem) {
            try {
                return await stores.clientsStore.createReviewLink(props.selectedItem?.clientId)
            }
            catch (error) {
                return errorToEventResult(error, "Unable to create the link");
            }
        }
        else
            return {
                success: false,
                message: "Client not selected"
            };
    }

    const onCreateLink = async () => {
        let loadingToast = toast.loading('Creating client review link...');
        let result = await createLink();
        toast.dismiss(loadingToast);

        if(result.success) {
            toast.success(result.message);
            navigate(RouterTable.links.root);
        }
        else 
            toast.error(result.message);
    }

    return <>
    <div className="navbar bg-gray-200 min-h-1 p-1">
        <div className="flex flex-wrap w-full">
            <div className="md:w-9/12 sm:w-11/12">
                <Link to={RouterTable.clients.new} className="btn btn-ghost text-slate-500 btn-sm text-sm mr-2 rounded-none">
                    <MdOutlineAdd /> <span className="hidden md:block">Add</span>
                </Link>

                <Link
                    className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-1 rounded-none ${
                        props.selectedItem ?? "btn-disabled"
                    }`}
                    to={RouterTable.clients.edit(props.selectedItem?.clientId || 0)}
                >
                    <MdEditSquare /> <span className="hidden md:block">Edit</span>
                </Link>

                <a
                    className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-1 rounded-none ${
                        props.selectedItem ?? "btn-disabled"
                    }`}
                    onClick={props.onClickDelete}
                >
                    <MdDelete /> <span className="hidden md:block">Delete</span>
                </a>

                <RoleBasedComponent roles={['Review']}>
                <a
                    className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-1 rounded-none ${
                        props.selectedItem ?? "btn-disabled"
                    }`}
                    onClick={onCreateLink}
                >
                    <MdAddLink /> <span className="hidden md:block">Review link</span>
                </a>
                </RoleBasedComponent>

                <RoleBasedComponent roles={['Orders']}>
                <Link
                    className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-1 rounded-none ${
                        props.selectedItem ?? "btn-disabled"
                    }`}
                    to={RouterTable.orders.newForClient(props.selectedItem?.clientId || 0)}
                >
                    <MdOutlineAssignmentTurnedIn /> <span className="hidden md:block">Order</span>
                </Link>
                </RoleBasedComponent>
            </div>
            <div className="md:w-3/12 sm:w-11/12">
                <div className="z-10 border-b md:pt-0 pt-2">
                    <label className="input input-sm input-bordered flex items-center gap-2">
                    <MdSearch className="w-4 h-4 opacity-70" />
                    <input
                        type="text"
                        className="grow"
                        placeholder="Search client..."
                        value={entry}
                        onChange={(e) => setFilter(e.target.value)}
                        autoFocus
                    />
                    </label>
                </div>
            </div>
        </div>
    </div>

    </>
}

export default ClientsTBar;