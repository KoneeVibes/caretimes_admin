import {
	Box,
	Card,
	CardContent,
	CircularProgress,
	Drawer,
	Grid,
	IconButton,
	InputAdornment,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { AppLayout } from "../../container/layout/app";
import { InventoryWrapper } from "./styled";
import { BaseButton } from "../../component/button/styled";
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../context";
import { inventorySummaryCards } from "../../config/static";
import {
	DashboardCardDownwardTickIcon,
	DashboardCardUpwardTickIcon,
	ExportIcon,
	FilterIcon,
	SearchIcon,
	SuccessModalIcon,
} from "../../asset";
import { BaseInput } from "../../component/form/input/styled";
import { InventoryTable } from "../../container/table/inventorytable";
import { AddProductForm } from "../../container/form/addproduct";
import { BaseAlertModal } from "../../component/modal/alert";
import CloseIcon from "@mui/icons-material/Close";
import { AddCategoryForm } from "../../container/form/addcategory";
import Cookies from "universal-cookie";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { retrieveAllProductService } from "../../util/product/retrieveAllProduct";
import { retrieveAllCategoryService } from "../../util/category/retrieveAllCategory";
import { useNavigate } from "react-router-dom";
import { EditCategoryForm } from "../../container/form/editcategory";
import { editCategoryService } from "../../util/category/editCategory";
import { SwitchField } from "../../component/form/switch/styled";

export const Inventory = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const {
		isAlertModalOpen,
		setIsAlertModalOpen,
		alertModalInfo,
		setAlertModalInfo,
		setIsAddProductFormModalOpen,
		setIsAddCategoryFormModalOpen,
		isEditCategoryFormModalOpen,
		setIsEditCategoryFormModalOpen,
	} = useContext(AppContext);

	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const matches = useMediaQuery("(max-width:200px)");

	const [isActivating, setIsActivating] = useState(false);
	const [paginationIndex, setPaginationIndex] = useState(1);
	const [isManageCategoryDrawerOpen, setIsManageCategoryDrawerOpen] =
		useState(false);
	const [selectedCategory, setSelectedCategory] = useState<Record<
		string,
		any
	> | null>(null);

	const convertUrlToFile = async (url: string): Promise<File | null> => {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const name = url.split("/category/")[1] ?? "file";
			return new File([blob], name, { type: blob.type });
		} catch (err) {
			console.error("Failed to fetch attachment:", url, err);
			return null;
		}
	};

	const { data: allProduct } = useQuery({
		queryKey: [`all-product`, TOKEN],
		queryFn: async () => {
			const response = await retrieveAllProductService(TOKEN);
			return response;
		},
		enabled: !!TOKEN,
	});

	const { data: allCategory } = useQuery({
		queryKey: [`all-category`, TOKEN],
		queryFn: async () => {
			const response = await retrieveAllCategoryService(TOKEN);
			if (Array.isArray(response)) {
				const transformedResponse = await Promise.all(
					response.map(async (category: any) => {
						if (typeof category?.thumbnail === "string" && category.thumbnail) {
							const file = await convertUrlToFile(category.thumbnail);
							return { ...category, thumbnail: file ?? category.thumbnail };
						}
						return category;
					})
				);
				return transformedResponse;
			}
			return response;
		},
		enabled: !!TOKEN,
	});

	const allProductWithCategoryName = useMemo(() => {
		if (!allProduct || !allCategory) return [];
		const categoryMap = Object.fromEntries(
			allCategory.map((c: { id: any; name: any }) => [c.id, c.name])
		);
		return allProduct.map((p: { category: string | number }) => ({
			...p,
			category: categoryMap[p.category] || p.category,
		}));
	}, [allProduct, allCategory]);

	const handleOpenAddProductFormModal = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		return setIsAddProductFormModalOpen(true);
	};

	const handleOpenAddCategoryFormModal = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		return setIsAddCategoryFormModalOpen(true);
	};

	const handleToggleManageCategoryDrawer = (state: boolean) => {
		return setIsManageCategoryDrawerOpen(state);
	};

	const handlePagination = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		type: "previous" | "next"
	) => {
		e.preventDefault();
		switch (type) {
			case "previous":
				if (paginationIndex <= 1) return;
				setPaginationIndex((prev) => prev - 1);
				break;
			case "next":
				if (paginationIndex >= 10) return;
				setPaginationIndex((prev) => prev + 1);
				break;
			default:
				break;
		}
	};

	const handleNavigateToInventoryDetail = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		id: string | Record<any, any>
	) => {
		e.preventDefault();
		return navigate(`/inventory/${id}`);
	};

	const handleToggleInventory = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
	};

	const handleAlertModalClickOutside = () => {
		return setIsAlertModalOpen(true);
	};

	const handleAlertModalCallToActionClick = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		setAlertModalInfo(null);
		queryClient.invalidateQueries({ queryKey: ["all-product", TOKEN] });
		queryClient.invalidateQueries({ queryKey: ["all-category", TOKEN] });
		return setIsAlertModalOpen(false);
	};

	const handleToggleCategoryActivation = async (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.MouseEvent<HTMLButtonElement, MouseEvent>,
		category: "*" | Record<string, any>
	) => {
		e.stopPropagation();
		try {
			if (category === "*") {
				setIsActivating(true);
				if (!Array.isArray(allCategory) || allCategory.length === 0) return;
				await Promise.all(
					allCategory.map(async (category: Record<string, any>) => {
						const updatedCategory = {
							...category,
							status: "active",
						};
						await editCategoryService(TOKEN, category?.id, updatedCategory);
					})
				);
				queryClient.invalidateQueries({ queryKey: ["all-category", TOKEN] });
				return setIsActivating(false);
			}
			const updatedCategory = {
				...category,
				status: category.status === "active" ? "inactive" : "active",
			};
			await editCategoryService(TOKEN, category.id, updatedCategory);
			queryClient.invalidateQueries({ queryKey: ["all-category", TOKEN] });
		} catch (error) {
			setIsActivating(false);
			console.error("Error toggling category status:", error);
		}
	};

	const handleOpenEditCategory = (
		e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
		category: Record<string, any>
	) => {
		e.stopPropagation();
		setSelectedCategory(category);
		setIsEditCategoryFormModalOpen(true);
	};

	useEffect(() => {
		if (!isEditCategoryFormModalOpen) {
			setSelectedCategory(null);
		}
	}, [isEditCategoryFormModalOpen]);

	const manageCategory = (
		<Box
			component={"div"}
			role="presentation"
			className="manage-category-drawer-box"
			sx={{ width: "inherit", height: "inherit" }}
		>
			<Stack height={"inherit"} justifyContent={"space-between"}>
				<Stack className="title-bar">
					<Stack
						direction={"row"}
						overflow={"hidden"}
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
									"&:hover": {
										backgroundColor: "inherit",
									},
								}}
								onClick={() => handleToggleManageCategoryDrawer(false)}
							>
								<CloseIcon />
							</IconButton>
						</Box>
						<Box overflow={"hidden"}>
							<Typography
								variant="h2"
								fontFamily={"Roboto"}
								fontWeight={600}
								fontSize={20}
								lineHeight={"normal"}
								color="var(--drawer-header-text-color)"
							>
								Manage Categories
							</Typography>
						</Box>
					</Stack>
					<Box
						overflow={"hidden"}
						borderRadius={"50px"}
						bgcolor={"var(--badge-bg-color)"}
						padding={"calc(var(--basic-padding)/4)"}
					>
						<Typography
							variant="subtitle1"
							fontFamily={"Roboto"}
							fontWeight={400}
							fontSize={12}
							lineHeight={"normal"}
							color="var(--primary-color)"
						>
							48 Categories
						</Typography>
					</Box>
				</Stack>
				<Stack className="modal-items">
					{allCategory?.map((category: Record<string, any>, index: number) => {
						return (
							<Stack
								key={index}
								direction={"row"}
								alignItems={"center"}
								justifyContent={"space-between"}
								padding={"calc(var(--basic-padding)) 0"}
								borderBottom={"1px solid var(--drawer-item-border-color)"}
							>
								<Box overflow={"hidden"}>
									<Typography
										variant="subtitle1"
										fontFamily={"Roboto"}
										fontWeight={400}
										fontSize={16}
										lineHeight={"normal"}
										color="var(--drawer-subtitle-text-color)"
									>
										{category?.name}
									</Typography>
								</Box>
								<Stack
									direction={"row"}
									overflow={"hidden"}
									alignItems={"center"}
									flexShrink={matches ? 1 : 0}
									gap={"calc(var(--flex-gap))"}
								>
									<Box overflow={"hidden"}>
										<Typography
											component={"p"}
											variant="subtitle2"
											fontFamily={"Roboto"}
											fontWeight={400}
											fontSize={16}
											lineHeight={"normal"}
											color="var(--primary-color)"
											onClick={(e) => handleOpenEditCategory(e, category)}
											sx={{ textDecoration: "underline", cursor: "pointer" }}
										>
											Edit
										</Typography>
									</Box>
									<Box overflow={"hidden"} flexShrink={matches ? 1 : 0}>
										<SwitchField
											checked={category?.status === "active"}
											onChange={(e) =>
												handleToggleCategoryActivation(e, category)
											}
										/>
									</Box>
								</Stack>
							</Stack>
						);
					})}
				</Stack>
				<Stack className="modal-call-to-action">
					<Box overflow={"hidden"}>
						<BaseButton
							radius="5px"
							disableElevation
							variant="outlined"
							sx={{ width: "100%" }}
							border="1px solid var(--primary-color)"
							onClick={handleOpenAddCategoryFormModal}
						>
							<Typography
								variant={"button"}
								fontFamily={"inherit"}
								fontWeight={"inherit"}
								fontSize={"inherit"}
								lineHeight={"inherit"}
								textTransform={"inherit"}
								color={"var(--primary-color)"}
							>
								Create New Category
							</Typography>
						</BaseButton>
					</Box>
					<Box overflow={"hidden"}>
						<BaseButton
							radius="5px"
							disableElevation
							variant="contained"
							sx={{ width: "100%" }}
							bgcolor="var(--success-color)"
							onClick={(e) => handleToggleCategoryActivation(e, "*")}
						>
							{isActivating ? (
								<CircularProgress color="inherit" className="loader" />
							) : (
								<Typography
									variant={"button"}
									fontFamily={"inherit"}
									fontWeight={"inherit"}
									fontSize={"inherit"}
									lineHeight={"inherit"}
									textTransform={"inherit"}
									color={"var(--light-color)"}
								>
									Activate All
								</Typography>
							)}
						</BaseButton>
					</Box>
				</Stack>
			</Stack>
		</Box>
	);

	return (
		<AppLayout pageId="Inventory">
			<InventoryWrapper>
				<AddProductForm />
				<AddCategoryForm />
				{selectedCategory && (
					<EditCategoryForm initialFormDetails={selectedCategory} />
				)}
				{/* this modal should be able to handle product and category updates */}
				<BaseAlertModal
					callToAction="Close"
					open={isAlertModalOpen}
					icon={<SuccessModalIcon />}
					title={alertModalInfo?.title}
					message={alertModalInfo?.message}
					className="add-product-successful-modal"
					handleClose={handleAlertModalClickOutside}
					callToActionBgColor="var(--success-color)"
					handleCallToAction={handleAlertModalCallToActionClick}
				/>
				<Drawer
					variant="temporary"
					open={isManageCategoryDrawerOpen}
					sx={{
						display: { mobile: "block", tablet: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: "var(--manage-category-modal-width)",
						},
					}}
					onClose={() => handleToggleManageCategoryDrawer(false)}
				>
					{manageCategory}
				</Drawer>
				<Drawer
					anchor="right"
					variant="temporary"
					open={isManageCategoryDrawerOpen}
					sx={{
						display: { mobile: "none", tablet: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							borderTopLeftRadius: "15px",
							width: "var(--manage-category-modal-width)",
						},
					}}
					onClose={() => handleToggleManageCategoryDrawer(false)}
				>
					{manageCategory}
				</Drawer>
				<Stack
					direction={{ laptop: "row" }}
					gap={"calc(var(--flex-gap)/2)"}
					justifyContent={"space-between"}
					alignItems={{ laptop: "center" }}
				>
					<Box>
						<Typography
							variant="h1"
							fontFamily={"Roboto"}
							fontWeight={600}
							fontSize={28}
							lineHeight={"normal"}
							color="var(--dark-color)"
						>
							General Inventory
						</Typography>
					</Box>
					<Stack
						gap={"calc(var(--flex-gap)/2)"}
						direction={{ miniTablet: "row" }}
					>
						<Box overflow={"hidden"}>
							<BaseButton
								variant="contained"
								disableElevation
								sx={{
									width: { mobile: "100%", miniTablet: "auto" },
									padding: {
										mobile:
											"calc(var(--basic-padding)/2) calc(var(--basic-padding))",
										miniTablet: "calc(var(--basic-padding)/2)",
										tablet:
											"calc(var(--basic-padding)/2) calc(var(--basic-padding))",
									},
								}}
								onClick={handleOpenAddProductFormModal}
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
									Add Product
								</Typography>
							</BaseButton>
						</Box>
						<Box overflow={"hidden"}>
							<BaseButton
								variant="outlined"
								disableElevation
								sx={{
									width: { mobile: "100%", miniTablet: "auto" },
									padding: {
										mobile:
											"calc(var(--basic-padding)/2) calc(var(--basic-padding))",
										miniTablet: "calc(var(--basic-padding)/2)",
										tablet:
											"calc(var(--basic-padding)/2) calc(var(--basic-padding))",
									},
								}}
								onClick={() => handleToggleManageCategoryDrawer(true)}
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
									Manage Category
								</Typography>
							</BaseButton>
						</Box>
					</Stack>
				</Stack>
				<Grid container component={"div"} spacing={"calc(var(--flex-gap))"}>
					<Grid size={{ mobile: 12 }} />
					{inventorySummaryCards.map((card, index) => {
						return (
							<Grid key={index} size={{ mobile: 12, miniTablet: 6, laptop: 3 }}>
								<Card
									sx={{
										border: "none",
										borderRadius: "12px",
									}}
								>
									<CardContent className="card-content">
										<Stack
											height={"100%"}
											direction={"row"}
											padding={"var(--basic-padding)"}
											gap={"calc(var(--flex-gap) / 2)"}
										>
											<Box
												overflow={"hidden"}
												flex={{ miniTablet: "0 0 auto" }}
											>
												{card.icon}
											</Box>
											<Stack
												overflow={"hidden"}
												gap={"var(--flex-gap)"}
												justifyContent={"space-between"}
												flex={{ miniTablet: "1 1 auto" }}
											>
												<Box overflow={"hidden"}>
													<Typography
														variant="subtitle1"
														fontFamily={"Roboto"}
														fontWeight={600}
														fontSize={32}
														lineHeight={"normal"}
														color="var(--primary-color)"
													>
														{card.amount}
													</Typography>
													<Typography
														variant="body1"
														fontFamily={"Roboto"}
														fontWeight={400}
														fontSize={16}
														lineHeight={"normal"}
														color="var(--input-field-text-color)"
													>
														{card.name}
													</Typography>
												</Box>
												<Stack
													direction={"row"}
													overflow={"hidden"}
													alignItems={"center"}
													gap={"calc(var(--flex-gap)/4)"}
												>
													<Box overflow={"hidden"} display={"flex"}>
														{Number(card.traction) > 0 ? (
															<DashboardCardUpwardTickIcon />
														) : Number(card.traction) < 0 ? (
															<DashboardCardDownwardTickIcon />
														) : null}
													</Box>
													<Box>
														<Typography
															variant="subtitle2"
															fontFamily={"Roboto"}
															fontWeight={400}
															fontSize={12}
															lineHeight={"normal"}
															color="var(--success-color)"
														>
															{Number(card?.traction) > 0 ? (
																<Typography
																	component={"span"}
																	fontFamily={"inherit"}
																	fontWeight={"inherit"}
																	fontSize={"inherit"}
																	lineHeight={"inherit"}
																	color="inherit"
																>
																	{card?.traction}
																</Typography>
															) : Number(card.traction) < 0 ? (
																<Typography
																	component={"span"}
																	fontFamily={"inherit"}
																	fontWeight={"inherit"}
																	fontSize={"inherit"}
																	lineHeight={"inherit"}
																	color="var(--error-color)"
																>
																	{card?.traction}
																</Typography>
															) : null}
														</Typography>
													</Box>
												</Stack>
											</Stack>
										</Stack>
									</CardContent>
								</Card>
							</Grid>
						);
					})}
					<Grid size={{ mobile: 12 }} />
					<Grid size={{ mobile: 12 }}>
						<Stack gap={"calc(var(--flex-gap)/2)"}>
							<Grid
								container
								component={"div"}
								spacing={{
									mobile: "calc(var(--flex-gap)/2)",
									desktop: "var(--flex-gap)",
								}}
								alignItems={{ desktop: "center" }}
							>
								<Grid size={{ mobile: 12, desktop: 6 }}>
									<Stack
										direction={"row"}
										overflow={"hidden"}
										gap={"calc(var(--flex-gap)/2)"}
									>
										<Box overflow={"hidden"}>
											<BaseButton
												variant="outlined"
												disableElevation
												sx={{
													width: { mobile: "100%", miniTablet: "auto" },
													padding: {
														mobile:
															"calc(var(--basic-padding)/2) calc(var(--basic-padding))",
														miniTablet: "calc(var(--basic-padding)/2)",
														tablet:
															"calc(var(--basic-padding)/2) calc(var(--basic-padding))",
													},
													"&:hover": {
														border: "none",
														color: "var(--light-color)",
														backgroundColor: "var(--primary-color)",
													},
												}}
												onClick={handleToggleInventory}
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
													All
												</Typography>
											</BaseButton>
										</Box>
										<Box overflow={"hidden"}>
											<BaseButton
												variant="outlined"
												disableElevation
												sx={{
													width: { mobile: "100%", miniTablet: "auto" },
													padding: {
														mobile:
															"calc(var(--basic-padding)/2) calc(var(--basic-padding))",
														miniTablet: "calc(var(--basic-padding)/2)",
														tablet:
															"calc(var(--basic-padding)/2) calc(var(--basic-padding))",
													},
													"&:hover": {
														border: "none",
														color: "var(--light-color)",
														backgroundColor: "var(--primary-color)",
													},
												}}
												onClick={handleToggleInventory}
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
													Pending
												</Typography>
											</BaseButton>
										</Box>
										<Box overflow={"hidden"}>
											<BaseButton
												variant="outlined"
												disableElevation
												sx={{
													width: { mobile: "100%", miniTablet: "auto" },
													padding: {
														mobile:
															"calc(var(--basic-padding)/2) calc(var(--basic-padding))",
														miniTablet: "calc(var(--basic-padding)/2)",
														tablet:
															"calc(var(--basic-padding)/2) calc(var(--basic-padding))",
													},
													"&:hover": {
														border: "none",
														color: "var(--light-color)",
														backgroundColor: "var(--primary-color)",
													},
												}}
												onClick={handleToggleInventory}
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
													Rejected
												</Typography>
											</BaseButton>
										</Box>
									</Stack>
								</Grid>
								<Grid size={{ mobile: 12, desktop: 6 }}>
									<Grid
										container
										component={"div"}
										flexWrap={{ miniTablet: "nowrap" }}
										spacing={{
											mobile: "calc(var(--flex-gap)/2)",
										}}
										justifyContent={{ desktop: "flex-end" }}
									>
										<Grid
											flexGrow={{ mobile: 1 }}
											size={{ mobile: 12, miniTablet: 4 }}
										>
											<Box overflow={"hidden"} flex={1} height={"100%"}>
												<BaseInput
													startAdornment={
														<InputAdornment position="start">
															<SearchIcon />
														</InputAdornment>
													}
													border={"none"}
													borderradius={"6px"}
													placeholder="Search"
													bgcolor="var(--light-color)"
													padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
												/>
											</Box>
										</Grid>
										<Grid
											width={{ mobile: "auto" }}
											size={{ mobile: 6, miniTablet: 4 }}
											flexGrow={{ mobile: 1, miniTablet: 0 }}
										>
											<Box overflow={"hidden"} display={"flex"} height={"100%"}>
												<BaseButton
													radius="6px"
													padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
													variant="contained"
													disableElevation
													endIcon={<ExportIcon />}
													bgcolor="var(--light-color)"
													colour={"var(--modal-message-text-color)"}
													sx={{
														"& .MuiButton-endIcon": {
															marginRight: 0,
															display: "flex",
														},
														width: { mobile: "100%", miniTablet: "auto" },
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
														Export Data
													</Typography>
												</BaseButton>
											</Box>
										</Grid>
										<Grid
											width={{ mobile: "auto" }}
											size={{ mobile: 6, miniTablet: 4 }}
											flexGrow={{ mobile: 1, miniTablet: 0 }}
										>
											<Box overflow={"hidden"} display={"flex"} height={"100%"}>
												<BaseButton
													radius="6px"
													padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
													variant="contained"
													disableElevation
													endIcon={<FilterIcon />}
													bgcolor="var(--light-color)"
													colour={"var(--modal-message-text-color)"}
													sx={{
														"& .MuiButton-endIcon": {
															marginRight: 0,
															display: "flex",
														},
														width: { mobile: "100%", miniTablet: "auto" },
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
														Filter
													</Typography>
												</BaseButton>
											</Box>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
							<Card
								sx={{
									border: "none",
									borderRadius: "12px",
								}}
							>
								<CardContent className="card-content">
									<Box component={"div"} className="order-table-box">
										<InventoryTable
											rows={allProductWithCategoryName}
											handleViewDetailsClick={handleNavigateToInventoryDetail}
										/>
									</Box>
								</CardContent>
							</Card>
							<Grid container component={"div"} spacing={"var(--flex-gap)"}>
								<Grid
									size={{ mobile: 12, laptop: 8 }}
									display={{ mobile: "none", laptop: "grid" }}
								></Grid>
								<Grid size={{ mobile: 12, laptop: 4 }}>
									<Stack
										direction={"row"}
										overflow={"hidden"}
										borderRadius={"6px"}
										alignItems={"center"}
										justifyContent={"space-around"}
										border={"1px solid var(--input-field-border-color)"}
									>
										<Box overflow={"hidden"} display={"flex"}>
											<BaseButton
												radius="0"
												border="none"
												variant="text"
												disableElevation
												colour={"var(--dark-color)"}
												padding="0 calc(var(--basic-padding)/2)"
												onClick={(e) => handlePagination(e, "previous")}
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
													Previous
												</Typography>
											</BaseButton>
										</Box>
										<Box
											display={"flex"}
											overflow={"hidden"}
											bgcolor={"var(--primary-color)"}
											padding={"calc(var(--basic-padding)/2)"}
										>
											<Typography
												variant="h3"
												fontFamily={"Roboto"}
												fontWeight={600}
												fontSize={10}
												lineHeight={"normal"}
												color="var(--light-color)"
											>
												{paginationIndex}
											</Typography>
										</Box>
										<Box overflow={"hidden"} display={"flex"}>
											<BaseButton
												radius="0"
												border="none"
												variant="text"
												disableElevation
												colour={"var(--dark-color)"}
												padding="0 calc(var(--basic-padding)/2)"
												onClick={(e) => handlePagination(e, "next")}
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
													Next
												</Typography>
											</BaseButton>
										</Box>
									</Stack>
								</Grid>
							</Grid>
						</Stack>
					</Grid>
				</Grid>
			</InventoryWrapper>
		</AppLayout>
	);
};
