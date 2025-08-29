import {
	Chart as ChartJS,
	ChartOptions,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { BaseLineGraphPropsType } from "../../../type/component.type";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export const BaseLineGraph: React.FC<BaseLineGraphPropsType> = ({
	title,
	labels,
	datasets,
	width,
	height,
	showBorder,
	showLegend,
	showYAxisTick,
}) => {
	const data = { labels, datasets };

	const options: ChartOptions<"line"> = {
		responsive: true,
		maintainAspectRatio: false,
		elements: {
			point: {
				pointStyle: false,
			},
			line: {
				tension: 0.5,
				borderWidth: 5,
			},
		},
		plugins: {
			legend: {
				display: showLegend,
				align: "start" as const,
				position: "top" as const,
				labels: {
					usePointStyle: true,
					pointStyle: "circle",
					font: {
						family: "Public Sans",
						weight: 500,
						size: 12,
					},
				},
			},
			title: {
				display: true,
				text: title,
				align: "start" as const,
				color: "#000000",
				font: { family: "Roboto", weight: 600, size: 18 },
				padding: {
					bottom: 40,
				},
			},
		},
		scales: {
			x: {
				alignToPixels: true,
				offset: true,
				ticks: {
					font: { family: "Public Sans", weight: 500, size: 12 },
					padding: 10,
					callback: function (value) {
						// truncate label size and add ellipsis
						const lbl = this.getLabelForValue(value as number);
						if (typeof lbl === "string" && lbl.length > 5) {
							return `${lbl.substring(0, 5)}...`;
						}
						return lbl;
					},
				},
				grid: {
					drawTicks: false,
					display: false,
				},
				border: {
					color: showBorder ? "#000000" : "transparent",
					z: 2,
				},
			},
			y: {
				alignToPixels: true,
				beginAtZero: true,
				ticks: {
					display: showYAxisTick,
					font: { family: "Public Sans", weight: 500, size: 12 },
				},
				grid: {
					drawTicks: false,
					display: false,
				},
				border: {
					color: showBorder ? "#000000" : "transparent",
					z: 2,
				},
			},
		},
	};

	return (
		<Line
			data={data}
			options={options}
			width={width}
			height={height}
			style={{ maxHeight: height }}
		/>
	);
};
