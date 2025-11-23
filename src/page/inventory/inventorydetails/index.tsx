import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { InventoryDetailsWrapper } from "./styled";
import { AppLayout } from "../../../container/layout/app";
import {
	Box,
	Card,
	CardContent,
	CircularProgress,
	Grid,
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { Fragment, useContext, useEffect, useState } from "react";
import { retrieveProductByIdService } from "../../../util/product/retrieveProductById";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BaseButton } from "../../../component/button/styled";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseSelect } from "../../../component/form/select/styled";
import { BaseOption } from "../../../component/form/option/styled";
import { useQuery } from "@tanstack/react-query";
import { retrieveAllCategoryService } from "../../../util/category/retrieveAllCategory";
import { BaseInput } from "../../../component/form/input/styled";
import { BaseLabel } from "../../../component/form/label/styled";
import { EditIcon, ErrorIcon, SuccessModalIcon } from "../../../asset";
import { AppContext } from "../../../context";
import { EditProductForm } from "../../../container/form/editproduct";
import { BaseAlertModal } from "../../../component/modal/alert";

export const InventoryDetails = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const navigate = useNavigate();
	const { id = "" } = useParams();
	const matches = useMediaQuery("(max-width:250px)");

	const {
		isAlertModalOpen,
		setIsAlertModalOpen,
		setIsEditProductFormModalOpen,
	} = useContext(AppContext);

	const [error, setError] = useState<string | null>(null);
	const [selectedProduct, setSelectedProduct] = useState<Record<
		string,
		any
	> | null>(null);
	const [isLoading, setIsLoading] = useState({
		forDisable: false,
		forApprove: false,
	});

	const convertUrlToFile = async (attachments: string[]): Promise<File[]> => {
		const files: File[] = [];
		for (const url of attachments) {
			try {
				const response = await fetch(url);
				const blob = await response.blob();
				const name = url.split("/product/")[1];
				const file = new File([blob], name, { type: blob.type });
				files.push(file);
			} catch (err) {
				console.error("Failed to fetch attachment:", url, err);
			}
		}
		return files;
	};

	useEffect(() => {
		if (!id.trim()) return;
		retrieveProductByIdService(TOKEN, id)
			.then(async (data) => {
				const images = await convertUrlToFile(data.images ?? []);
				setSelectedProduct({
					...data,
					images,
					imageUrls: data?.images,
				});
			})
			.catch((err) => {
				console.error("Failed to fetch selected inventory:", err);
			});
	}, [TOKEN, id, isAlertModalOpen]);

	const { data: categories } = useQuery({
		queryKey: [`all-category-drop-down-in-inventory-details`, TOKEN],
		queryFn: async () => {
			const response = await retrieveAllCategoryService(TOKEN);
			return response;
		},
		enabled: !!TOKEN,
	});

	const handleNavigateBackwards = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		return navigate(-1);
	};

	const handleOpenEditProductModal = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		if (!selectedProduct) return; //loader goes here
		return setIsEditProductFormModalOpen(true);
	};

	const handleAlertModalClickOutside = () => {
		return setIsAlertModalOpen(true);
	};

	const handleAlertModalCallToActionClick = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		return setIsAlertModalOpen(false);
	};

	return (
		<AppLayout pageId="Inventory">
			<InventoryDetailsWrapper>
				{selectedProduct && (
					<EditProductForm initialFormDetails={selectedProduct} />
				)}
				<BaseAlertModal
					callToAction="Close"
					open={isAlertModalOpen}
					icon={error ? <ErrorIcon /> : <SuccessModalIcon />}
					title={error ? "Error" : "Product updated successfully"}
					className="edit-product-successful-modal"
					handleClose={handleAlertModalClickOutside}
					callToActionBgColor={
						error ? "var(--error-color)" : "var(--success-color)"
					}
					handleCallToAction={handleAlertModalCallToActionClick}
					message={error ? null : "The product has been successfully updated."}
				/>
				<Stack
					direction={"row"}
					alignItems={"center"}
					gap={"calc(var(--flex-gap)/2)"}
				>
					<Box overflow={"hidden"} flexShrink={matches ? 1 : 0}>
						<IconButton
							sx={{
								padding: "0px",
								borderRadius: "8px",
								color: "var(--dark-color)",
								backgroundColor: "inherit",
							}}
							onClick={handleNavigateBackwards}
						>
							<ArrowBackIcon />
						</IconButton>
					</Box>
					<Box overflow={"hidden"}>
						<Typography
							variant="h1"
							fontFamily={"Roboto"}
							fontWeight={600}
							fontSize={28}
							lineHeight={"normal"}
							color="var(--dark-color)"
						>
							{selectedProduct?.name}
						</Typography>
					</Box>
				</Stack>
				<Grid container component={"div"} spacing={"var(--flex-gap)"}>
					<Grid
						order={{ mobile: 2, laptop: 1 }}
						size={{ mobile: 12, laptop: 6 }}
					>
						<Card
							sx={{
								boxShadow: "none",
								borderRadius: "12px",
								border: "1px solid var(--input-field-border-color)",
							}}
						>
							<CardContent className="card-content">
								<Stack
									height={"100%"}
									gap={"calc(var(--flex-gap)/2)"}
									padding={"calc(var(--basic-padding)/2)"}
								>
									<Box overflow={"hidden"}>
										<Typography
											variant="h2"
											fontFamily={"Roboto"}
											fontWeight={600}
											fontSize={18}
											lineHeight={"normal"}
											color="var(--input-field-text-color)"
										>
											Product Images
										</Typography>
									</Box>
									<Grid
										container
										component={"div"}
										spacing={"calc(var(--flex-gap)/4)"}
									>
										{Array.from(
											{
												length: Math.ceil(
													selectedProduct?.imageUrls?.length / 3
												),
											},
											(_, groupIndex) => {
												const startIndex = groupIndex * 3;
												const groupThumbnails =
													selectedProduct?.imageUrls?.slice(
														startIndex,
														startIndex + 3
													);
												return (
													<Fragment key={groupIndex}>
														<Grid size={{ mobile: 12, miniTablet: 6 }}>
															<Box
																component={"div"}
																className="product-thumbnail"
															>
																<img
																	src={groupThumbnails[0]}
																	alt={`Product Thumbnail ${startIndex + 1}`}
																/>
															</Box>
														</Grid>
														<Grid size={{ mobile: 12, miniTablet: 6 }}>
															<Stack gap={"calc(var(--flex-gap)/4)"}>
																{groupThumbnails[1] && (
																	<Box
																		component={"div"}
																		className="product-thumbnail"
																	>
																		<img
																			src={groupThumbnails[1]}
																			alt={`Product Thumbnail ${
																				startIndex + 2
																			}`}
																		/>
																	</Box>
																)}
																{groupThumbnails[2] && (
																	<Box
																		component={"div"}
																		className="product-thumbnail"
																	>
																		<img
																			src={groupThumbnails[2]}
																			alt={`Product Thumbnail ${
																				startIndex + 3
																			}`}
																		/>
																	</Box>
																)}
															</Stack>
														</Grid>
													</Fragment>
												);
											}
										)}
									</Grid>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid
						order={{ mobile: 1, laptop: 2 }}
						size={{ mobile: 12, laptop: 6 }}
					>
						<Card
							sx={{
								boxShadow: "none",
								backgroundColor: "transparent",
							}}
						>
							<CardContent className="card-content">
								<Stack
									height={"100%"}
									gap={"calc(var(--flex-gap))"}
									justifyContent={"space-between"}
								>
									<Stack
										gap={"calc(var(--flex-gap)/2)"}
										direction={{ miniTablet: "row" }}
										justifyContent={{ laptop: "flex-end" }}
									>
										<Box overflow={"hidden"} flexShrink={matches ? 1 : 0}>
											<IconButton
												sx={{
													borderRadius: "14px",
													padding: "calc(var(--basic-padding)/2)",
													backgroundColor: "var(--bright-yellow-color)",
													"&:hover": {
														backgroundColor: "var(--bright-yellow-color)",
													},
												}}
												onClick={handleOpenEditProductModal}
											>
												<EditIcon />
											</IconButton>
										</Box>
										<Box overflow={"hidden"}>
											<BaseButton
												variant="outlined"
												disableElevation
												// disabled={
												// 	selectedProduct?.status === "active" ||
												// 	isLoading.forApprove
												// }
												colour="var(--success-color)"
												border="1px solid var(--success-color)"
												sx={{
													width: "100%",
												}}
												// onClick={handleApproveProduct}
											>
												{isLoading.forApprove ? (
													<CircularProgress
														color="inherit"
														className="loader"
													/>
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
														Approve Product
													</Typography>
												)}
											</BaseButton>
										</Box>
										<Box overflow={"hidden"}>
											<BaseButton
												variant="contained"
												disableElevation
												// disabled={
												// 	selectedProduct?.status === "inactive" ||
												// 	isLoading.forDisable
												// }
												bgcolor="var(--error-color-variant)"
												sx={{
													width: "100%",
												}}
												// onClick={handleDisableProduct}
											>
												{isLoading.forDisable ? (
													<CircularProgress
														color="inherit"
														className="loader"
													/>
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
														Disable Product
													</Typography>
												)}
											</BaseButton>
										</Box>
									</Stack>
									<Card
										sx={{
											boxShadow: "none",
											borderRadius: "12px",
											border: "1px solid var(--input-field-border-color)",
										}}
									>
										<CardContent className="card-content">
											<Stack
												height={"100%"}
												gap={"calc(var(--flex-gap)/2)"}
												padding={"calc(var(--basic-padding)/2)"}
											>
												<Box overflow={"hidden"}>
													<Typography
														variant="h2"
														fontFamily={"Inter"}
														fontWeight={700}
														fontSize={18}
														lineHeight={"normal"}
														color="var(--input-field-text-color)"
													>
														Catalogue
													</Typography>
												</Box>
												<Box>
													<BaseFieldSet>
														<BaseLabel>Product Category</BaseLabel>
														<BaseSelect
															disabled
															name="category"
															radius="10px"
															fontsize="16px"
															fontweight={400}
															value={selectedProduct?.category || " "}
															colour="var(--input-field-text-color)"
															border="1px solid var(--input-field-border-color)"
														>
															<BaseOption
																value=" "
																fontsize="16px"
																fontweight={400}
															>
																Select Product Category
															</BaseOption>
															{categories?.map(
																(
																	category: Record<string, any>,
																	index: number
																) => (
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
												</Box>
											</Stack>
										</CardContent>
									</Card>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid order={3} size={{ mobile: 12, laptop: 6 }}>
						<Stack
							height={"100%"}
							gap={"calc(var(--flex-gap))"}
							justifyContent={"space-between"}
						>
							<Card
								sx={{
									boxShadow: "none",
									borderRadius: "12px",
									border: "1px solid var(--input-field-border-color)",
								}}
							>
								<CardContent className="card-content">
									<Stack
										height={"100%"}
										gap={"calc(var(--flex-gap)/2)"}
										padding={"calc(var(--basic-padding)/2)"}
									>
										<Box overflow={"hidden"}>
											<Typography
												variant="h2"
												fontFamily={"Inter"}
												fontWeight={700}
												fontSize={18}
												lineHeight={"normal"}
												color="var(--input-field-text-color)"
											>
												Product description
											</Typography>
										</Box>
										<Stack gap={"calc(var(--flex-gap)/2)"}>
											<Box>
												<BaseFieldSet>
													<BaseLabel>Product Name</BaseLabel>
													<BaseInput
														disabled
														required
														name="name"
														value={selectedProduct?.name || ""}
														placeholder="Enter Product Name"
													/>
												</BaseFieldSet>
											</Box>
											<Box>
												<BaseFieldSet>
													<BaseLabel>Product Description</BaseLabel>
													<BaseInput
														disabled
														required
														name="name"
														value={selectedProduct?.description || ""}
														placeholder="Enter Product Name"
													/>
												</BaseFieldSet>
											</Box>
										</Stack>
									</Stack>
								</CardContent>
							</Card>
							<Card
								sx={{
									boxShadow: "none",
									borderRadius: "12px",
									border: "1px solid var(--input-field-border-color)",
								}}
							>
								<CardContent className="card-content">
									<Stack
										height={"100%"}
										gap={"calc(var(--flex-gap)/2)"}
										padding={"calc(var(--basic-padding)/2)"}
									>
										<Box overflow={"hidden"}>
											<Typography
												variant="h2"
												fontFamily={"Inter"}
												fontWeight={700}
												fontSize={18}
												lineHeight={"normal"}
												color="var(--input-field-text-color)"
											>
												Inventory
											</Typography>
										</Box>
										<Stack gap={"calc(var(--flex-gap)/2)"}>
											<Box>
												<BaseFieldSet>
													<BaseLabel>Quantity in Stock</BaseLabel>
													<BaseInput
														disabled
														required
														name="stock"
														value={selectedProduct?.stock || ""}
														placeholder="Enter Stock Quantity"
													/>
												</BaseFieldSet>
											</Box>
										</Stack>
									</Stack>
								</CardContent>
							</Card>
						</Stack>
					</Grid>
					<Grid order={4} size={{ mobile: 12, laptop: 6 }}>
						<Stack height={"100%"} gap={"calc(var(--flex-gap))"}>
							<Card
								sx={{
									boxShadow: "none",
									borderRadius: "12px",
									border: "1px solid var(--input-field-border-color)",
								}}
							>
								<CardContent className="card-content">
									<Stack
										height={"100%"}
										gap={"calc(var(--flex-gap)/2)"}
										padding={"calc(var(--basic-padding)/2)"}
									>
										<Box overflow={"hidden"}>
											<Typography
												variant="h2"
												fontFamily={"Inter"}
												fontWeight={700}
												fontSize={18}
												lineHeight={"normal"}
												color="var(--input-field-text-color)"
											>
												Pricing
											</Typography>
										</Box>
										<Box>
											<BaseFieldSet>
												<BaseInput
													required
													disabled
													name="price"
													value={selectedProduct?.price || ""}
													placeholder="Enter Price"
												/>
											</BaseFieldSet>
										</Box>
									</Stack>
								</CardContent>
							</Card>
							<Card
								sx={{
									boxShadow: "none",
									borderRadius: "12px",
									border: "1px solid var(--input-field-border-color)",
								}}
							>
								<CardContent className="card-content">
									<Stack
										height={"100%"}
										gap={"calc(var(--flex-gap)/2)"}
										padding={"calc(var(--basic-padding)/2)"}
									>
										<Stack
											direction={"row"}
											alignItems={"center"}
											gap={"calc(var(--flex-gap)/2)"}
											justifyContent={"space-between"}
										>
											<Box overflow={"hidden"}>
												<Typography
													variant="h2"
													fontFamily={"Inter"}
													fontWeight={700}
													fontSize={18}
													lineHeight={"normal"}
													color="var(--input-field-text-color)"
												>
													Distributor Details
												</Typography>
											</Box>
											<Box overflow={"hidden"}>
												<BaseButton
													variant="outlined"
													disableElevation
													colour="var(--primary-color)"
													border="1px solid var(--primary-color)"
													sx={{
														width: "100%",
													}}
													// onClick={handleApproveProduct}
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
														Modify
													</Typography>
												</BaseButton>
											</Box>
										</Stack>
									</Stack>
								</CardContent>
							</Card>
						</Stack>
					</Grid>
				</Grid>
			</InventoryDetailsWrapper>
		</AppLayout>
	);
};
