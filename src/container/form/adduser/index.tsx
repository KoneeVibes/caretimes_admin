import Cookies from "universal-cookie";
import { useContext, useState } from "react";
import { BaseFormModal } from "../../../component/modal/form";
import { AddUserFormWrapper } from "./styled";
import { AppContext } from "../../../context";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { BaseSelect } from "../../../component/form/select/styled";
import { BaseOption } from "../../../component/form/option/styled";
import { addUserService } from "../../../util/usermanagement/user/addUser";
import { BaseButton } from "../../../component/button/styled";

export const AddUserForm = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const userTypes = ["admin", "distributor"];
	const initialFormDetails = {
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		type: " ",
	};

	const {
		isAddUserFormModalOpen,
		setIsAddUserFormModalOpen,
		setIsAlertModalOpen,
	} = useContext(AppContext);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formDetails, setFormDetails] = useState(initialFormDetails);

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

	const handleClickOutside = () => {
		setIsAddUserFormModalOpen(false);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formDetails.type.trim()) return;
		setError(null);
		setIsLoading(true);
		try {
			const response = await addUserService(
				TOKEN,
				formDetails.type,
				formDetails
			);
			if (response.status === "success") {
				setIsLoading(false);
				setIsAddUserFormModalOpen(false);
				setFormDetails(initialFormDetails);
				setIsAlertModalOpen(true);
			} else {
				setIsLoading(false);
				setError(
					"Action: Add admin failed. Please check your credentials and try again."
				);
			}
		} catch (error: any) {
			setIsLoading(false);
			setError(`Add admin failed. ${error.message}`);
			console.error("Add admin failed:", error);
		}
	};

	return (
		<BaseFormModal
			open={isAddUserFormModalOpen}
			handleClickOutside={handleClickOutside}
			handleSubmit={handleSubmit}
			title="Create Admin"
			className="add-admin-form-modal"
		>
			<AddUserFormWrapper>
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
			</AddUserFormWrapper>
		</BaseFormModal>
	);
};
