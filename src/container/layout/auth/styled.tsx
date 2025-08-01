import { Stack, styled } from "@mui/material";

export const AuthLayoutWrapper = styled(Stack)(() => {
    return {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        overflow: "hidden",
        minHeight: "100vh",
    }
})