import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { ManagePermissionsFormWrapper } from "./styled";
import { SwitchField } from "../../../component/form/switch/styled";
import { ManagePermissionsFormType } from "../../../type/container.type";

export const ManagePermissionsForm: React.FC<ManagePermissionsFormType> = ({
	permissions,
	setPermissions,
}) => {
	const matches = useMediaQuery("(max-width:200px)");

	const handleTogglePermissions = (
		e: React.ChangeEvent<HTMLInputElement>,
		permission: any
	) => {
		e.stopPropagation();
		const updatedPermissions = permissions.map((perm) => {
			if (perm.module === permission.module) {
				return {
					...perm,
					status: perm.status === "active" ? "inactive" : "active",
				};
			}
			return perm;
		});
		setPermissions(updatedPermissions);
	};

	return (
		<ManagePermissionsFormWrapper>
			{permissions?.map((permission, index) => {
				return (
					<Stack
						key={index}
						direction={"row"}
						overflow={"hidden"}
						alignItems={"center"}
						gap={"calc(var(--flex-gap))"}
					>
						<Box overflow={"hidden"} flex={1}>
							<Typography
								component={"p"}
								variant="subtitle2"
								fontFamily={"Roboto"}
								fontWeight={400}
								fontSize={16}
								lineHeight={"normal"}
								color="var(--drawer-subtitle-text-color)"
							>
								{permission?.module}
							</Typography>
						</Box>
						<Box overflow={"hidden"} flexShrink={matches ? 1 : 0}>
							<SwitchField
								checked={permission?.status === "active"}
								onChange={(e) => handleTogglePermissions(e, permission)}
							/>
						</Box>
					</Stack>
				);
			})}
		</ManagePermissionsFormWrapper>
	);
};
