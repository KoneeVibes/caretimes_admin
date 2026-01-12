import { Box, Chip, CircularProgress, Grid, Typography } from "@mui/material";
import { BaseFormModal } from "../../../component/modal/form";
import { EditCategoryFormWrapper } from "./styled";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../context";
import Cookies from "universal-cookie";
import { EditCategoryFormPropsType } from "../../../type/container.type";
import { editCategoryService } from "../../../util/category/editCategory";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { BaseSelect } from "../../../component/form/select/styled";
import { BaseOption } from "../../../component/form/option/styled";
import { BaseButton } from "../../../component/button/styled";

export const EditCategoryForm: React.FC<EditCategoryFormPropsType> = ({
	initialFormDetails,
}) => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const status = ["active", "inactive"];

	const {
		isEditCategoryFormModalOpen,
		setIsEditCategoryFormModalOpen,
		setIsAlertModalOpen,
		setAlertModalInfo,
	} = useContext(AppContext);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formDetails, setFormDetails] = useState(initialFormDetails);

	useEffect(() => {
		setFormDetails(initialFormDetails);
	}, [initialFormDetails]);

	const handleClickOutside = () => {
		setError(null);
		setIsEditCategoryFormModalOpen(false);
		setFormDetails(initialFormDetails);
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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formDetails.status.trim() || !formDetails.id.trim()) return;
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
			const response = await editCategoryService(
				TOKEN,
				formDetails.id,
				formData
			);
			if (response.status === "success") {
				setIsLoading(false);
				setIsEditCategoryFormModalOpen(false);
				setIsAlertModalOpen(true);
				setAlertModalInfo({
					title: "Category updated successfully",
					message: "The category has been successfully updated. ",
				});
			} else {
				setIsLoading(false);
				setError(
					"Action: Edit category failed. Please check your credentials and try again."
				);
			}
		} catch (error: any) {
			setIsLoading(false);
			setError(`Edit category failed. ${error.message}`);
			console.error("Edit category failed:", error);
		}
	};

	return (
		<BaseFormModal
			open={isEditCategoryFormModalOpen}
			handleClickOutside={handleClickOutside}
			handleSubmit={handleSubmit}
			title="Edit Category"
			className="edit-category-form-modal"
		>
			<EditCategoryFormWrapper>
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
			</EditCategoryFormWrapper>
		</BaseFormModal>
	);
};
