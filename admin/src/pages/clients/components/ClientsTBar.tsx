import { MdAddLink, MdDelete, MdEditSquare, MdOutlineAdd } from "react-icons/md";
import { CommonProps } from "../../../types/Common";
import { Client } from "../../../store/remote/clients/Clients.Types";
import { Link, useNavigate } from "react-router-dom";
import { EmptyEvent, EventResult } from "../../../types/Events";
import RouterTable from "../../../router/router.table";
import RoleBasedComponent from "../../../components/RoleBasedComponent";
import toast from "react-hot-toast";
import useStores from "../../../hooks/useStores";
import { errorToEventResult } from "../../../types/Errors";

interface ClientsTBarProps extends CommonProps {
    selectedItem: Client | null,
    onClickDelete: EmptyEvent
}

const ClientsTBar = (props : ClientsTBarProps) => {

    const stores = useStores();
    const navigate = useNavigate();

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
        <div className="flex-1">
            <Link to={RouterTable.clients.new} className="btn btn-ghost text-slate-500 btn-sm text-sm mr-2 rounded-none">
                <MdOutlineAdd /> Add
            </Link>

            <Link
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-1 rounded-none ${
                    props.selectedItem ?? "btn-disabled"
                }`}
                to={RouterTable.clients.edit(props.selectedItem?.clientId || 0)}
            >
                <MdEditSquare /> Edit
            </Link>

            <a
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-1 rounded-none ${
                    props.selectedItem ?? "btn-disabled"
                }`}
                onClick={props.onClickDelete}
            >
                <MdDelete /> Delete
            </a>

            <RoleBasedComponent roles={['Review']}>
            <a
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-1 rounded-none ${
                    props.selectedItem ?? "btn-disabled"
                }`}
                onClick={onCreateLink}
            >
                <MdAddLink /> Review link
            </a>
            </RoleBasedComponent>
        </div>
    </div>

    </>
}

export default ClientsTBar;