import { AppBar, styled } from "@mui/material";

export const TopNavigationWrapper = styled(AppBar)(({ theme }) => {
    return {
        position: "static",
        backgroundColor: "var(--light-color)",
        boxShadow: "none",
        overflow: "hidden",
        "& .MuiToolbar-root": {
            minHeight: "var(--top-nav-height)",
            backgroundColor: "inherit",
            borderRadius: "inherit",
            padding: "calc(var(--basic-padding)/2) var(--basic-padding)",
            gap: "var(--flex-gap)",
            justifyContent: "space-between",
        },
        "& .top-navigation-LHS": {
            flex: 1,
            maxWidth: "25rem",
            overflow: "hidden",
        },
        "& .top-navigation-MS": {
            display: "none",
            overflow: "hidden",
            flexDirection: "row",
            alignItems: "center",
            gap: "calc(var(--flex-gap)/2)",
            "& .logged-in-user-information-stack": {
                flexDirection: "row",
                gap: "calc(var(--flex-gap)/2)",
                "& .user-avatar": {
                    width: "100%",
                    height: "auto",
                    maxWidth: "50px",
                },
            },
        },
        "& .top-navigation-RHS": {
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
        },
        [theme.breakpoints.up("tablet")]: {
            width: "auto",
            position: "fixed",
            top: 0,
            right: 0,
            left: "var(--side-nav-width)",
            "& .top-navigation-MS": {
                display: "flex",
            },
            "& .top-navigation-RHS": {
                display: "none"
            },
        },
    }
})