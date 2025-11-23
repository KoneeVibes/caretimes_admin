import { Stack, styled } from "@mui/material";

export const InventoryDetailsWrapper = styled(Stack)(({ theme }) => {
	return {
		gap: "var(--flex-gap)",
		overflow: "hidden",
		"& .MuiCard-root": {
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
		"& .product-thumbnail": {
			height: "100%",
			display: "flex",
			overflow: "hidden",
			borderRadius: "10px",
			"& img": {
				width: "100%",
				height: "100%",
				borderRadius: "inherit",
			},
		},
		"& fieldset": {
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
		},
	};
});
