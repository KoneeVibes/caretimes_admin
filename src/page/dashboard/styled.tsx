import { Stack, styled } from "@mui/material";

export const DashboardWrapper = styled(Stack)(() => {
	return {
		gap: "var(--flex-gap)",
		"& .MuiCard-root": {
			height: "100%",
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
		},
		"& .card-content": {
			padding: "0",
			display: "flex",
			flexDirection: "column",
			height: "inherit",
		},
		"& .card-content:last-child": {
			paddingBottom: 0,
		},
		"& .order-table-box": {
			"& .MuiTableContainer-root": {
				"& .MuiTableHead-root": {
					"& .MuiTableCell-root": {
						whiteSpace: "nowrap",
					},
				},
			},
		},
		"& .order-table-box-footer": {
			display: "flex",
			justifyContent: "flex-end",
		},
	};
});
