import { Button, ButtonProps, styled } from "@mui/material";
import { BaseButtonPropsType } from "../../type/component.type";

export const BaseButton = styled(Button)<ButtonProps & BaseButtonPropsType>(
	({
		variant,
		fontfamily,
		fontsize,
		fontweight,
		radius,
		padding,
		bgcolor,
		border,
		colour,
	}) => {
		return {
			fontFamily: fontfamily || "Roboto",
			fontWeight: fontweight || 600,
			fontSize: fontsize || "16px",
			lineHeight: "normal",
			borderRadius: radius || "16px",
			border:
				variant === "contained"
					? "none"
					: border || "1px solid var(--input-field-text-color)",
			color:
				variant === "contained"
					? colour || "var(--light-color)"
					: colour || "var(--dark-color)",
			background:
				variant === "contained"
					? bgcolor || "var(--primary-color)"
					: bgcolor || "transparent",
			padding:
				padding || "calc(var(--basic-padding)/2) calc(var(--basic-padding))",
			textTransform: "capitalize",
			minWidth: 0,
			"&:hover": {
				border:
					variant === "contained"
						? "none"
						: border || "1px solid var(--input-field-text-color)",
				background:
					variant === "contained"
						? bgcolor || "var(--primary-color)"
						: bgcolor || "transparent",
			},
		};
	}
);
