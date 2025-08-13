import { InputBase, styled } from "@mui/material";
import { BaseInputPropsType } from "../../../type/component.type";

export const BaseInput = styled(InputBase)<BaseInputPropsType>(({ colour, bgcolor, fontweight, fontsize, width, border, borderradius, padding, isError }) => {
    return {
        fontFamily: "Roboto",
        fontWeight: fontweight || 400,
        fontSize: fontsize || "16px",
        lineHeight: "normal",
        border: border || isError ? "1px solid var(--error-color)" : "1px solid var(--input-field-border-color)",
        borderRadius: borderradius || "10px",
        color: colour || "var(--input-field-text-color)",
        backgroundColor: bgcolor || "transparent",
        padding: padding || "calc(var(--basic-padding)/2)",
        outline: "none",
        width: width || "-webkit-fill-available",
        "& .MuiInputBase-input": {
            textOverflow: "ellipsis",
            padding: 0,
        }
    }
})