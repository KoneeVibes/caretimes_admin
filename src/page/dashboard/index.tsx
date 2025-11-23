import {
	Box,
	Card,
	CardContent,
	Grid,
	InputAdornment,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { AppLayout } from "../../container/layout/app";
import { DashboardWrapper } from "./styled";
import { dashboardCards, summary } from "../../config/static";
import {
	DashboardCardDownwardTickIcon,
	DashboardCardUpwardTickIcon,
	DownloadIcon,
	ForwardArrowIcon,
	SearchIcon,
} from "../../asset";
import { useContext, useState } from "react";
import { AppContext } from "../../context";
import { BaseButton } from "../../component/button/styled";
import { OrderTable } from "../../container/table/ordertable";
import { BaseInput } from "../../component/form/input/styled";
import { BaseLineGraph } from "../../component/chart/graph";
import { BaseFieldSet } from "../../component/form/fieldset/styled";
import { BaseSelect } from "../../component/form/select/styled";
import { BaseOption } from "../../component/form/option/styled";

export const Dashboard = () => {
	const { authenticatedUser } = useContext(AppContext);
	const matchesLaptopAndAbove = useMediaQuery("(min-width:1024px)");

	const orders = [] as Record<string, any>[];
	const filters = ["Last 7 days", "Last 1 Month", "Last Quarter", "Last Half"];

	const [filter, setFilter] = useState(filters[0]);
	const [paginationIndex, setPaginationIndex] = useState(1);
	const [activePopularCategory, setActivePopularCategory] = useState<
		"distributor" | "product"
	>("distributor");

	const handleNavigateToOrderDetail = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		id: string | Record<any, any>
	) => {
		e.preventDefault();
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
		const { value } = e.target;
		setFilter(value as string);
	};

	return (
		<AppLayout pageId="Dashboard">
			<DashboardWrapper>
				<Box>
					<Typography
						variant="h1"
						fontFamily={"Roboto"}
						fontWeight={600}
						fontSize={28}
						lineHeight={"normal"}
						color="var(--dashboard-welcome-message-dark-color)"
					>
						Hello,{" "}
						<Typography
							component={"span"}
							fontFamily={"inherit"}
							fontWeight={"inherit"}
							fontSize={"inherit"}
							lineHeight={"inherit"}
							color="var(--dashboard-welcome-message-ash-color)"
						>
							{`${authenticatedUser?.firstName} ${authenticatedUser?.lastName}`}
						</Typography>
					</Typography>
				</Box>
				<Grid container component={"div"} spacing={"var(--flex-gap)"}>
					{dashboardCards.map((card, index) => {
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
					<Grid size={{ mobile: 12, laptop: 8 }}>
						<Stack gap={"calc(var(--flex-gap)/8)"} height={{ laptop: "100%" }}>
							<Card
								sx={{
									border: "none",
									borderRadius: "12px",
								}}
							>
								<CardContent className="card-content">
									<Stack
										height={"100%"}
										gap={"var(--flex-gap)"}
										direction={{ desktop: "row" }}
										padding={"var(--basic-padding)"}
									>
										<Stack
											flex={"0 1 auto"}
											maxWidth={"160px"}
											overflow={"hidden"}
											justifyContent={"space-between"}
										>
											<Stack>
												<Box>
													<Typography
														variant="subtitle1"
														fontFamily={"Roboto"}
														fontWeight={600}
														fontSize={18}
														lineHeight={"normal"}
														color="var(--input-field-text-color)"
													>
														Total Sales
													</Typography>
												</Box>
												<Box>
													<BaseFieldSet>
														<BaseSelect
															border="none"
															value={filter}
															onChange={handleChange}
															padding="calc(var(--basic-padding)/2) 0"
														>
															{filters?.map((filter: string, index: number) => (
																<BaseOption key={index} value={filter}>
																	{filter}
																</BaseOption>
															))}
														</BaseSelect>
													</BaseFieldSet>
												</Box>
											</Stack>
											<Stack>
												<Box>
													<Typography
														variant="subtitle1"
														fontFamily={"Roboto"}
														fontWeight={700}
														fontSize={35}
														lineHeight={"normal"}
														color="var(--input-field-text-color)"
													>
														₦350K
													</Typography>
												</Box>
												<Stack
													direction={"row"}
													overflow={"hidden"}
													alignItems={"self-end"}
													gap={"calc(var(--flex-gap)/4)"}
												>
													<Stack
														direction={"row"}
														overflow={"hidden"}
														alignItems={"center"}
														gap={"calc(var(--flex-gap)/4)"}
													>
														<Box overflow={"hidden"} display={"flex"}>
															<DashboardCardUpwardTickIcon />
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
																8.6K
															</Typography>
														</Box>
													</Stack>
													<Box overflow={"hidden"}>
														<Typography
															variant="body1"
															fontFamily={"Roboto"}
															fontWeight={500}
															fontSize={16}
															lineHeight={"normal"}
															color="var(--grey-subtitle-color)"
														>
															vs {filter.toLowerCase()}
														</Typography>
													</Box>
												</Stack>
											</Stack>
										</Stack>
										<Box overflow={"hidden"} flex={1} height={"100%"}>
											<BaseLineGraph
												width="100%"
												height="350px"
												labels={[
													"MON",
													"TUE",
													"WED",
													"THU",
													"FRI",
													"SAT",
													"SUN",
												]}
												datasets={[
													{
														label: "Sales",
														data: [4, 7, 4, 6, 9, 8, 5, 2, 0, 4, 7, 1],
														backgroundColor: "#8d5245",
														borderColor: "#8d5245",
														fill: true,
													},
												]}
												showLegend={true}
												showBorder={false}
												showYAxisTick={false}
											/>
										</Box>
									</Stack>
								</CardContent>
							</Card>
							<Box overflow={"hidden"} display={"flex"}>
								<BaseButton
									radius="0"
									border="none"
									variant="text"
									disableElevation
									endIcon={<DownloadIcon />}
									colour={"var(--primary-color)"}
									padding="calc(var(--basic-padding)/2) 0"
									sx={{
										borderBottom: "2px solid transparent",
										"&:hover": {
											borderBottom: "2px solid transparent",
										},
										"& .MuiButton-endIcon": {
											marginRight: 0,
											display: "flex",
										},
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
										Download Report
									</Typography>
								</BaseButton>
							</Box>
						</Stack>
					</Grid>
					<Grid size={{ mobile: 12, laptop: 4 }}>
						<Stack gap={"calc(var(--flex-gap)/8)"} height={{ laptop: "100%" }}>
							<Card
								sx={{
									border: "none",
									borderRadius: "12px",
								}}
							>
								<CardContent className="card-content">
									<Stack
										height={"100%"}
										gap={"var(--flex-gap)"}
										justifyContent={"space-around"}
										padding={"var(--basic-padding)"}
									>
										<Box overflow={"hidden"}>
											<Typography
												variant="subtitle1"
												fontFamily={"Roboto"}
												fontWeight={600}
												fontSize={18}
												lineHeight={"normal"}
												color="var(--input-field-text-color)"
												marginBlockEnd={"calc(var(--basic-margin)/4)"}
											>
												Popular{" "}
												{activePopularCategory.charAt(0).toUpperCase() +
													activePopularCategory.slice(1)}
												s
											</Typography>
											<Typography
												variant="body1"
												fontFamily={"Roboto"}
												fontWeight={400}
												fontSize={16}
												lineHeight={"normal"}
												color="var(--grey-subtitle-color)"
											>
												Total {summary.total}{" "}
												{activePopularCategory.charAt(0).toUpperCase() +
													activePopularCategory.slice(1)}
												s
											</Typography>
										</Box>
										{summary[activePopularCategory]?.map((category, index) => {
											return (
												<Stack
													key={index}
													direction={"row"}
													alignItems={"center"}
													gap={"var(--flex-gap)"}
													justifyContent={"space-between"}
												>
													<Box overflow={"hidden"}>
														<Typography
															variant="h3"
															fontFamily={"Roboto"}
															fontWeight={500}
															fontSize={16}
															lineHeight={"normal"}
															color="var(--input-field-text-color)"
															marginBlockEnd={"calc(var(--basic-margin)/4)"}
														>
															{category.name}
														</Typography>
														{activePopularCategory === "distributor" && (
															<Typography
																variant="body1"
																fontFamily={"Roboto"}
																fontWeight={400}
																fontSize={12}
																lineHeight={"normal"}
																color="var(--grey-subtitle-color)"
															>
																{/* {category.address} */}
															</Typography>
														)}
													</Box>
													<Box overflow={"hidden"}>
														<Typography
															variant="subtitle1"
															fontFamily={"Roboto"}
															fontWeight={500}
															fontSize={16}
															lineHeight={"normal"}
															color="var(--input-field-text-color)"
														>
															{category.sales} sales
														</Typography>
													</Box>
												</Stack>
											);
										})}
										<Box overflow={"hidden"}>
											<BaseButton
												border="none"
												variant="text"
												disableElevation
												colour={"var(--primary-color)"}
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
													View{" "}
													{activePopularCategory.charAt(0).toUpperCase() +
														activePopularCategory.slice(1)}
													s
												</Typography>
											</BaseButton>
										</Box>
									</Stack>
								</CardContent>
							</Card>
							<Stack
								direction={"row"}
								overflow={"hidden"}
								alignItems={"center"}
							>
								<Box overflow={"hidden"} flex={1}>
									<BaseButton
										radius="0"
										border="none"
										variant="text"
										disableElevation
										colour={"var(--primary-color)"}
										padding="calc(var(--basic-padding)/2)"
										disabled={
											matchesLaptopAndAbove &&
											activePopularCategory === "product"
										}
										endIcon={
											<DownloadIcon
												style={{ visibility: "hidden", width: "0px" }}
											/>
										}
										sx={{
											width: "100%",
											borderBottom:
												activePopularCategory === "product"
													? "2px solid var(--primary-color)"
													: "none",
											"&:hover": {
												borderBottom:
													activePopularCategory === "product"
														? "2px solid var(--primary-color)"
														: "none",
											},
											"& .MuiButton-endIcon": {
												marginLeft: 0,
												marginRight: 0,
												display: "flex",
											},
										}}
										onClick={() => setActivePopularCategory("product")}
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
											Popular Products
										</Typography>
									</BaseButton>
								</Box>
								<Box overflow={"hidden"} flex={1}>
									<BaseButton
										radius="0"
										border="none"
										variant="text"
										disableElevation
										colour={"var(--primary-color)"}
										padding="calc(var(--basic-padding)/2)"
										disabled={
											matchesLaptopAndAbove &&
											activePopularCategory === "distributor"
										}
										endIcon={
											<DownloadIcon
												style={{ visibility: "hidden", width: "0px" }}
											/>
										}
										sx={{
											width: "100%",
											borderBottom:
												activePopularCategory === "distributor"
													? "2px solid var(--primary-color)"
													: "none",
											"&:hover": {
												borderBottom:
													activePopularCategory === "distributor"
														? "2px solid var(--primary-color)"
														: "none",
											},
											"& .MuiButton-endIcon": {
												marginLeft: 0,
												marginRight: 0,
												display: "flex",
											},
										}}
										onClick={() => setActivePopularCategory("distributor")}
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
											Popular Distributors
										</Typography>
									</BaseButton>
								</Box>
							</Stack>
						</Stack>
					</Grid>
					<Grid size={{ mobile: 12 }}>
						<Stack gap={"calc(var(--flex-gap)/2)"}>
							<Grid
								container
								component={"div"}
								spacing={{
									mobile: "calc(var(--flex-gap)/4)",
									laptop: "var(--flex-gap)",
								}}
							>
								<Grid size={{ mobile: 12, laptop: 8 }}>
									<Box overflow={"hidden"}>
										<Typography
											variant="h2"
											fontFamily={"Roboto"}
											fontWeight={600}
											fontSize={28}
											lineHeight={"normal"}
											color="var(--dark-color)"
										>
											Orders
										</Typography>
									</Box>
								</Grid>
								<Grid size={{ mobile: 12, laptop: 4 }}>
									<Stack
										direction={"row"}
										overflow={"hidden"}
										alignItems={"center"}
										gap={"calc(var(--flex-gap)/2)"}
									>
										<Box overflow={"hidden"}>
											<BaseInput
												startAdornment={
													<InputAdornment position="start">
														<SearchIcon />
													</InputAdornment>
												}
												placeholder="Search"
												bgcolor="var(--light-color)"
												borderradius={"8px"}
												padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
											/>
										</Box>
										<Box overflow={"hidden"} display={"flex"}>
											<BaseButton
												radius="0"
												padding="0"
												border="none"
												variant="text"
												disableElevation
												endIcon={<ForwardArrowIcon />}
												colour={"var(--primary-color)"}
												sx={{
													"& .MuiButton-endIcon": {
														marginRight: 0,
														display: "flex",
													},
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
													View Orders
												</Typography>
											</BaseButton>
										</Box>
									</Stack>
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
										<OrderTable
											rows={orders}
											handleViewDetailsClick={handleNavigateToOrderDetail}
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
			</DashboardWrapper>
		</AppLayout>
	);
};
