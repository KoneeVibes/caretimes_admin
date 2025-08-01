import { Select, styled } from "@mui/material";
import { BaseInputPropsType } from "../../../type/component.type";

export const BaseSelect = styled(Select)<BaseInputPropsType>(({ colour, bgcolor, fontfamily, fontweight, fontsize, width, border, isError }) => {
    return {
        fontFamily: fontfamily || "Roboto",
        fontWeight: fontweight || 500,
        fontSize: fontsize || "14px",
        lineHeight: "normal",
        border: border || isError ? "1px solid var(--error-color)" : "1px solid var(--select-field-border-color)",
        borderRadius: "4px",
        color: colour || "var(--select-field-text-color)",
        backgroundColor: bgcolor || "transparent",
        padding: "calc(var(--basic-padding)/2)",
        outline: "none",
        width: width || "-webkit-fill-available",
        "& .MuiInputBase-input": {
            textOverflow: "ellipsis",
            padding: 0,
        },
        "& .MuiOutlinedInput-notchedOutline": {
            outline: "none",
            border: "none !important",
        },
        "& fieldset": {
            border: "1px solid var(--select-field-border-color)",
        }
    }
})