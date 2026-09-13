import { TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { BaseTable } from "../../../component/table";
import { OrderTablePropsType } from "../../../type/container.type";
import { BaseButton } from "../../../component/button/styled";
import React, { useState } from "react";

export const OrderTable: React.FC<OrderTablePropsType> = ({
	rows,
	handleViewDetailsClick,
}) => {
	const orderTableHeaders = [
		"Txn Reference",
		"Order Status",
		"User",
		"Cost",
		"Drop-Off",
		"Action",
	];

	const orderCartItemsTableHeaders = [
		"",
		"Name",
		"Price",
		"Quantity",
		"Total",
		"",
	];

	const breakdown = ["subTotal", "tax", "deliveryFee", "totalPayable"];

	const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
	return (
		<BaseTable headers={orderTableHeaders}>
			<TableBody>
				{rows?.map((row, index) => {
					const isExpanded = expandedOrderId === row.id;
					const detailsClassName = isExpanded ? undefined : "hide-details";
					return (
						<React.Fragment key={index}>
							<TableRow
								sx={{
									cursor: "pointer",
									backgroundColor: isExpanded
										? "var(--badge-bg-color)"
										: "inherit",
								}}
								onClick={() =>
									setExpandedOrderId((currentId) =>
										currentId === row?.id ? null : row?.id,
									)
								}
							>
								<TableCell>{row?.transactionReference}</TableCell>
								<TableCell
									sx={{
										color: (
											{
												fulfilled: "var(--success-color) !important",
												paid: "var(--bright-yellow-color) !important",
												unfulfilled: "var(--bright-violet-color) !important",
												cancelled: "var(--bright-blue-color) !important",
												disputed: "var(--error-color) !important",
											} as Record<string, string>
										)[String(row?.status).toLowerCase()],
									}}
								>
									{row?.status}
								</TableCell>
								<TableCell>{row?.customerName}</TableCell>
								<TableCell>{`₦${row?.totalPayable?.toLocaleString()}`}</TableCell>
								<TableCell>{row?.deliveryAddress}</TableCell>
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
							<TableRow key={index} className={detailsClassName}>
								{orderCartItemsTableHeaders.map((header, index) => {
									return <TableCell key={index}>{header}</TableCell>;
								})}
							</TableRow>
							{row?.cartItems?.map((item: any, index: number) => {
								return (
									<TableRow key={index} className={detailsClassName}>
										<TableCell />
										<TableCell>{item?.productName}</TableCell>
										<TableCell>{`₦${item?.unitPrice?.toLocaleString()}`}</TableCell>
										<TableCell>{item?.quantity}</TableCell>
										<TableCell>{`₦${(item?.unitPrice * item?.quantity)?.toLocaleString()}`}</TableCell>
										<TableCell />
									</TableRow>
								);
							})}
							{breakdown.map((item, index) => {
								return (
									<TableRow key={index} className={detailsClassName}>
										<TableCell />
										<TableCell />
										<TableCell />
										<TableCell>
											{item
												.replace(/([a-z])([A-Z])/g, "$1 $2")
												.replace(/^./, (character) => character.toUpperCase())}
										</TableCell>
										<TableCell>{`₦${row?.[item]?.toLocaleString()}`}</TableCell>
										<TableCell />
									</TableRow>
								);
							})}
						</React.Fragment>
					);
				})}
			</TableBody>
		</BaseTable>
	);
};
