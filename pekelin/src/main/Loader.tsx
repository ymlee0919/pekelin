import { useEffect, useState } from "react";
import { CommonProps } from "../types/Common";
import Loading from "../components/main/Loading";
import Error from "../components/main/Error";
import HttpProvider from "../services/HttpProvider";
import { DataBase } from "../database/database.types";
import db from "../database/db";

export enum StoreStatus {
    EMPTY,   // For empty store
    LOADING, // Loading data
    READY,   // Information ready
    ERROR    // Error loading information
}

const Loader = (props: CommonProps) => {
    
    const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    const [error, setError] = useState<any>();

    useEffect(() => {
        setStatus(StoreStatus.LOADING);

        //HttpProvider.get<any, DataBase>('/info/db.json').then((database) => {
        HttpProvider.get<any, DataBase>('/app').then((database) => {
            db.setData(database);
            setStatus(StoreStatus.READY);
        }).catch((reason) => {
            setError(reason);
            setStatus(StoreStatus.ERROR);
        })
    }, []);

    return <>
        {status == StoreStatus.LOADING ? <Loading /> : ""}
        {status == StoreStatus.ERROR ? <Error text={error} /> : ""}
        {status == StoreStatus.READY ? props.children : ""}
    </>
}

export default Loader;