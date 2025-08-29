import { styled, TableContainer, TableContainerProps } from "@mui/material";

export const TableWrapper = styled(TableContainer)<TableContainerProps>(() => {
	return {
		boxShadow: "none",
		"& .MuiTableCell-root": {
			fontFamily: "Gilroy",
			fontWeight: 600,
			fontSize: "16px",
			color: "var(--dark-color)",
			overflow: "hidden",
			whiteSpace: "normal",
			textOverflow: "ellipsis",
			maxWidth: "10rem",
			padding: "var(--basic-padding)",
			borderBottom: "2px solid var(--table-border-color)",
		},
		"& .MuiTableHead-root": {
			"& .MuiTableCell-root": {
				fontFamily: "Gilroy",
				fontWeight: 500,
				fontSize: "16px",
			},
		},
		"& .MuiTableBody-root": {
			"& .MuiTableRow-root:last-child": {
				"& .MuiTableCell-root": {
					borderBottom: "none",
				},
			},
		},
	};
});
