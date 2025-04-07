import { MdSearch } from "react-icons/md";
import { CommonProps } from "../../../types/Common";
import { useState } from "react";

interface ClientsFilterBarProps extends CommonProps {
    onFilterChange: (entry: string) => void;
}

const ClientsFilterBar = (props : ClientsFilterBarProps) => {

    let [entry, setEntry] = useState<string>("");

    const setFilter = (value: string) => {
        setEntry(value);
        props.onFilterChange(value);
    }

    return <>
    <div className="navbar bg-gray-200 min-h-1 p-1">
        <div className="z-10 border-b">
            <label className="input input-sm input-bordered flex items-center gap-2">
            <MdSearch className="w-4 h-4 opacity-70" />
            <input
                type="text"
                className="grow"
                placeholder="Search client..."
                value={entry}
                onChange={(e) => setFilter(e.target.value)}
            />
            </label>
        </div>
    </div>

    </>
}

export default ClientsFilterBar;