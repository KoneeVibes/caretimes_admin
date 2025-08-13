import { Box, styled } from "@mui/material";

export const MainAreaWrapper = styled(Box)(({ theme }) => {
    return {
        overflow: "hidden",
        minHeight: "100vh",
        backgroundColor: "inherit",
        padding: "var(--basic-padding)",
        [theme.breakpoints.up("tablet")]: {
            right: 0,
            position: "absolute",
            left: "var(--side-nav-width)",
            top: "calc(var(--top-nav-height) + var(--basic-padding))",
        },
    }
})