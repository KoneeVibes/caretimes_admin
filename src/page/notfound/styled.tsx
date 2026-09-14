import { styled } from "@mui/material/styles";
import { Container } from "@mui/material";

export const NotFoundErrorWrapper = styled(Container)(({ theme }) => {
	return {
		overflow: "hidden",
		"& .not-found-error-body": {
			gap: "calc(var(--basic-padding)/3) calc(var(--flex-gap)/9)",
			padding: "0 calc(var(--basic-padding)/6) calc(var(--basic-padding)/3)",
			"& .animation-area": {
				height: "300px",
				"& img": {
					width: "100%",
					height: "100%",
					objectFit: "contain",
				},
			},
			[theme.breakpoints.up("tablet")]: {
				padding: "0 calc(var(--basic-padding)/3) calc(var(--basic-padding)/2)",
			},
		},
	};
});
