// components/AgGridWrapper.tsx
import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridOptions, RowDoubleClickedEvent, RowSelectedEvent, RowSelectionOptions, Theme } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

interface AgGridWrapperProps<T, > {
	rowData: T[] | null;
	columnDefs: ColDef<T>[];
	gridOptions?: GridOptions<T>;
	onRowSelected?: (event: RowSelectedEvent<T>) => void;
	onRowDoubleClicked?: (event: RowDoubleClickedEvent<T>) => void;
	height?: string;
}

const myTheme = themeQuartz.withParams({
    wrapperBorderRadius: '0px',
	menuBorder: '0px',
    headerTextColor: "#808080",
    selectedRowBackgroundColor: "#e6e6e6",
    fontSize: "13px",
    rowHoverColor: "#f6f6f6",
    backgroundColor: "#f3f4f6",
});

export const AgGridWrapper = <T,>({
	rowData,
	columnDefs,
	gridOptions,
	onRowSelected,
	onRowDoubleClicked,
	height = "420px",
}: AgGridWrapperProps<T>) => {

	const defaultColDef = useMemo<ColDef>(
		() => ({
			flex: 2,
			autoHeight: true,
			cellClass: "text-gray-500",
		}),
		[]
	);

	const rowSelection = useMemo<RowSelectionOptions>(
		() => ({
			mode: "singleRow",
			checkboxes: false,
			enableClickSelection: true,
		}),
		[]
	);

	const theme = useMemo<Theme>(() => myTheme, []);

	return (
		<div className="ag-theme-quartz" style={{ height, width: "100%" }}>
			<AgGridReact
				rowData={rowData}
				columnDefs={columnDefs}
				gridOptions={gridOptions}
				defaultColDef={defaultColDef}
				rowSelection={rowSelection}
				onRowSelected={onRowSelected}
				onRowDoubleClicked={onRowDoubleClicked}
				theme={theme}
			/>
		</div>
	);
};