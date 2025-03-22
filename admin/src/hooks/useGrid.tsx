// hooks/useGrid.ts
import { useState, useCallback } from "react";
import { StoreStatus } from "../store/remote/Store";
import type { RowSelectedEvent } from "ag-grid-community";

export const useGrid = <T,>(initialData: T[] | null = null) => {
    const [rowData, setRowData] = useState<T[] | null>(initialData);
    const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    const onRowSelected = useCallback((event: RowSelectedEvent<T>) => {
        if (event.node.isSelected()) {
            setSelectedItem(event.node.data || null);
        }
    }, []);

    return {
        rowData,
        setRowData,
        status,
        setStatus,
        selectedItem,
        setSelectedItem,
        onRowSelected,
    };
};