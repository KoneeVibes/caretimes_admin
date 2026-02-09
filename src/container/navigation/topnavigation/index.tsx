import { useContext } from "react";
import { TopNavigationWrapper } from "./styled";
import { AppContext } from "../../../context";
import {
	Box,
	IconButton,
	// InputAdornment,
	Stack,
	Toolbar,
	Typography,
	// useMediaQuery,
} from "@mui/material";
// import { BaseInput } from "../../../component/form/input/styled";
import {
	NotificationIcon,
	// SearchIcon
} from "../../../asset";
import MenuIcon from "@mui/icons-material/Menu";
import { SideNavigationPropsType } from "../../../type/container.type";

export const TopNavigation: React.FC<SideNavigationPropsType> = ({
	username,
	avatar,
	role,
}) => {
	const {
		isSideNavigationClosing,
		isMobileSideNavigationOpen,
		setIsMobileSideNavigationOpen,
	} = useContext(AppContext);
	// const matchesTabletAndAbove = useMediaQuery("(min-width:768px)");

	const handleDrawerToggle = () => {
		if (!isSideNavigationClosing) {
			setIsMobileSideNavigationOpen(!isMobileSideNavigationOpen);
		}
	};

	const handleOpenNotification = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault();
	};

	return (
		<TopNavigationWrapper>
			<Toolbar>
				<Box component={"div"} className="top-navigation-LHS">
					{/* <BaseInput
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        }
                        placeholder="Search"
                        bgcolor="var(--input-field-bg-color)"
                        borderradius={matchesTabletAndAbove ? "19px" : "6px"}
                        padding="calc(var(--basic-padding)/8) calc(var(--basic-padding)/2)"
                    /> */}
				</Box>
				<Stack className="top-navigation-MS">
					<Box component={"div"} className="notification-button-box">
						<IconButton
							sx={{
								color: "#FAF6F6",
								border: "1px solid #FAF6F6",
								borderRadius: "50%",
							}}
							onClick={handleOpenNotification}
						>
							<NotificationIcon />
						</IconButton>
					</Box>
					<Stack className="logged-in-user-information-stack">
						<Box>
							<img src={avatar} alt="user-avatar" className="user-avatar" />
						</Box>
						<Stack>
							<Box>
								<Typography
									variant="subtitle1"
									fontFamily={"Gilroy"}
									fontWeight={600}
									fontSize={14}
									lineHeight={"normal"}
									color={"var(--input-field-text-color)"}
									maxWidth={"64px"}
									marginBlockEnd={"calc(var(--basic-margin)/4)"}
								>
									{username}
								</Typography>
							</Box>
							<Box>
								<Typography
									variant="subtitle2"
									fontFamily={"Gilroy"}
									fontWeight={400}
									fontSize={12}
									lineHeight={"normal"}
									maxWidth={"64px"}
									color={"var(--input-field-text-color)"}
								>
									{role}
								</Typography>
							</Box>
						</Stack>
					</Stack>
				</Stack>
				<Box component={"div"} className="top-navigation-RHS">
					<IconButton
						size="large"
						color="inherit"
						aria-label="menu"
						sx={{
							borderRadius: "6px",
							color: "var(--light-color)",
							padding: "calc(var(--basic-padding)/8)",
							backgroundColor: "var(--primary-color)",
						}}
						onClick={handleDrawerToggle}
					>
						<MenuIcon />
					</IconButton>
				</Box>
			</Toolbar>
		</TopNavigationWrapper>
	);
};
