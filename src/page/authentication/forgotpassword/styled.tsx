import { styled } from "@mui/material";

export const ForgotPasswordWrapper = styled("form")(() => {
    return {
        border: "1px solid var(--input-field-border-color)",
        padding: "calc(var(--basic-padding))",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--flex-gap) * 1.5)",
        overflow: "hidden",
        maxWidth: "20.8625rem",
        width: "-webkit-fill-available",
        "& .call-to-action": {
            overflow: "hidden",
        },
    }
})