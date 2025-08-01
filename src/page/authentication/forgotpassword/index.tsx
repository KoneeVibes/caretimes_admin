import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { AuthLayout } from "../../../container/layout/auth"
import { ForgotPasswordWrapper } from "./styled"
import { BaseLegend } from "../../../component/form/legend/styled"
import { useState } from "react"
import { BaseFieldSet } from "../../../component/form/fieldset/styled"
import { BaseInput } from "../../../component/form/input/styled"
import { BaseButton } from "../../../component/button/styled"
import { forgotPasswordService } from "../../../util/authentication/forgotPassword"
import { useNavigate } from "react-router-dom"

export const ForgotPassword = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formDetails, setFormDetails] = useState({
        email: "",
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
        return navigate("/");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await forgotPasswordService(formDetails);
            if (response.status === "success") {
                setIsLoading(false);
                navigate(`/auth-verification/${formDetails.email}`);
            } else {
                setIsLoading(false);
                setError('Forgot password trigger failed. Please check your credentials and try again.');
            }
        } catch (error: any) {
            setIsLoading(false);
            setError(`Forgot password failed to trigger. ${error.message}`);
            console.error('Forgot password failed to trigger:', error);
        }
    };

    return (
        <AuthLayout>
            <ForgotPasswordWrapper
                onSubmit={handleSubmit}
            >
                <Box
                    overflow={"hidden"}
                >
                    <BaseLegend
                        sx={{ textAlign: "center" }}
                    >
                        Reset Password
                    </BaseLegend>
                </Box>
                <Stack
                    gap={"calc(var(--flex-gap)/2)"}
                >
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
                            To Reset your password, Enter the Email linked to your account, an OTP will be sent to you.
                        </Typography>
                    </Box>
                    {error && (
                        <Box>
                            <Typography
                                fontFamily={"Roboto"}
                                fontWeight={"600"}
                                fontSize={15}
                                lineHeight={"normal"}
                                color={"var(--error-color)"}
                                whiteSpace={"normal"}
                                textAlign={"center"}
                            >
                                {error}
                            </Typography>
                        </Box>
                    )}
                </Stack>
                <Box>
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
                </Box>
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
                                    Send OTP
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
                                Cancel
                            </Typography>
                        </BaseButton>
                    </Box>
                </Stack>
            </ForgotPasswordWrapper>
        </AuthLayout>
    )
}