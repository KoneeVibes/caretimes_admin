import { TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { BaseTable } from "../../../component/table";
import { InventoryTablePropsType } from "../../../type/container.type";
import { BaseButton } from "../../../component/button/styled";

export const InventoryTable: React.FC<InventoryTablePropsType> = ({
	rows,
	handleViewDetailsClick,
}) => {
	const inventoryTableHeaders = [
		"Product Name",
		"Category",
		"In Stock",
		"Sold",
		"Price",
		"Status",
		"Action",
	];
	return (
		<BaseTable headers={inventoryTableHeaders}>
			<TableBody>
				{rows?.map((row, index) => {
					return (
						<TableRow key={index}>
							<TableCell>{row?.name}</TableCell>
							<TableCell>{row?.category}</TableCell>
							<TableCell>{row?.stock}</TableCell>
							<TableCell>{row?.sold}</TableCell>
							<TableCell>{row?.price}</TableCell>
							<TableCell>{row?.status}</TableCell>
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
