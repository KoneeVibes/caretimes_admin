import { FormLabelProps, InputBaseProps } from "@mui/material";
import { ChartDataset, ChartType } from "chart.js";

export type BaseTypographyType = {
	fontfamily?: string;
	fontsize?: string;
	fontweight?: number;
	colour?: string;
};

export type BaseButtonPropsType = BaseTypographyType & {
	radius?: string;
	padding?: string;
	bgcolor?: string;
	border?: string;
};

export type BaseLabelPropsType = BaseTypographyType & FormLabelProps;

export type BaseInputPropsType = BaseTypographyType & {
	border?: string;
	borderradius?: string;
	bgcolor?: string;
	radius?: string;
	padding?: string;
	width?: string;
	isError?: boolean;
} & InputBaseProps;

export type BaseTablePropsType = {
	headers: string[];
	children: React.ReactNode;
};

export type BaseChartPropsType<T extends ChartType> = {
	title?: string;
	labels: string[];
	datasets: ChartDataset<T>[];
	width: string;
	height: string;
};

export type BaseLineGraphPropsType = {
	showBorder: boolean;
	showLegend: boolean;
	showYAxisTick: boolean;
} & BaseChartPropsType<"line">;
