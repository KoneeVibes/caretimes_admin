import { TableBody, TableCell, TableRow } from "@mui/material";
import { BaseTable } from "../../../component/table";
import { AdminTablePropsType } from "../../../type/container.type";
import { formatDate } from "../../../helper/dateFormatter";

export const AdminTable: React.FC<AdminTablePropsType> = ({
	rows,
	handleViewDetailsClick,
}) => {
	const adminTableHeaders = [
		"S/N",
		"Admin",
		"Email",
		"Phone",
		"Type",
		"Status",
		"Date Added",
	];
	return (
		<BaseTable headers={adminTableHeaders}>
			<TableBody>
				{rows?.map((row, index) => {
					return (
						<TableRow
							key={index}
							sx={{ cursor: "pointer" }}
							onClick={(e) => handleViewDetailsClick?.(e, row?.id)}
						>
							<TableCell>{index + 1}</TableCell>
							<TableCell>{`${row?.firstName ?? ""} ${
								row?.lastName ?? ""
							}`}</TableCell>
							<TableCell>{row?.email}</TableCell>
							<TableCell>{row?.phone}</TableCell>
							<TableCell>{row?.type}</TableCell>
							<TableCell>{row?.status}</TableCell>
							<TableCell>{formatDate(row?.createdAt, true)}</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</BaseTable>
	);
};
