import { AuthLayoutPropsType } from "../../../type/container.type";
import { AuthLayoutWrapper } from "./styled";

export const AuthLayout: React.FC<AuthLayoutPropsType> = ({ children }) => {
    return (
        <AuthLayoutWrapper>
            {children}
        </AuthLayoutWrapper>
    )
}