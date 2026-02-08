import {
	Box,
	Card,
	CardContent,
	Grid,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { AppLayout } from "../../container/layout/app";
import { AdminManagementWrapper } from "./styled";
import { BaseButton } from "../../component/button/styled";
import { AdminTable } from "../../container/table/admintable";
import { useContext, useEffect, useState } from "react";
import { AddUserForm } from "../../container/form/adduser";
import { AppContext } from "../../context";
import { BaseAlertModal } from "../../component/modal/alert";
import { SuccessModalIcon } from "../../asset";
import { useQuery } from "@tanstack/react-query";
import Cookies from "universal-cookie";
import { retrieveAllUserByTypeService } from "../../util/usermanagement/user/retrieveAllUserByType";
import { useNavigate } from "react-router-dom";

export const AdminManagement = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const navigate = useNavigate();
	const matches = useMediaQuery("(max-width:250px)");
	const { setIsAddUserFormModalOpen, isAlertModalOpen, setIsAlertModalOpen } =
		useContext(AppContext);

	const [isFetching, setIsFetching] = useState(false);
	const [paginationIndex, setPaginationIndex] = useState({
		page: "1",
		perPage: "5",
		totalPages: "1",
	});

	const { data: admins, refetch: refetchAdmins } = useQuery({
		queryKey: [`admin-and-distributor-accounts`, TOKEN, paginationIndex],
		queryFn: async () => {
			setIsFetching(true);
			const response = await retrieveAllUserByTypeService(
				TOKEN,
				{
					admin: true,
					distributor: true,
				},
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

	useEffect(() => {
		if (!isAlertModalOpen) {
			refetchAdmins();
		}
	}, [isAlertModalOpen, refetchAdmins]);

	const handleNavigateToDetails = (
		e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
		id: string | Record<any, any>,
	) => {
		e.preventDefault();
		return navigate(`/admin-management/${id}`);
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

	const handleOpenAddUserFormModal = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault();
		return setIsAddUserFormModalOpen(true);
	};

	const handleAlertModalClickOutside = () => {
		return setIsAlertModalOpen(true);
	};

	const handleAlertModalCallToActionClick = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault();
		return setIsAlertModalOpen(false);
	};

	return (
		<AppLayout pageId="Admin-Management">
			<AdminManagementWrapper>
				<AddUserForm />
				<BaseAlertModal
					callToAction="Close"
					open={isAlertModalOpen}
					icon={<SuccessModalIcon />}
					title="User added successfully"
					className="add-admin-successful-modal"
					handleClose={handleAlertModalClickOutside}
					callToActionBgColor="var(--success-color)"
					handleCallToAction={handleAlertModalCallToActionClick}
					message="The user has been successfully onboarded. User can now log in with their credentials."
				/>
				<Stack
					direction={{ tablet: "row" }}
					gap={"calc(var(--flex-gap)/2)"}
					justifyContent={"space-between"}
					alignItems={{ tablet: "center" }}
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
							Administrators
						</Typography>
					</Box>
					<Box overflow={"hidden"}>
						<BaseButton
							variant="contained"
							disableElevation
							sx={{
								width: matches ? "100%" : "auto",
							}}
							onClick={handleOpenAddUserFormModal}
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
								Create Admin
							</Typography>
						</BaseButton>
					</Box>
				</Stack>
				<Stack gap={"calc(var(--flex-gap)/2)"}>
					<Card
						sx={{
							border: "none",
							borderRadius: "12px",
						}}
					>
						<CardContent className="card-content">
							<Box component={"div"} className="admin-table-box">
								<AdminTable
									rows={admins}
									handleViewDetailsClick={handleNavigateToDetails}
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
										disabled={
											parseInt(paginationIndex.page, 10) === 1 || isFetching
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
			</AdminManagementWrapper>
		</AppLayout>
	);
};
