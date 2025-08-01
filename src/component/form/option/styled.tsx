import { MenuItem, styled } from "@mui/material";
import { BaseInputPropsType } from "../../../type/component.type";

export const BaseOption = styled(MenuItem)<BaseInputPropsType>(({ colour, fontfamily, fontweight, fontsize }) => {
    return {
        fontFamily: fontfamily || "Roboto",
        fontWeight: fontweight || 500,
        fontSize: fontsize || "14px",
        lineHeight: "normal",
        color: colour || "var(--select-field-text-color)",
        padding: "calc(var(--basic-padding)/2)",
    }
})