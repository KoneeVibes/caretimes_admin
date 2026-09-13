import {
	Box,
	Card,
	CardContent,
	CircularProgress,
	Grid,
	IconButton,
	Stack,
	TableBody,
	TableCell,
	TableRow,
	Typography,
	useMediaQuery,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { AppLayout } from "../../../container/layout/app";
import { OrderDetailsWrapper } from "./styled";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { retrieveOrderByIdService } from "../../../util/order/retrieveOrderById";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { formatDate } from "../../../helper/dateFormatter";
import {
	OrderDeliveryIcon,
	OrderDiscountIcon,
	OrderSubTotalIcon,
	OrderTaxIcon,
} from "../../../asset";
import { BaseTable } from "../../../component/table";
import { BaseButton } from "../../../component/button/styled";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseLabel } from "../../../component/form/label/styled";
import { BaseSelect } from "../../../component/form/select/styled";
import { BaseOption } from "../../../component/form/option/styled";

export const OrderDetails = () => {
	const statusColorMap = {
		unfulfilled: "var(--bright-violet-color) !important",
		paid: "var(--bright-yellow-color) !important",
		fulfilled: "var(--success-color) !important",
	};

	const breakdown = [
		{ icon: <OrderSubTotalIcon />, key: "subTotal", label: "Sub Total" },
		{ icon: <OrderTaxIcon />, key: "tax", label: "Tax" },
		{ icon: <OrderDiscountIcon />, key: "discount", label: "Discount" },
		{ icon: <OrderDeliveryIcon />, key: "deliveryFee", label: "Delivery Fee" },
	];

	const orderCartItemsTableHeaders = [
		"S/N",
		"Image",
		"Name",
		"Price",
		"Quantity",
		"Total",
	];

	const allowableStatuses = [
		"paid",
		"fulfilled",
		"unfulfilled",
		"cancelled",
		"disputed",
	];

	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const navigate = useNavigate();
	const { id = "" } = useParams();
	const matches = useMediaQuery("(max-width:250px)");

	const [isLoading, setIsLoading] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<Record<
		string,
		any
	> | null>(null);

	useEffect(() => {
		if (!id.trim()) return;
		retrieveOrderByIdService(TOKEN, id)
			.then(async (data) => {
				setSelectedOrder(data);
			})
			.catch((err) => {
				console.error("Failed to fetch selected order:", err);
			});
	}, [TOKEN, id]);

	const statusEntries = Object.entries(statusColorMap);
	const selectedStatus = String(selectedOrder?.status || "").toLowerCase();
	const isStatusColored = (status: string) => {
		if (!Object.hasOwn(statusColorMap, selectedStatus)) {
			return true;
		}
		if (selectedStatus === "fulfilled") {
			return true;
		}
		if (selectedStatus === "paid") {
			return status === "unfulfilled" || status === "paid";
		}
		return status === "unfulfilled";
	};

	const handleNavigateBackwards = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault();
		return navigate(-1);
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
			  }),
	) => {
		const { name, value } = e.target as HTMLInputElement;
		setSelectedOrder((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleUpdateOrderStatus = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.stopPropagation();
		if (!selectedOrder) return;
		setIsLoading(true);
		// we will likely call the updateOrder service here and setIsLoading(true) and then setIsLoading(false) after the service call is complete. This will ensure that the UI reflects the updated order status in real-time.
		try {
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AppLayout pageId="Orders">
			<OrderDetailsWrapper>
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
							Order Details
						</Typography>
					</Box>
				</Stack>
				<Masonry
					sequential
					spacing={2}
					sx={{ margin: 0 }}
					columns={{ mobile: 1, laptop: 2 }}
				>
					<Grid size={{ mobile: 12, laptop: 6 }}>
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
									gap={"calc(var(--flex-gap))"}
									padding={"calc(var(--basic-padding)/2)"}
								>
									<Stack gap={"calc(var(--flex-gap)/4)"}>
										<Stack className="title-bar">
											<Box>
												<Typography
													variant="subtitle1"
													fontFamily={"Inter"}
													fontWeight={500}
													fontSize={17}
													lineHeight={"normal"}
													color="var(--dark-color-variant)"
												>
													{selectedOrder?.transactionReference}
												</Typography>
											</Box>
											<Box
												overflow={"hidden"}
												sx={{
													padding:
														"calc(var(--basic-padding)/8) calc(var(--basic-padding)/4)",
													border: `1px solid ${
														(
															{
																fulfilled: "var(--success-color) !important",
																paid: "var(--bright-yellow-color) !important",
																unfulfilled:
																	"var(--bright-violet-color) !important",
																cancelled:
																	"var(--bright-blue-color) !important",
																disputed: "var(--error-color) !important",
															} as Record<string, string>
														)[String(selectedOrder?.status).toLowerCase()]
													}`,
													borderRadius: "12px",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													width: matches ? "revert" : "fit-content",
												}}
											>
												<Typography
													variant="subtitle2"
													fontFamily={"Inter"}
													fontWeight={500}
													fontSize={12}
													lineHeight={"normal"}
													color={
														(
															{
																fulfilled: "var(--success-color) !important",
																paid: "var(--bright-yellow-color) !important",
																unfulfilled:
																	"var(--bright-violet-color) !important",
																cancelled:
																	"var(--bright-blue-color) !important",
																disputed: "var(--error-color) !important",
															} as Record<string, string>
														)[String(selectedOrder?.status).toLowerCase()]
													}
												>
													{selectedOrder?.status}
												</Typography>
											</Box>
										</Stack>
										<Box>
											<Typography
												variant="subtitle2"
												fontFamily={"Gilroy"}
												fontWeight={400}
												fontSize={14}
												lineHeight={"normal"}
												color="var(--dark-color-variant)"
												whiteSpace="normal"
											>
												Order / Order Details /{" "}
												{selectedOrder?.transactionReference} -{" "}
												{formatDate(selectedOrder?.createdAt, true)}
											</Typography>
										</Box>
									</Stack>
									<Stack className="progress-area">
										<Box>
											<Typography
												variant="h4"
												fontFamily={"Inter"}
												fontWeight={500}
												fontSize={17}
												lineHeight={"normal"}
												color="var(--dark-color-variant)"
											>
												Progress
											</Typography>
										</Box>
										<Stack className="status-bar">
											{statusEntries.map(([status, backgroundColor]) => {
												const isColored = isStatusColored(status);
												return (
													<Stack
														flex={1}
														key={status}
														overflow={"hidden"}
														gap={"calc(var(--flex-gap)/4)"}
													>
														<Box
															sx={{
																borderRadius: "12px",
																padding: "calc(var(--basic-padding)/8)",
																backgroundColor: isColored
																	? backgroundColor
																	: "var(--light-color-variant)",
															}}
														/>
														<Box>
															<Typography
																variant="subtitle1"
																fontFamily={"Gilroy"}
																fontWeight={400}
																fontSize={14}
																lineHeight={"normal"}
																textTransform="capitalize"
																color="var(--dark-color-variant)"
															>
																{status}
															</Typography>
														</Box>
													</Stack>
												);
											})}
										</Stack>
									</Stack>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid size={{ mobile: 12, laptop: 6 }}>
						<Card
							sx={{
								boxShadow: "none",
								borderRadius: "12px",
								border: "1px solid var(--input-field-border-color)",
							}}
						>
							<CardContent className="card-content">
								<Stack height={"100%"} gap={"calc(var(--flex-gap))"}>
									<Box
										sx={{
											padding: "calc(var(--basic-padding)/2)",
											borderBottom: "1px solid var(--row-item-border-color)",
										}}
									>
										<Typography
											variant="h4"
											fontFamily={"Gilroy"}
											fontWeight={400}
											fontSize={16}
											lineHeight={"normal"}
											color="var(--input-field-text-color)"
										>
											Order Summary
										</Typography>
									</Box>
									<Stack padding={"0 calc(var(--basic-padding)/2)"}>
										{breakdown.map((item, index) => {
											return (
												<Stack key={index} className="break-down-item">
													<Stack className="break-down-item-title">
														<Box>{item.icon}</Box>
														<Box overflow={"hidden"}>
															<Typography
																variant="subtitle1"
																fontFamily={"Gilroy"}
																fontWeight={400}
																fontSize={14}
																lineHeight={"normal"}
																textTransform="capitalize"
																color="var(--input-field-text-color)"
															>
																{item.label}
															</Typography>
														</Box>
													</Stack>
													<Box overflow={"hidden"}>
														<Typography
															variant="subtitle1"
															fontFamily={"Gilroy"}
															fontWeight={400}
															fontSize={14}
															lineHeight={"normal"}
															textTransform="capitalize"
															color="var(--input-field-text-color)"
														>
															₦{selectedOrder?.[item.key]?.toLocaleString()}
														</Typography>
													</Box>
												</Stack>
											);
										})}
									</Stack>
									<Stack className="break-down-total">
										<Box overflow={"hidden"}>
											<Typography
												variant="subtitle1"
												fontFamily={"Gilroy"}
												fontWeight={400}
												fontSize={14}
												lineHeight={"normal"}
												textTransform="capitalize"
												color="var(--input-field-text-color)"
											>
												Total Amount
											</Typography>
										</Box>
										<Box overflow={"hidden"}>
											<Typography
												variant="subtitle1"
												fontFamily={"Gilroy"}
												fontWeight={400}
												fontSize={14}
												lineHeight={"normal"}
												textTransform="capitalize"
												color="var(--input-field-text-color)"
											>
												₦{selectedOrder?.totalPayable?.toLocaleString()}
											</Typography>
										</Box>
									</Stack>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid size={{ mobile: 12, laptop: 6 }}>
						<Card
							sx={{
								boxShadow: "none",
								borderRadius: "12px",
								border: "1px solid var(--input-field-border-color)",
							}}
						>
							<CardContent className="card-content">
								<Stack height={"100%"} gap={"calc(var(--flex-gap))"}>
									<BaseTable headers={orderCartItemsTableHeaders}>
										<TableBody>
											{selectedOrder?.cartItems?.map(
												(item: any, index: number) => {
													return (
														<TableRow key={index}>
															<TableCell>{index + 1}</TableCell>
															<TableCell>
																<Box
																	component={"div"}
																	className="product-thumbnail"
																>
																	<img
																		src={item?.productImages?.[0]}
																		alt={`Product Thumbnail ${index + 1}`}
																	/>
																</Box>
															</TableCell>
															<TableCell>{item?.productName}</TableCell>
															<TableCell>{`₦${item?.unitPrice?.toLocaleString()}`}</TableCell>
															<TableCell>{item?.quantity}</TableCell>
															<TableCell>{`₦${(item?.unitPrice * item?.quantity)?.toLocaleString()}`}</TableCell>
														</TableRow>
													);
												},
											)}
											<TableRow
												sx={{
													backgroundColor: "var(--dull-yellow-color)",
												}}
											>
												<TableCell colSpan={5}>Total</TableCell>
												<TableCell>{`₦${selectedOrder?.totalPayable?.toLocaleString()}`}</TableCell>
											</TableRow>
										</TableBody>
									</BaseTable>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid size={{ mobile: 12, laptop: 6 }}>
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
					</Grid>
					<Grid size={{ mobile: 12, laptop: 6 }}>
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
										gap={"calc(var(--flex-gap)/4)"}
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
												Order Status:
											</Typography>
										</Box>
										<Box
											overflow={"hidden"}
											sx={{
												padding:
													"calc(var(--basic-padding)/8) calc(var(--basic-padding)/4)",
												color: `${
													(
														{
															fulfilled: "var(--success-color) !important",
															paid: "var(--bright-yellow-color) !important",
															unfulfilled:
																"var(--bright-violet-color) !important",
															cancelled: "var(--bright-blue-color) !important",
															disputed: "var(--error-color) !important",
														} as Record<string, string>
													)[String(selectedOrder?.status).toLowerCase()]
												}`,
												backgroundColor: `${
													(
														{
															fulfilled:
																"var(--success-color-variant) !important",
															paid: "var(--dull-yellow-color) !important",
															unfulfilled:
																"var(--bright-violet-color-variant) !important",
															cancelled:
																"var(--bright-blue-color-variant) !important",
															disputed:
																"var(--error-color-variant-II) !important",
														} as Record<string, string>
													)[String(selectedOrder?.status).toLowerCase()]
												}`,
												borderRadius: "12px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												width: matches ? "revert" : "fit-content",
											}}
										>
											<Typography
												variant="subtitle2"
												fontFamily={"Inter"}
												fontWeight={500}
												fontSize={12}
												lineHeight={"normal"}
												color="inherit"
											>
												{selectedOrder?.status}
											</Typography>
										</Box>
									</Stack>
									<Stack className="call-to-action">
										<Box flexGrow={1} overflow={"hidden"}>
											<BaseFieldSet>
												<BaseLabel>Update Order Status</BaseLabel>
												<BaseSelect
													name="status"
													radius="10px"
													fontsize="16px"
													fontweight={400}
													// disabled when isLoading is true, to prevent user from changing the status while the update is in progress
													onChange={(e) => handleChange(e)}
													value={selectedOrder?.status || " "}
													colour="var(--input-field-text-color)"
													border="1px solid var(--input-field-border-color)"
													inputProps={{
														renderValue: (selected: string) => {
															return allowableStatuses?.includes(selected)
																? selected
																: "Select Order Status";
														},
													}}
												>
													<BaseOption
														value=" "
														fontsize="16px"
														fontweight={400}
													>
														Select Order Status
													</BaseOption>
													{allowableStatuses
														.filter(
															(status) =>
																!["unfulfilled", "paid"].includes(status),
														)
														?.map((status: string, index: number) => (
															<BaseOption
																key={index}
																value={status}
																fontsize="16px"
																fontweight={400}
															>
																{status.charAt(0).toUpperCase() +
																	status.slice(1)}
															</BaseOption>
														))}
												</BaseSelect>
											</BaseFieldSet>
										</Box>
										<Box overflow={"hidden"}>
											<BaseButton
												variant="contained"
												disableElevation
												radius="10px"
												sx={{
													width: "100%",
												}}
												onClick={handleUpdateOrderStatus}
											>
												{isLoading ? (
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
														Update
													</Typography>
												)}
											</BaseButton>
										</Box>
									</Stack>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid size={{ mobile: 12, laptop: 6 }}>
						<Card
							sx={{
								boxShadow: "none",
								borderRadius: "12px",
								border: "1px solid var(--input-field-border-color)",
							}}
						>
							<CardContent className="card-content">
								<Stack height={"100%"} gap={"calc(var(--flex-gap))"}>
									<Box
										sx={{
											padding: "calc(var(--basic-padding)/2)",
											borderBottom: "1px solid var(--row-item-border-color)",
										}}
									>
										<Typography
											variant="h4"
											fontFamily={"Gilroy"}
											fontWeight={400}
											fontSize={16}
											lineHeight={"normal"}
											color="var(--input-field-text-color)"
										>
											Payment Information
										</Typography>
									</Box>
									<Stack padding={"0 calc(var(--basic-padding)/2)"}>
										<Stack className="break-down-item">
											<Stack className="break-down-item-title">
												<Box overflow={"hidden"}>
													<Typography
														variant="subtitle1"
														fontFamily={"Gilroy"}
														fontWeight={400}
														fontSize={14}
														lineHeight={"normal"}
														textTransform="capitalize"
														color="var(--input-field-text-color)"
													>
														Transaction Reference
													</Typography>
												</Box>
											</Stack>
											<Box overflow={"hidden"}>
												<Typography
													variant="subtitle1"
													fontFamily={"Gilroy"}
													fontWeight={400}
													fontSize={14}
													lineHeight={"normal"}
													textTransform="capitalize"
													color="var(--input-field-text-color)"
												>
													{selectedOrder?.transactionReference}
												</Typography>
											</Box>
										</Stack>
										<Stack className="break-down-item">
											<Stack className="break-down-item-title">
												<Box overflow={"hidden"}>
													<Typography
														variant="subtitle1"
														fontFamily={"Gilroy"}
														fontWeight={400}
														fontSize={14}
														lineHeight={"normal"}
														textTransform="capitalize"
														color="var(--input-field-text-color)"
													>
														Cardholder Name
													</Typography>
												</Box>
											</Stack>
											<Box overflow={"hidden"}>
												<Typography
													variant="subtitle1"
													fontFamily={"Gilroy"}
													fontWeight={400}
													fontSize={14}
													lineHeight={"normal"}
													textTransform="capitalize"
													color="var(--input-field-text-color)"
												></Typography>
											</Box>
										</Stack>
									</Stack>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				</Masonry>
			</OrderDetailsWrapper>
		</AppLayout>
	);
};
