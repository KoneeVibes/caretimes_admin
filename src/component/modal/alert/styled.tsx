import { Dialog, styled } from "@mui/material";

export const BaseAlertModalWrapper = styled(Dialog)(() => {
	return {
		"& .MuiDialog-paper": {
			borderRadius: "16px",
			maxWidth: "25rem",
			width: "-webkit-fill-available",
		},
		"& .icon-box": {
			display: "flex",
			justifyContent: "center",
		},
		"& .modal-content": {
			padding: "var(--basic-padding)",
			display: "flex",
			flexDirection: "column",
			gap: "calc(var(--flex-gap))",
		},
	};
});
