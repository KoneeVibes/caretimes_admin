import { TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { BaseTable } from "../../../component/table";
import { OrderTablePropsType } from "../../../type/container.type";
import { BaseButton } from "../../../component/button/styled";

export const OrderTable: React.FC<OrderTablePropsType> = ({
	rows,
	handleViewDetailsClick,
}) => {
	const orderTableHeaders = [
		"Order Number",
		"Date",
		"Customer",
		"Time",
		"Amount",
		"Location",
		"Action",
	];
	return (
		<BaseTable headers={orderTableHeaders}>
			<TableBody>
				{rows?.map((row, index) => {
					return (
						<TableRow key={index}>
							<TableCell>{row?.serialNo}</TableCell>
							<TableCell>{row?.date}</TableCell>
							<TableCell>{row?.customer}</TableCell>
							<TableCell>{row?.time}</TableCell>
							<TableCell>{row?.amount}</TableCell>
							<TableCell>{row?.location}</TableCell>
							<TableCell>
								<BaseButton
									radius="0"
									border="none"
									variant="text"
									disableElevation
									colour={"var(--primary-color)"}
									padding="0"
									sx={{
										borderBottom: "1px solid var(--primary-color)",
										"&:hover": {
											borderBottom: "1px solid var(--primary-color)",
										},
									}}
									onClick={(e) => handleViewDetailsClick?.(e, row?.id)}
								>
									<Typography
										variant={"button"}
										fontFamily={"inherit"}
										fontWeight={"inherit"}
										fontSize={"inherit"}
										lineHeight={"inherit"}
										color={"inherit"}
										textTransform={"inherit"}
									>
										View Details
									</Typography>
								</BaseButton>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</BaseTable>
	);
};
