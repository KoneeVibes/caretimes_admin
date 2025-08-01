import { styled } from "@mui/material";
import { BaseTypographyType } from "../../../type/component.type";

export const BaseLegend = styled("legend")<BaseTypographyType>(({ fontfamily, fontweight, fontsize }) => {
    return {
        fontFamily: fontfamily || "Roboto",
        fontWeight: fontweight || 400,
        fontSize: fontsize || "24px",
        lineHeight: "normal",
        color: "var(--form-legend-color)",
        overflow: "hidden",
        textOverflow: "ellipsis",
    }
})