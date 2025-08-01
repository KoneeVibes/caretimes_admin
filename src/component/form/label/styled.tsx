import { FormLabel, styled } from "@mui/material";
import { BaseLabelPropsType } from "../../../type/component.type";

export const BaseLabel = styled(FormLabel)<BaseLabelPropsType>(({ colour, fontfamily, fontsize, fontweight }) => {
    return {
        fontFamily: fontfamily || "Roboto",
        fontWeight: fontweight || 500,
        fontSize: fontsize || "14px",
        lineHeight: "normal",
        color: colour || "var(--input-field-label-color)",
        marginBlock: "calc(var(--basic-margin)/4)",
        overflow: "hidden",
        textOverflow: "ellipsis",
    }
})