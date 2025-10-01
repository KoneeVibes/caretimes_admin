import {
	Box,
	DialogActions,
	DialogContent,
	DialogContentText,
	Typography,
} from "@mui/material";
import { BaseAlertModalPropsType } from "../../../type/component.type";
import { BaseAlertModalWrapper } from "./styled";
import { BaseButton } from "../../../component/button/styled";

export const BaseAlertModal: React.FC<BaseAlertModalPropsType> = ({
	open,
	icon,
	handleClose,
	title,
	message,
	handleCallToAction,
	callToAction,
	callToActionBgColor,
	className,
}) => {
	return (
		<BaseAlertModalWrapper
			open={open}
			onClose={handleClose}
			className={className}
		>
			<DialogContent className="modal-content">
				<Box component={"div"} className="icon-box">
					{icon}
				</Box>
				<DialogContentText
					variant="h2"
					fontFamily={"Roboto"}
					fontWeight={700}
					fontSize={24}
					lineHeight={"normal"}
					color={"var(--dark-color)"}
					whiteSpace={"normal"}
					textAlign={"center"}
				>
					{title}
				</DialogContentText>
				{message && (
					<DialogContentText
						variant="body1"
						fontFamily={"Roboto"}
						fontWeight={400}
						fontSize={16}
						lineHeight={"normal"}
						color={"var(--modal-message-text-color)"}
						whiteSpace={"normal"}
						textAlign={"center"}
					>
						{message}
					</DialogContentText>
				)}
			</DialogContent>
			<Box
				overflow={"hidden"}
				padding={"0 var(--basic-padding) var(--basic-padding)"}
			>
				<DialogActions
					sx={{
						padding: "0",
						overflow: "hidden",
						justifyContent: "flex-start",
					}}
				>
					<BaseButton
						variant="contained"
						onClick={handleCallToAction}
						disableElevation
						bgcolor={callToActionBgColor}
						sx={{
							width: "100%",
						}}
					>
						<Typography
							variant={"button"}
							fontFamily={"inherit"}
							fontWeight={"inherit"}
							fontSize={"inherit"}
							lineHeight={"inherit"}
							color={"inherit"}
							textTransform={"inherit"}
						>
							{callToAction}
						</Typography>
					</BaseButton>
				</DialogActions>
			</Box>
		</BaseAlertModalWrapper>
	);
};
