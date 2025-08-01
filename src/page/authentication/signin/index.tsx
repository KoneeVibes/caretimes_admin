import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { AuthLayout } from "../../../container/layout/auth";
import { SignInWrapper } from "./styled";
import { BaseLegend } from "../../../component/form/legend/styled";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { useState } from "react";
import { BaseButton } from "../../../component/button/styled";
import { useNavigate } from "react-router-dom";
import { signInUserService } from "../../../util/authentication/signin";
import Cookies from "universal-cookie";

export const SignIn = () => {
    const cookies = new Cookies();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formDetails, setFormDetails] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNavigateToForgotPassword = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
        e.preventDefault();
        return navigate("/forgot-password")
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await signInUserService(formDetails);
            if (response.status === "success") {
                setIsLoading(false);
                cookies.set("TOKEN", response.token, {
                    path: "/",
                });
                navigate("/dashboard");
            } else {
                setIsLoading(false);
                setError('Authentication failed. Please check your credentials and try again.');
            }
        } catch (error: any) {
            setIsLoading(false);
            setError(`Login failed. ${error.message}`);
            console.error('Login failed:', error);
        }
    };

    return (
        <AuthLayout>
            <SignInWrapper
                onSubmit={handleSubmit}
            >
                <Box
                    overflow={"hidden"}
                >
                    <BaseLegend
                        sx={{ textAlign: "center" }}
                    >
                        Login to Dashboard
                    </BaseLegend>
                </Box>
                {error && (
                    <Box>
                        <Typography
                            fontFamily={"Roboto"}
                            fontWeight={"400"}
                            fontSize={15}
                            lineHeight={"normal"}
                            color={"var(--input-field-text-color)"}
                            whiteSpace={"normal"}
                            textAlign={"center"}
                        >
                            {error}
                        </Typography>
                    </Box>
                )}
                <Stack
                    gap={"calc(var(--flex-gap)/2)"}
                >
                    <BaseFieldSet>
                        <BaseInput
                            required
                            type="email"
                            name="email"
                            value={formDetails.email}
                            placeholder="Email Address"
                            isError={error ? true : false}
                            onChange={(e) => handleChange(e)}
                        />
                    </BaseFieldSet>
                    <BaseFieldSet>
                        <BaseInput
                            required
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formDetails.password}
                            isError={error ? true : false}
                            onChange={(e) => handleChange(e)}
                        />
                    </BaseFieldSet>
                    <Box>
                        <Typography
                            component={"p"}
                            fontFamily={"Roboto"}
                            fontWeight={"400"}
                            fontSize={14}
                            lineHeight={"normal"}
                            color={"var(--primary-color)"}
                            whiteSpace={"normal"}
                            sx={{ cursor: "pointer" }}
                            onClick={handleNavigateToForgotPassword}
                        >
                            Forgot password
                        </Typography>
                    </Box>
                </Stack>
                <Box
                    component={"div"}
                    className="call-to-action"
                >
                    <BaseButton
                        type="submit"
                        variant="contained"
                        disableElevation
                        sx={{
                            width: "100%"
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress color="inherit" className="loader" />
                        ) : (
                            <Typography
                                variant={"button"}
                                fontFamily={"inherit"}
                                fontWeight={"inherit"}
                                fontSize={"inherit"}
                                lineHeight={"inherit"}
                                color={"inherit"}
                                textTransform={"inherit"}
                            >
                                Login to Admin Dashboard
                            </Typography>
                        )}
                    </BaseButton>
                </Box>
            </SignInWrapper>
        </AuthLayout >
    )
}