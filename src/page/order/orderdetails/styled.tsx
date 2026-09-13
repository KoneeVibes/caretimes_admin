import { Stack, styled } from "@mui/material";

export const OrderDetailsWrapper = styled(Stack)(({ theme }) => {
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
			"& .title-bar": {
				gap: "calc(var(--flex-gap)/4)",
			},
			"& .progress-area": {
				gap: "calc(var(--flex-gap)/2)",
				"& .status-bar": {
					flexDirection: "row",
					gap: "calc(var(--flex-gap)/2)",
				},
			},
			"& .break-down-item": {
				flexDirection: "row",
				gap: "calc(var(--flex-gap))",
				justifyContent: "space-between",
				padding: "calc(var(--basic-padding)/2) 0",
				borderBottom: "1px solid var(--row-item-border-color)",
				"& .break-down-item-title": {
					overflow: "hidden",
					alignItems: "center",
					flexDirection: "row",
					gap: "calc(var(--flex-gap)/8)",
				},
			},
			"& .break-down-total": {
				flexDirection: "row",
				gap: "calc(var(--flex-gap))",
				justifyContent: "space-between",
				padding: "calc(var(--basic-padding)/2)",
			},
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
		"& .call-to-action": {
			gap: "calc(var(--flex-gap)/2)",
			justifyContent: "space-between",
		},
		"& fieldset": {
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
			"& .MuiSelect-select": {
				minHeight: 0,
			},
		},
		[theme.breakpoints.up("miniTablet")]: {
			"& .card-content": {
				"& .title-bar": {
					flexDirection: "row",
					alignItems: "center",
				},
			},
			"& .call-to-action": {
				flexDirection: "row",
				alignItems: "flex-end",
			},
		},
	};
});
