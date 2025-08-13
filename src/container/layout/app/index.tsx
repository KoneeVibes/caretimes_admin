import { useEffect } from "react";
import { AppLayoutPropsType } from "../../../type/container.type";
import { MainArea } from "../../mainarea";
import { SideNavigation } from "../../navigation/sidenavigation";
import { TopNavigation } from "../../navigation/topnavigation";
import { AppLayoutWrapper } from "./styled";
import avatar from "../../../asset/image/demo-avatar.svg";

export const AppLayout: React.FC<AppLayoutPropsType> = ({ children, pageId }) => {

    useEffect(() => {
        if (!pageId) return;
        document.body.id = pageId;
        return () => {
            document.body.removeAttribute("id");
        };
    }, [pageId]);

    return (
        <AppLayoutWrapper
            id={pageId}
            maxWidth={false}
        >
            <SideNavigation
                role="Admin"
                avatar={avatar}
                username="John Doe"
            />
            <TopNavigation
                role="Admin"
                avatar={avatar}
                username="John Doe"
            />
            <MainArea>
                {children}
            </MainArea>
        </AppLayoutWrapper>
    )
}