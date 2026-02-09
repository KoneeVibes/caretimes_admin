import {
	Box,
	Card,
	CardContent,
	Checkbox,
	Chip,
	CircularProgress,
	Grid,
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { AppLayout } from "../../../container/layout/app";
import { AdminDetailsWrapper } from "./styled";
import { useNavigate, useParams } from "react-router-dom";
import { BaseButton } from "../../../component/button/styled";
import {
	EditIcon,
	ErrorIcon,
	ForwardArrowIcon,
	SuccessModalIcon,
} from "../../../asset";
import { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { retrieveUserByIdService } from "../../../util/usermanagement/user/retrieveUserById";
import { formatDate } from "../../../helper/dateFormatter";
import baseHeadshot from "../../../asset/image/base-headshot.svg";
import { AppContext } from "../../../context";
import { EditUserForm } from "../../../container/form/edituser";
import { BaseAlertModal } from "../../../component/modal/alert";
import { deleteUserService } from "../../../util/usermanagement/user/deleteAdmin";
import { activateUserService } from "../../../util/usermanagement/user/activateAdmin";
import { ManagePermissionsForm } from "../../../container/form/managepermissions";
import { managePermissionsService } from "../../../util/usermanagement/accesscontrol/managePermissions";
import { retrievePermissionsService } from "../../../util/usermanagement/accesscontrol/retrievePermissions";

export const AdminDetails = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const navigate = useNavigate();
	const { id = "" } = useParams();
	const matches = useMediaQuery("(max-width:250px)");
	const {
		isEditUserFormModalOpen,
		setIsEditUserFormModalOpen,
		isAlertModalOpen,
		setIsAlertModalOpen,
		authenticatedUser,
	} = useContext(AppContext);

	const [tabIndex, setTabIndex] = useState(0);
	const [isLoading, setIsLoading] = useState({
		forDelete: false,
		forActivate: false,
		forPermissionUpdate: false,
	});
	const [error, setError] = useState<string | null>(null);
	const [selectedAdmin, setSelectedAdmin] = useState<Record<
		string,
		any
	> | null>(null);
	const [permissions, setPermissions] = useState([
		{ module: "Dashboard", status: "inactive" },
		{ module: "Orders", status: "inactive" },
		{ module: "Inventory", status: "inactive" },
		{ module: "Transactions", status: "inactive" },
		// { module: "Support", status: "inactive" },
		{ module: "Admin Management", status: "inactive" },
		// { module: "Settings", status: "inactive" },
	]);

	useEffect(() => {
		if (!id.trim()) return;
		retrieveUserByIdService(TOKEN, id)
			.then((data) => {
				setSelectedAdmin(data);
			})
			.catch((err) => {
				console.error("Failed to fetch selected user:", err);
			});
	}, [
		TOKEN,
		id,
		isEditUserFormModalOpen,
		isLoading.forDelete,
		isLoading.forActivate,
	]);

	useEffect(() => {
		if (!id.trim()) return;
		retrievePermissionsService(TOKEN, id)
			.then((data) => {
				setPermissions(
					data || [
						{ module: "Dashboard", status: "inactive" },
						{ module: "Orders", status: "inactive" },
						{ module: "Inventory", status: "inactive" },
						{ module: "Transactions", status: "inactive" },
						// { module: "Support", status: "inactive" },
						{ module: "Admin Management", status: "inactive" },
						// { module: "Settings", status: "inactive" },
					],
				);
			})
			.catch((err) => {
				console.error("Failed to fetch user permissions:", err);
			});
	}, [TOKEN, id, tabIndex]);

	const handleNavigateBackwards = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault();
		return navigate(-1);
	};

	const handleOpenEditUserModal = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault();
		if (!selectedAdmin) return; //loader goes here
		return setIsEditUserFormModalOpen(true);
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

	const handleToggleTabs = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault();
		setTabIndex((prev) => (prev === 0 ? 1 : 0));
	};

	const handleActivateAdmin = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault();
		if (isLoading.forDelete || !id.trim()) return;
		setError(null);
		setIsLoading((prev) => ({ ...prev, forActivate: true }));
		try {
			const response = await activateUserService(TOKEN, id);
			if (response.status === "success") {
				setIsLoading((prev) => ({ ...prev, forActivate: false }));
			} else {
				setIsLoading((prev) => ({ ...prev, forActivate: false }));
				setError(
					"Action: Activate admin failed. Please contact administrator.",
				);
				setIsAlertModalOpen(true);
			}
		} catch (error: any) {
			setIsLoading((prev) => ({ ...prev, forActivate: false }));
			setError(`Activate admin failed. ${error.message}`);
			setIsAlertModalOpen(true);
			console.error("Activate admin failed:", error);
		}
	};

	const handleToggleOnAllPermissions = (
		e: React.ChangeEvent<HTMLInputElement>,
		checked: boolean,
	) => {
		e.stopPropagation();
		const updatedPermissions = permissions.map((perm) => ({
			...perm,
			status: checked ? "active" : "inactive",
		}));
		setPermissions(updatedPermissions);
	};

	const handleDeleteAdmin = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault();
		if (isLoading.forActivate || !id.trim()) return;
		setError(null);
		setIsLoading((prev) => ({ ...prev, forDelete: true }));
		try {
			const response = await deleteUserService(TOKEN, id);
			if (response.status === "success") {
				setIsLoading((prev) => ({ ...prev, forDelete: false }));
			} else {
				setIsLoading((prev) => ({ ...prev, forDelete: false }));
				setError("Action: Delete admin failed. Please contact administrator.");
				setIsAlertModalOpen(true);
			}
		} catch (error: any) {
			setIsLoading((prev) => ({ ...prev, forDelete: false }));
			setError(`Delete admin failed. ${error.message}`);
			console.error("Delete admin failed:", error);
			setIsAlertModalOpen(true);
		}
	};

	const handleUpdatePermissions = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault();
		if (isLoading.forPermissionUpdate || !id.trim()) return;
		setError(null);
		setIsLoading((prev) => ({ ...prev, forPermissionUpdate: true }));
		try {
			const response = await managePermissionsService(TOKEN, id, {
				permissions,
			});
			if (response.status === "success") {
				setIsLoading((prev) => ({ ...prev, forPermissionUpdate: false }));
				setIsAlertModalOpen(true);
			} else {
				setIsLoading((prev) => ({ ...prev, forPermissionUpdate: false }));
				setError("Action: Update permissions failed. Please try again.");
			}
		} catch (error: any) {
			setIsLoading((prev) => ({ ...prev, forPermissionUpdate: false }));
			setError(`Update permissions failed. ${error.message}`);
			console.error("Update permissions failed:", error);
		}
	};

	return (
		<AppLayout pageId="Admin-Management">
			<AdminDetailsWrapper>
				{selectedAdmin && <EditUserForm initialFormDetails={selectedAdmin} />}
				<BaseAlertModal
					callToAction="Close"
					open={isAlertModalOpen}
					icon={error ? <ErrorIcon /> : <SuccessModalIcon />}
					title={error ? "Error" : "User updated successfully"}
					className="edit-admin-successful-modal"
					handleClose={handleAlertModalClickOutside}
					callToActionBgColor={
						error ? "var(--error-color)" : "var(--success-color)"
					}
					handleCallToAction={handleAlertModalCallToActionClick}
					message={error ? null : "The user has been successfully updated."}
				/>
				<Stack gap={"calc(var(--flex-gap)/2)"}>
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
							padding="0"
							variant="text"
							border={"none"}
							disableElevation
							startIcon={<ForwardArrowIcon className="back-arrow-icon" />}
							sx={{
								width: matches ? "100%" : "auto",
								"& .MuiButton-startIcon": {
									marginLeft: 0,
								},
							}}
							onClick={handleNavigateBackwards}
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
								Back
							</Typography>
						</BaseButton>
					</Box>
				</Stack>
				<Card
					sx={{
						border: "none",
						borderRadius: "12px",
					}}
				>
					<CardContent className="card-content">
						<Stack
							gap={"calc(var(--flex-gap)/2)"}
							padding={"var(--basic-padding)"}
						>
							{tabIndex === 0 && (
								<Grid container component={"div"} spacing={"var(--flex-gap)"}>
									<Grid size={{ mobile: 12, laptop: 6 }}>
										<Stack
											gap={"calc(var(--flex-gap)/2)"}
											direction={{ miniTablet: "row" }}
										>
											<Box component={"div"} className="headshot-box">
												<img
													src={
														(selectedAdmin?.avatar as string) || baseHeadshot
													}
													alt="Headshot"
													className="admin-headshot"
												/>
											</Box>
											<Stack
												gap={"calc(var(--flex-gap)/2)"}
												overflow={"hidden"}
											>
												<Box>
													<Typography
														variant="h2"
														fontFamily={"Roboto"}
														fontWeight={700}
														fontSize={24}
														lineHeight={"normal"}
														color="var(--dark-color)"
													>
														{`${selectedAdmin?.firstName} ${selectedAdmin?.lastName}`}
													</Typography>
												</Box>
												<Box>
													<Typography
														variant="body1"
														fontFamily={"Roboto"}
														fontWeight={400}
														fontSize={16}
														lineHeight={"normal"}
														color="var(--subtitle-text-color)"
													>
														{selectedAdmin?.role || "Untitled"}
													</Typography>
												</Box>
												<Stack
													direction={"row"}
													alignItems={"center"}
													gap={"calc(var(--flex-gap)/2)"}
												>
													<Box>
														<Chip
															label={
																selectedAdmin?.status
																	? selectedAdmin.status
																			.charAt(0)
																			.toUpperCase() +
																		selectedAdmin.status.slice(1)
																	: "Untitled"
															}
															sx={{
																fontFamily: "Roboto",
																fontWeight: 600,
																fontSize: 14,
																lineHeight: "normal",
																borderRadius: "8px",
																color: "var(--grey-subtitle-color)",
																backgroundColor: "var(--app-bg-color)",
															}}
														/>
													</Box>
													<Box overflow={"hidden"}>
														<Typography
															variant="subtitle1"
															fontFamily={"Roboto"}
															fontWeight={400}
															fontSize={14}
															lineHeight={"normal"}
															color="var(--chip-text-color)"
														>
															Date added:{" "}
															<Typography
																component={"span"}
																fontFamily={"inherit"}
																fontWeight={"inherit"}
																fontSize={"inherit"}
																lineHeight={"inherit"}
																color={"var(--badge-text-color)"}
															>
																{formatDate(selectedAdmin?.createdAt, true)}
															</Typography>
														</Typography>
													</Box>
												</Stack>
											</Stack>
										</Stack>
									</Grid>
									<Grid size={{ mobile: 12, laptop: 6 }}>
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
													onClick={handleOpenEditUserModal}
												>
													<EditIcon />
												</IconButton>
											</Box>
											<Box overflow={"hidden"}>
												<BaseButton
													variant="contained"
													disableElevation
													disabled={
														selectedAdmin?.status === "active" ||
														isLoading.forActivate
													}
													colour="var(--success-color)"
													bgcolor="var(--success-color-variant)"
													sx={{
														width: "100%",
													}}
													onClick={handleActivateAdmin}
												>
													{isLoading.forActivate ? (
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
															Activate User
														</Typography>
													)}
												</BaseButton>
											</Box>
											<Box overflow={"hidden"}>
												<BaseButton
													variant="contained"
													disableElevation
													disabled={
														selectedAdmin?.status === "inactive" ||
														isLoading.forDelete
													}
													bgcolor="var(--error-color-variant)"
													sx={{
														width: "100%",
													}}
													onClick={handleDeleteAdmin}
												>
													{isLoading.forDelete ? (
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
															Suspend User
														</Typography>
													)}
												</BaseButton>
											</Box>
										</Stack>
									</Grid>
									<Grid size={{ mobile: 12, laptop: 6 }} overflow={"hidden"}>
										<Stack
											borderRadius={"24px"}
											gap={"calc(var(--flex-gap)/2)"}
											bgcolor={"var(--app-bg-color)"}
											padding={"var(--basic-padding)"}
										>
											<Box>
												<Typography
													variant="h3"
													fontFamily={"Roboto"}
													fontWeight={700}
													fontSize={20}
													lineHeight={"normal"}
													color="var(--badge-text-color)"
												>
													Overview
												</Typography>
											</Box>
											<Stack>
												<Box>
													<Typography
														variant="subtitle1"
														fontFamily={"Roboto"}
														fontWeight={400}
														fontSize={16}
														lineHeight={"normal"}
														color="var(--chip-text-color)"
													>
														Email Address
													</Typography>
												</Box>
												<Box>
													<Typography
														variant="body1"
														fontFamily={"Roboto"}
														fontWeight={400}
														fontSize={16}
														lineHeight={"normal"}
														color="var(--dark-color)"
													>
														{selectedAdmin?.email}
													</Typography>
												</Box>
											</Stack>
											<Stack>
												<Box>
													<Typography
														variant="subtitle1"
														fontFamily={"Roboto"}
														fontWeight={400}
														fontSize={16}
														lineHeight={"normal"}
														color="var(--chip-text-color)"
													>
														Phone
													</Typography>
												</Box>
												<Box>
													<Typography
														variant="body1"
														fontFamily={"Roboto"}
														fontWeight={400}
														fontSize={16}
														lineHeight={"normal"}
														color="var(--dark-color)"
													>
														{selectedAdmin?.phone}
													</Typography>
												</Box>
											</Stack>
											{["super-admin"].includes(authenticatedUser?.type) && (
												<Box overflow={"hidden"}>
													<BaseButton
														variant="contained"
														disableElevation
														sx={{
															width: "100%",
														}}
														onClick={handleToggleTabs}
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
															Admin Permissions
														</Typography>
													</BaseButton>
												</Box>
											)}
										</Stack>
									</Grid>
								</Grid>
							)}
							{tabIndex === 1 && (
								<Grid container component={"div"} spacing={"var(--flex-gap)"}>
									<Grid size={{ mobile: 12 }}>
										<Stack
											gap={"calc(var(--flex-gap)/2)"}
											direction={{ miniTablet: "row" }}
											alignItems={{ miniTablet: "center" }}
											justifyContent={{ miniTablet: "space-between" }}
										>
											<Box>
												<Typography
													variant="h2"
													fontFamily={"Roboto"}
													fontWeight={700}
													fontSize={24}
													lineHeight={"normal"}
													color="var(--dark-color)"
												>
													Admin Permissions
												</Typography>
											</Box>
											<Box overflow={"hidden"}>
												<BaseButton
													variant="contained"
													disableElevation
													onClick={handleUpdatePermissions}
													disabled={isLoading.forPermissionUpdate}
												>
													{isLoading.forPermissionUpdate ? (
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
									</Grid>
									<Grid size={{ mobile: 12, laptop: 6 }} overflow={"hidden"}>
										<Stack
											borderRadius={"24px"}
											gap={"calc(var(--flex-gap)/2)"}
											bgcolor={"var(--app-bg-color)"}
											padding={"var(--basic-padding)"}
										>
											<Stack
												overflow={"hidden"}
												gap={{
													mobile: "calc(var(--flex-gap)/4)",
													miniTablet: "calc(var(--flex-gap))",
												}}
												direction={{ miniTablet: "row" }}
												alignItems={{ miniTablet: "center" }}
												justifyContent={{ miniTablet: "space-between" }}
											>
												<Box>
													<Typography
														variant="h3"
														fontFamily={"Roboto"}
														fontWeight={700}
														fontSize={20}
														lineHeight={"normal"}
														color="var(--badge-text-color)"
													>
														Permissions
													</Typography>
												</Box>
												<Stack
													direction={"row"}
													overflow={"hidden"}
													alignItems={"center"}
													gap={"calc(var(--flex-gap)/8)"}
												>
													<Box overflow={"hidden"}>
														<Typography
															variant="subtitle1"
															fontFamily={"Roboto"}
															fontWeight={400}
															fontSize={14}
															lineHeight={"normal"}
															color="var(--dark-color)"
														>
															Allow all permission
														</Typography>
													</Box>
													<Box>
														<Checkbox
															checked={permissions.every(
																(permission) => permission.status === "active",
															)}
															sx={{
																padding: 0,
																"& .MuiSvgIcon-root": { fill: "inherit" },
															}}
															onChange={(e, checked) =>
																handleToggleOnAllPermissions(e, checked)
															}
														/>
													</Box>
												</Stack>
											</Stack>
											<Box
												sx={{
													borderRadius: "12px",
													backgroundColor: "var(--light-color)",
													padding: "calc(var(--basic-padding)/2)",
												}}
											>
												<Typography
													variant="h4"
													fontFamily={"Roboto"}
													fontWeight={400}
													fontSize={16}
													lineHeight={"normal"}
													color="var(--chip-text-color)"
												>
													FEATURES
												</Typography>
											</Box>
											<Box>
												<ManagePermissionsForm
													permissions={permissions}
													setPermissions={setPermissions}
												/>
											</Box>
										</Stack>
									</Grid>
									<Grid size={{ mobile: 12, laptop: 6 }} overflow={"hidden"}>
										<Stack
											borderRadius={"24px"}
											gap={"calc(var(--flex-gap)/2)"}
											bgcolor={"var(--app-bg-color)"}
											padding={"var(--basic-padding)"}
										>
											<Box>
												<Typography
													variant="h3"
													fontFamily={"Roboto"}
													fontWeight={700}
													fontSize={20}
													lineHeight={"normal"}
													color="var(--badge-text-color)"
												>
													Description
												</Typography>
											</Box>
											<Box>
												<Typography
													variant="body1"
													fontFamily={"Roboto"}
													fontWeight={400}
													fontSize={16}
													lineHeight={"normal"}
													color="var(--dark-color)"
												>
													Lorem ipsum dolor sit amet, consectetur adipiscing
													elit. Blandit donec cras id neque fusce rutrum morbi
													sed pellentesque. Mauris consequat rhoncus eget sed
													fermentum et. Turpis elementum condimentum massa
													donec.
												</Typography>
											</Box>
										</Stack>
									</Grid>
								</Grid>
							)}
						</Stack>
					</CardContent>
				</Card>
			</AdminDetailsWrapper>
		</AppLayout>
	);
};
