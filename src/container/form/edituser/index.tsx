import { useContext, useState } from "react";
import Cookies from "universal-cookie";
import { AppContext } from "../../../context";
import { EditUserFormWrapper } from "./styled";
import { BaseFormModal } from "../../../component/modal/form";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { BaseSelect } from "../../../component/form/select/styled";
import { BaseOption } from "../../../component/form/option/styled";
import { BaseButton } from "../../../component/button/styled";
import { editUserService } from "../../../util/usermanagement/user/editUser";
import { EditUserFormPropsType } from "../../../type/container.type";

export const EditUserForm: React.FC<EditUserFormPropsType> = ({
	initialFormDetails,
}) => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const userTypes = ["admin", "distributor"];

	const {
		isEditUserFormModalOpen,
		setIsEditUserFormModalOpen,
		setIsAlertModalOpen,
	} = useContext(AppContext);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formDetails, setFormDetails] = useState(initialFormDetails);

	const handleClickOutside = () => {
		setError(null);
		setIsEditUserFormModalOpen(false);
		setFormDetails(initialFormDetails);
	};

	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
			| React.ChangeEvent<HTMLInputElement>
			| (Event & {
					target: {
						value: unknown;
						name: string;
					};
			  })
	) => {
		const { name, value } = e.target;
		setFormDetails((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formDetails.type.trim() || !formDetails.id.trim()) return;
		setError(null);
		setIsLoading(true);
		try {
			const response = await editUserService(
				TOKEN,
				formDetails.id,
				formDetails
			);
			if (response.status === "success") {
				setIsLoading(false);
				setIsEditUserFormModalOpen(false);
				setIsAlertModalOpen(true);
			} else {
				setIsLoading(false);
				setError(
					"Action: Edit admin failed. Please check your credentials and try again."
				);
			}
		} catch (error: any) {
			setIsLoading(false);
			setError(`Edit admin failed. ${error.message}`);
			console.error("Edit admin failed:", error);
		}
	};

	return (
		<BaseFormModal
			open={isEditUserFormModalOpen}
			handleClickOutside={handleClickOutside}
			handleSubmit={handleSubmit}
			title="Edit Admin"
			className="edit-admin-form-modal"
		>
			<EditUserFormWrapper>
				{error && (
					<Box>
						<Typography
							fontFamily={"Roboto"}
							fontWeight={"400"}
							fontSize={15}
							lineHeight={"normal"}
							color={"var(--error-color)"}
							whiteSpace={"normal"}
							textAlign={"center"}
						>
							{error}
						</Typography>
					</Box>
				)}
				<Grid container spacing={"calc(var(--flex-gap)/2)"}>
					<Grid size={{ mobile: 12, miniTablet: 6 }}>
						<BaseFieldSet>
							<BaseInput
								required
								name="firstName"
								value={formDetails.firstName}
								placeholder="First Name"
								isError={error ? true : false}
								onChange={(e) => handleChange(e)}
							/>
						</BaseFieldSet>
					</Grid>
					<Grid size={{ mobile: 12, miniTablet: 6 }}>
						<BaseFieldSet>
							<BaseInput
								required
								name="lastName"
								value={formDetails.lastName}
								placeholder="Last Name"
								isError={error ? true : false}
								onChange={(e) => handleChange(e)}
							/>
						</BaseFieldSet>
					</Grid>
					<Grid size={{ mobile: 12 }}>
						<BaseFieldSet>
							<BaseInput
								required
								name="email"
								value={formDetails.email}
								placeholder="Email Address"
								isError={error ? true : false}
								onChange={(e) => handleChange(e)}
							/>
						</BaseFieldSet>
					</Grid>
					<Grid size={{ mobile: 12 }}>
						<BaseFieldSet>
							<BaseInput
								required
								name="phone"
								value={formDetails.phone}
								placeholder="Phone Number"
								isError={error ? true : false}
								onChange={(e) => handleChange(e)}
							/>
						</BaseFieldSet>
					</Grid>
					<Grid size={{ mobile: 12 }}>
						<BaseFieldSet>
							<BaseSelect
								name="type"
								radius="10px"
								fontsize="16px"
								fontweight={400}
								value={formDetails.type}
								isError={error ? true : false}
								onChange={(e) => handleChange(e)}
								colour="var(--input-field-text-color)"
								border="1px solid var(--input-field-border-color)"
							>
								<BaseOption value=" " fontsize="16px" fontweight={400}>
									Select User Type
								</BaseOption>
								{userTypes.map((type: string, index: number) => (
									<BaseOption
										key={index}
										value={type}
										fontsize="16px"
										fontweight={400}
									>
										{type.charAt(0).toUpperCase() + type.slice(1)}
									</BaseOption>
								))}
							</BaseSelect>
						</BaseFieldSet>
					</Grid>
				</Grid>
				<Box overflow={"hidden"}>
					<BaseButton
						type="submit"
						variant="contained"
						disableElevation
						bgcolor="var(--success-color)"
						sx={{
							width: "100%",
						}}
					>
						{isLoading ? (
							<CircularProgress color="inherit" className="loader" />
						) : (
							<Typography
								variant={"button"}
								fontFamily={"inherit"}
								fontWeight={"inherit"}
								fontSize={"inherit"}
								lineHeight={"inherit"}
								color={"inherit"}
								textTransform={"inherit"}
							>
								Proceed
							</Typography>
						)}
					</BaseButton>
				</Box>
			</EditUserFormWrapper>
		</BaseFormModal>
	);
};
