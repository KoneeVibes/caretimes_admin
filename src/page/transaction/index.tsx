import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { AppLayout } from "../../container/layout/app";
import { TransactionWrapper } from "./styled";
import {
	CancelledTransactionIcon,
	DisputedTransactionIcon,
	SalesVolumeIcon,
} from "../../asset";
import { useQuery } from "@tanstack/react-query";
import Cookies from "universal-cookie";
import { retrieveTransactionOverviewService } from "../../util/transaction/retrieveTransactionOverview";
import { BaseButton } from "../../component/button/styled";
import { useState } from "react";
import { TransactionTable } from "../../container/table/transactiontable";
import { retrieveAllTransactionService } from "../../util/transaction/retrieveAllTransaction";
import { downloadTransactionReceiptService } from "../../util/transaction/downloadTransactionReceipt";

export const Transaction = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const [isFetching, setIsFetching] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const [filter, setFilter] = useState<"abandoned" | "failed" | "success">(
		"success",
	);
	const [paginationIndex, setPaginationIndex] = useState({
		page: "1",
		perPage: "5",
		totalPages: "1",
	});

	const { data: transactionOverview } = useQuery({
		queryKey: [`transaction-overview`, TOKEN],
		queryFn: async () => {
			const response = await retrieveTransactionOverviewService(TOKEN);
			return response;
		},
		enabled: !!TOKEN,
	});

	const { data: allTransaction } = useQuery({
		queryKey: [`all-transaction`, TOKEN, filter, paginationIndex],
		queryFn: async () => {
			setIsFetching(true);
			const response = await retrieveAllTransactionService(
				TOKEN,
				filter,
				paginationIndex,
			);
			if (!Array.isArray(response) && response?.meta) {
				setPaginationIndex((prev) => ({
					...prev,
					totalPages: String(response?.meta?.totalPages ?? "1"),
				}));
			}
			setIsFetching(false);
			return response?.data;
		},
		enabled: !!TOKEN,
	});

	const transactionSummaryCards = [
		{
			name: "Sales Volume",
			amount: transactionOverview?.success ?? 0,
			icon: <SalesVolumeIcon />,
		},
		{
			name: "Failed Transactions",
			amount: transactionOverview?.failed ?? 0,
			icon: <DisputedTransactionIcon />,
		},
		{
			name: "Abandoned Transactions",
			amount: transactionOverview?.abandoned ?? 0,
			icon: <CancelledTransactionIcon />,
		},
	];

	const handleToggleFilter = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		incomingFilter: "success" | "failed" | "abandoned",
	) => {
		e.preventDefault();
		if (incomingFilter === filter) return;
		setFilter(incomingFilter);
	};

	const handlePagination = (
		e: React.MouseEvent<HTMLButtonElement>,
		type: "previous" | "next",
	) => {
		e.preventDefault();
		setPaginationIndex((prev) => {
			const currentPage = parseInt(prev.page, 10);
			const newPage =
				type === "previous"
					? Math.max(1, currentPage - 1)
					: Math.min(parseInt(prev.totalPages, 10), currentPage + 1);
			return {
				...prev,
				page: newPage.toString(),
			};
		});
	};

	const handleDownloadReceipt = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		id: string,
	) => {
		e.preventDefault();
		if (!id.trim() || isDownloading) return;
		setIsDownloading(true);
		try {
			const blob = await downloadTransactionReceiptService(TOKEN, id);
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "transaction_receipt.pdf";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error: any) {
			console.error("Transaction receipt failed:", error);
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<AppLayout pageId="Transactions">
			<TransactionWrapper>
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
							Transactions
						</Typography>
					</Box>
				</Stack>
				<Grid container component={"div"} spacing={"calc(var(--flex-gap))"}>
					<Grid size={{ mobile: 12 }} />
					{transactionSummaryCards.map((card, index) => {
						return (
							<Grid key={index} size={{ mobile: 12, miniTablet: 6, laptop: 4 }}>
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
								<Grid size={{ mobile: 12, xl: 9 }}>
									<Stack
										direction={"row"}
										flexWrap={"wrap"}
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
													border:
														filter === "success"
															? "none"
															: "1px solid var(--input-field-text-color)",
													color:
														filter === "success"
															? "var(--light-color)"
															: "var(--dark-color)",
													background:
														filter === "success"
															? "var(--primary-color)"
															: "var(--light-color)",
													"&:hover": {
														border:
															filter === "success"
																? "none"
																: "1px solid var(--input-field-text-color)",
														color:
															filter === "success"
																? "var(--light-color)"
																: "var(--dark-color)",
														background:
															filter === "success"
																? "var(--primary-color)"
																: "var(--light-color)",
													},
												}}
												onClick={(e) => handleToggleFilter(e, "success")}
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
													Successful
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
													border:
														filter === "failed"
															? "none"
															: "1px solid var(--input-field-text-color)",
													color:
														filter === "failed"
															? "var(--light-color)"
															: "var(--dark-color)",
													background:
														filter === "failed"
															? "var(--primary-color)"
															: "var(--light-color)",
													"&:hover": {
														border:
															filter === "failed"
																? "none"
																: "1px solid var(--input-field-text-color)",
														color:
															filter === "failed"
																? "var(--light-color)"
																: "var(--dark-color)",
														background:
															filter === "failed"
																? "var(--primary-color)"
																: "var(--light-color)",
													},
												}}
												onClick={(e) => handleToggleFilter(e, "failed")}
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
													Failed
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
													border:
														filter === "abandoned"
															? "none"
															: "1px solid var(--input-field-text-color)",
													color:
														filter === "abandoned"
															? "var(--light-color)"
															: "var(--dark-color)",
													background:
														filter === "abandoned"
															? "var(--primary-color)"
															: "var(--light-color)",
													"&:hover": {
														border:
															filter === "abandoned"
																? "none"
																: "1px solid var(--input-field-text-color)",
														color:
															filter === "abandoned"
																? "var(--light-color)"
																: "var(--dark-color)",
														background:
															filter === "abandoned"
																? "var(--primary-color)"
																: "var(--light-color)",
													},
												}}
												onClick={(e) => handleToggleFilter(e, "abandoned")}
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
													Abandoned
												</Typography>
											</BaseButton>
										</Box>
									</Stack>
								</Grid>
								<Grid size={{ mobile: 12, xl: 6 }}>
									{/* <Grid
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
                                        </Grid> */}
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
										<TransactionTable
											rows={allTransaction}
											handleViewDetailsClick={handleDownloadReceipt}
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
												disabled={
													parseInt(paginationIndex.page, 10) === 1 || isFetching
												}
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
												{`${paginationIndex.page} / ${paginationIndex.totalPages}`}
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
												disabled={
													paginationIndex.page === paginationIndex.totalPages ||
													isFetching
												}
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
			</TransactionWrapper>
		</AppLayout>
	);
};
