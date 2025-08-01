import { FormLabelProps, InputBaseProps } from "@mui/material";

export type BaseTypographyType = {
    fontfamily?: string,
    fontsize?: string,
    fontweight?: number,
    colour?: string,
};

export type BaseButtonPropsType = BaseTypographyType & {
    radius?: string,
    padding?: string,
    bgcolor?: string,
    border?: string,
};

export type BaseLabelPropsType = BaseTypographyType & FormLabelProps;

export type BaseInputPropsType = BaseTypographyType & {
    border?: string,
    borderradius?: string,
    bgcolor?: string,
    radius?: string,
    padding?: string,
    width?: string,
    isError?: boolean
} & InputBaseProps;
