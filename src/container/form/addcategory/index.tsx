import { useContext, useRef, useState } from "react";
import { BaseFormModal } from "../../../component/modal/form";
import { AddCategoryFormWrapper } from "./styled";
import { AppContext } from "../../../context";
import Cookies from "universal-cookie";
import { Box, Chip, CircularProgress, Grid, Typography } from "@mui/material";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { addCategoryService } from "../../../util/category/addCategory";
import { BaseSelect } from "../../../component/form/select/styled";
import { BaseOption } from "../../../component/form/option/styled";
import { BaseButton } from "../../../component/button/styled";

export const AddCategoryForm = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const initialFormDetails = {
		name: "",
		description: "",
		thumbnail: null as File | null,
		status: " ",
	};
	const status = ["active", "inactive"];

	const {
		isAddCategoryFormModalOpen,
		setIsAddCategoryFormModalOpen,
		setIsAlertModalOpen,
		setAlertModalInfo,
	} = useContext(AppContext);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

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
		const { name, value, type, files } = e.target as HTMLInputElement;
		if (type === "file") {
			const file = files?.[0] || null;
			setFormDetails((prev) => ({
				...prev,
				[name]: file,
			}));
		} else {
			setFormDetails((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleClickOutside = () => {
		setError(null);
		setFormDetails(initialFormDetails);
		setIsAddCategoryFormModalOpen(false);
	};

	const handleDeleteImage = () => {
		setFormDetails((prev) => ({
			...prev,
			thumbnail: null,
		}));
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formDetails.status.trim()) return;
		setError(null);
		setIsLoading(true);
		const formData = new FormData();
		const data = {
			name: formDetails.name,
			status: formDetails.status,
			description: formDetails.description,
			thumbnail: formDetails.thumbnail,
		};
		Object.entries(data).forEach(([key, value]) => {
			if (value === null || value === undefined) return;
			if (value instanceof File) {
				formData.append(key, value);
			} else {
				formData.append(key, String(value));
			}
		});
		try {
			const response = await addCategoryService(TOKEN, formData);
			if (response.status === "success") {
				setIsLoading(false);
				setIsAddCategoryFormModalOpen(false);
				setFormDetails(initialFormDetails);
				setIsAlertModalOpen(true);
				setAlertModalInfo({
					title: "Category added successfully",
					message: "The category has been successfully added. ",
				});
			} else {
				setIsLoading(false);
				setError(
					"Action: Add category failed. Please check your credentials and try again."
				);
			}
		} catch (error: any) {
			setIsLoading(false);
			setError(`Add category failed. ${error.message}`);
			console.error("Add category failed:", error);
		}
	};

	return (
		<BaseFormModal
			open={isAddCategoryFormModalOpen}
			handleClickOutside={handleClickOutside}
			handleSubmit={handleSubmit}
			title="Add New Category"
			className="add-category-form-modal"
		>
			<AddCategoryFormWrapper>
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
					<Grid size={{ mobile: 12 }}>
						<BaseFieldSet>
							<BaseInput
								required
								name="name"
								value={formDetails.name}
								placeholder="Enter Category Name"
								isError={error ? true : false}
								onChange={(e) => handleChange(e)}
							/>
						</BaseFieldSet>
					</Grid>
					<Grid size={{ mobile: 12 }}>
						<BaseInput
							type="file"
							name="thumbnail"
							inputRef={fileInputRef}
							inputProps={{
								accept: ".jpeg,.jpg,.png",
							}}
							onChange={handleChange}
						/>
						{formDetails.thumbnail && (
							<Box marginBlockStart={"calc(var(--basic-margin)/4)"}>
								<Chip
									label={formDetails.thumbnail.name}
									onDelete={handleDeleteImage}
								/>
							</Box>
						)}
					</Grid>
					<Grid size={{ mobile: 12 }}>
						<BaseFieldSet>
							<BaseInput
								multiline
								minRows={4}
								name="description"
								value={formDetails.description}
								placeholder="Enter Description"
								isError={error ? true : false}
								onChange={(e) => handleChange(e)}
							/>
						</BaseFieldSet>
					</Grid>
					<Grid size={{ mobile: 12 }}>
						<BaseFieldSet>
							<BaseSelect
								name="status"
								radius="10px"
								fontsize="16px"
								fontweight={400}
								value={formDetails.status}
								isError={error ? true : false}
								onChange={(e) => handleChange(e)}
								colour="var(--input-field-text-color)"
								border="1px solid var(--input-field-border-color)"
							>
								<BaseOption value=" " fontsize="16px" fontweight={400}>
									Select Status
								</BaseOption>
								{status.map((type: string, index: number) => (
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
			</AddCategoryFormWrapper>
		</BaseFormModal>
	);
};
