import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { AuthLayout } from "../../../container/layout/auth";
import { ResetPasswordWrapper } from "./styled";
import { BaseLegend } from "../../../component/form/legend/styled";
import { Fragment, useState } from "react";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { BaseButton } from "../../../component/button/styled";
import successTick from "../../../asset/icon/success-tick.svg";
import { useNavigate, useParams } from "react-router-dom";
import { resetPasswordService } from "../../../util/authentication/resetPassword";

export const ResetPassword = () => {
    const navigate = useNavigate();
    const { id = "" } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isResetSuccessful, setIsResetSuccessful] = useState(false);
    const [formDetails, setFormDetails] = useState({
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNavigateToLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        return navigate("/")
    };

    const handleNavigateToForgotPassword = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        return navigate("/forgot-password");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await resetPasswordService({ ...formDetails, email: id });
            if (response.status === "success") {
                setIsLoading(false);
                setIsResetSuccessful(true);
            } else {
                setIsLoading(false);
                setError('Reset password failed. Please check your credentials and try again.');
            }
        } catch (error: any) {
            setIsLoading(false);
            setError(`Failed to reset password. ${error.message}`);
            console.error('Failed to reset password:', error);
        }
    };

    return (
        <AuthLayout>
            <ResetPasswordWrapper
                onSubmit={handleSubmit}
            >
                {isResetSuccessful && (
                    <Box
                        component={"div"}
                        className="success-tick-box"
                    >
                        <img
                            src={successTick}
                            alt="Success Tick"
                        />
                    </Box>
                )}
                <Box
                    overflow={"hidden"}
                >
                    <BaseLegend
                        sx={{ textAlign: "center" }}
                    >
                        {isResetSuccessful ? "Password Reset Successful" : "Reset Password"}
                    </BaseLegend>
                </Box>
                {error && !isResetSuccessful && (
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
                {isResetSuccessful ? (
                    <Box
                        component={"div"}
                        className="call-to-action"
                    >
                        <BaseButton
                            variant="contained"
                            disableElevation
                            sx={{
                                width: "100%"
                            }}
                            onClick={handleNavigateToLogin}
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
                                Login
                            </Typography>
                        </BaseButton>
                    </Box>
                ) : (
                    <Fragment>
                        <Stack
                            gap={"calc(var(--flex-gap)/2)"}
                        >
                            <BaseFieldSet>
                                <BaseInput
                                    required
                                    type="password"
                                    name="password"
                                    value={formDetails.password}
                                    placeholder="Create Password"
                                    isError={error ? true : false}
                                    onChange={(e) => handleChange(e)}
                                />
                            </BaseFieldSet>
                            <BaseFieldSet>
                                <BaseInput
                                    required
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formDetails.confirmPassword}
                                    isError={error ? true : false}
                                    onChange={(e) => handleChange(e)}
                                />
                            </BaseFieldSet>
                        </Stack>
                        <Stack
                            gap={"calc(var(--flex-gap)/2)"}
                        >
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
                                            Proceed
                                        </Typography>
                                    )}
                                </BaseButton>
                            </Box>
                            <Box
                                component={"div"}
                                className="call-to-action"
                            >
                                <BaseButton
                                    disableElevation
                                    sx={{
                                        width: "100%"
                                    }}
                                    onClick={handleNavigateToForgotPassword}
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
                                        Cancel
                                    </Typography>
                                </BaseButton>
                            </Box>
                        </Stack>
                    </Fragment>
                )}
            </ResetPasswordWrapper>
        </AuthLayout>
    )
}