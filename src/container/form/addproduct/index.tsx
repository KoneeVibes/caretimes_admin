import { useContext, useRef, useState } from "react";
import { BaseFormModal } from "../../../component/modal/form";
import { AddProductFormWrapper } from "./styled";
import { AppContext } from "../../../context";
import Cookies from "universal-cookie";
import {
	Box,
	Chip,
	CircularProgress,
	Grid,
	Stack,
	Typography,
} from "@mui/material";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { addProductService } from "../../../util/product/addProduct";
import { BaseSelect } from "../../../component/form/select/styled";
import { BaseOption } from "../../../component/form/option/styled";
import { BaseButton } from "../../../component/button/styled";
import { useQuery } from "@tanstack/react-query";
import { retrieveAllCategoryService } from "../../../util/category/retrieveAllCategory";

export const AddProductForm = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const initialFormDetails = {
		name: "",
		category: " ",
		stock: "",
		price: "",
		status: " ",
		description: "",
		images: [],
	};
	const status = ["active", "inactive"];

	const {
		isAddProductFormModalOpen,
		setIsAddProductFormModalOpen,
		setIsAlertModalOpen,
		setAlertModalInfo,
	} = useContext(AppContext);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formDetails, setFormDetails] = useState(initialFormDetails);

	const { data: categories } = useQuery({
		queryKey: [`all-category-drop-down`, TOKEN],
		queryFn: async () => {
			const response = await retrieveAllCategoryService(TOKEN);
			const filteredResponse = response.filter((category: any) =>
				["active"].includes(category.status)
			);
			return filteredResponse;
		},
		enabled: !!TOKEN,
	});

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
		const { name, type, value, files } = e.target as HTMLInputElement;
		if (type === "file") {
			const fileArray = files ? Array.from(files) : [];
			setFormDetails((prev) => ({
				...prev,
				[name]: [...(prev[name as keyof typeof prev] as File[]), ...fileArray],
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
		setIsAddProductFormModalOpen(false);
	};

	const handleDeleteImage = (fileToDelete: File) => {
		setFormDetails((prev) => {
			const updated = prev.images.filter((file) => file !== fileToDelete);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			return {
				...prev,
				images: updated,
			};
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formDetails.status.trim()) return;
		setError(null);
		setIsLoading(true);
		const formData = new FormData();
		const data = {
			name: formDetails.name,
			category: formDetails.category,
			stock: formDetails.stock,
			price: formDetails.price,
			status: formDetails.status,
			description: formDetails.description,
		};
		Object.entries(data).forEach(([key, value]) => {
			formData.append(key, value);
		});
		formDetails.images?.forEach((file: File, index: number) => {
			formData.append("image", file);
		});
		try {
			const response = await addProductService(TOKEN, formData);
			if (response.status === "success") {
				setIsLoading(false);
				setIsAddProductFormModalOpen(false);
				setFormDetails(initialFormDetails);
				setIsAlertModalOpen(true);
				setAlertModalInfo({
					title: "Product added successfully",
					message:
						"The product has been successfully added. Users can now see view it on the website.",
				});
			} else {
				setIsLoading(false);
				setError(
					"Action: Add product failed. Please check your credentials and try again."
				);
			}
		} catch (error: any) {
			setIsLoading(false);
			setError(`Add product failed. ${error.message}`);
			console.error("Add product failed:", error);
		}
	};

	return (
		<BaseFormModal
			open={isAddProductFormModalOpen}
			handleClickOutside={handleClickOutside}
			handleSubmit={handleSubmit}
			title="Add New Product"
			className="add-product-form-modal"
		>
			<AddProductFormWrapper>
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
								placeholder="Enter Product Name"
								isError={error ? true : false}
								onChange={(e) => handleChange(e)}
							/>
						</BaseFieldSet>
					</Grid>
					<Grid size={{ mobile: 12 }}>
						<BaseFieldSet>
							<BaseSelect
								name="category"
								radius="10px"
								fontsize="16px"
								fontweight={400}
								value={formDetails.category}
								isError={error ? true : false}
								onChange={(e) => handleChange(e)}
								colour="var(--input-field-text-color)"
								border="1px solid var(--input-field-border-color)"
							>
								<BaseOption value=" " fontsize="16px" fontweight={400}>
									Select Product Category
								</BaseOption>
								{categories?.map(
									(category: Record<string, any>, index: number) => (
										<BaseOption
											key={index}
											value={category?.id}
											fontsize="16px"
											fontweight={400}
										>
											{category?.name.charAt(0).toUpperCase() +
												category?.name.slice(1)}
										</BaseOption>
									)
								)}
							</BaseSelect>
						</BaseFieldSet>
					</Grid>
					<Grid size={{ mobile: 12 }}>
						<BaseFieldSet>
							<BaseInput
								required
								name="stock"
								value={formDetails.stock}
								placeholder="Enter Stock Quantity"
								isError={error ? true : false}
								onChange={(e) => handleChange(e)}
							/>
						</BaseFieldSet>
					</Grid>
					<Grid size={{ mobile: 12 }}>
						<BaseFieldSet>
							<BaseInput
								required
								name="price"
								value={formDetails.price}
								placeholder="Enter Price"
								isError={error ? true : false}
								onChange={(e) => handleChange(e)}
							/>
						</BaseFieldSet>
					</Grid>
					<Grid size={{ mobile: 12 }}>
						<BaseFieldSet>
							<BaseInput
								type="file"
								name="images"
								inputRef={fileInputRef}
								inputProps={{
									accept: ".jpeg,.jpg,.png",
									multiple: true,
								}}
								onChange={handleChange}
							/>
							{formDetails.images.length > 0 && (
								<Stack
									direction={"row"}
									flexWrap={"wrap"}
									gap={"calc(var(--flex-gap)/4)"}
									marginBlockStart={"calc(var(--basic-margin)/4)"}
								>
									{formDetails?.images?.map((file: File, index) => (
										<Chip
											key={index}
											label={file.name}
											onDelete={() => handleDeleteImage(file)}
										/>
									))}
								</Stack>
							)}
						</BaseFieldSet>
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
			</AddProductFormWrapper>
		</BaseFormModal>
	);
};
