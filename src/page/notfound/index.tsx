import { Box, Stack, Typography } from "@mui/material";
import { NotFoundErrorWrapper } from "./styled";
import notfound from "../../asset/animation/404 Animation.svg";
import { AppLayout } from "../../container/layout/app";

export const NotFoundError = () => {
	return (
		<AppLayout pageId="Not-Found">
			<NotFoundErrorWrapper
				maxWidth={false}
				sx={{
					padding: "0 !important",
				}}
			>
				<Stack className="not-found-error-body">
					<Box component={"div"} className="animation-area">
						<img src={notfound} alt="404 Animation" />
					</Box>
					<Box>
						<Typography
							variant="h2"
							sx={{
								fontFamily: "Inter",
								fontWeight: 700,
								fontSize: {
									mobile: 25,
									miniTablet: 35,
									tablet: 40,
									laptop: 50,
									desktop: 60,
								},
								textAlign: "center",
								lineHeight: "normal",
								whiteSpace: "normal",
								color: "var(--dark-color)",
							}}
						>
							Ooops, Page Not Found.
						</Typography>
					</Box>
				</Stack>
			</NotFoundErrorWrapper>
		</AppLayout>
	);
};
