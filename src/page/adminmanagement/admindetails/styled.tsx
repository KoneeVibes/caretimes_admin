import { Stack, styled } from "@mui/material";

export const AdminDetailsWrapper = styled(Stack)(({ theme }) => {
	return {
		gap: "var(--flex-gap)",
		"& .back-arrow-icon": {
			"& path": {
				fill: "var(--dark-color)",
			},
			transform: "rotate(180deg)",
		},
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
		"& .headshot-box": {
			overflow: "hidden",
			height: "80px",
			width: "80px",
			borderRadius: "50%",
			flexShrink: 0,
			"& img": {
				width: "100%",
				height: "100%",
				objectFit: "cover",
			},
			[theme.breakpoints.down(220)]: {
				height: "auto",
				width: "100%",
			},
		},
	};
});
