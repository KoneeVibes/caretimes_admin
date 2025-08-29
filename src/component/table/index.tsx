import { Paper, Table, TableCell, TableHead, TableRow } from "@mui/material";
import { TableWrapper } from "./styled";
import { BaseTablePropsType } from "../../type/component.type";

export const BaseTable: React.FC<BaseTablePropsType> = ({
	headers,
	children,
}) => {
	return (
		<TableWrapper component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						{headers?.map((header, index) => {
							return <TableCell key={index}>{header}</TableCell>;
						})}
					</TableRow>
				</TableHead>
				{children}
			</Table>
		</TableWrapper>
	);
};
