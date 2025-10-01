import { Stack, styled } from "@mui/material";

export const EditUserFormWrapper = styled(Stack)(({ theme }) => {
	return {
		gap: "var(--flex-gap)",
		padding: "0 var(--basic-padding) var(--basic-padding)",
		overflow: "hidden",
	};
});
