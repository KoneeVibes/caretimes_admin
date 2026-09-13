import { TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { BaseTable } from "../../../component/table";
import { TransactionTablePropsType } from "../../../type/container.type";
import { BaseButton } from "../../../component/button/styled";
import { formatDate } from "../../../helper/dateFormatter";

export const TransactionTable: React.FC<TransactionTablePropsType> = ({
	rows,
	handleViewDetailsClick,
}) => {
	const transactionTableHeaders = [
		"Reference ID",
		"Transaction Date",
		"Payment Method",
		"Customer Email",
		"Amount",
		"Status",
		"Action",
	];
	return (
		<BaseTable headers={transactionTableHeaders}>
			<TableBody>
				{rows?.map((row, index) => {
					return (
						<TableRow key={index}>
							<TableCell>{row?.reference}</TableCell>
							<TableCell>
								{formatDate(row?.paid_at ?? row?.created_at, true)}
							</TableCell>
							<TableCell>{row?.channel}</TableCell>
							<TableCell>{row?.customer?.email}</TableCell>
							<TableCell>{`₦${row?.amount?.toLocaleString()}`}</TableCell>
							<TableCell
								sx={{
									color: (
										{
											success: "var(--success-color) !important",
											failed: "var(--bright-yellow-color) !important",
											abandoned: "var(--error-color) !important",
										} as Record<string, string>
									)[String(row?.status).toLowerCase()],
								}}
							>
								{row?.status}
							</TableCell>
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
									onClick={(e) => handleViewDetailsClick?.(e, String(row?.id))}
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
										Download Receipt
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
