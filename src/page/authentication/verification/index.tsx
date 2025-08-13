import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { AuthLayout } from "../../../container/layout/auth";
import { VerificationWrapper } from "./styled";
import { BaseLegend } from "../../../component/form/legend/styled";
import { BaseButton } from "../../../component/button/styled";
import { Fragment, useRef, useState } from "react";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { useNavigate, useParams } from "react-router-dom";
import { authVerificationService } from "../../../util/authentication/authVerification";
import { forgotPasswordService } from "../../../util/authentication/forgotPassword";

export const Verification = () => {
    const navigate = useNavigate();
    const { id = "" } = useParams();

    const [isResendOTPLoading, setIsResendOTPLoading] = useState(false);
    const [isVerificationLoading, setIsVerificationLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
    const [hasOTPResent, setHasOTPResent] = useState(false);
    const [formDetails, setFormDetails] = useState<Record<string, any>>({
        otp: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setFormDetails((prev) => ({
            ...prev,
            otp: newOtp.join("")
        }));
        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        };
    };

    const handleNavigate = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        if (e.key === "Backspace") {
            if (otp[index] === "" && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleResendOTP = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.preventDefault();
        if (hasOTPResent) return;
        setError(null);
        setIsResendOTPLoading(true);
        try {
            const response = await forgotPasswordService({ email: id });
            if (response.status === "success") {
                setIsResendOTPLoading(false);
                setHasOTPResent(true);
            } else {
                setIsResendOTPLoading(false);
                setError('Resend OTP failed. Please try again.');
            }
        } catch (error: any) {
            setIsResendOTPLoading(false);
            setError(`Failed to resend auth OTP. ${error.message}`);
            console.error('Failed to resend auth OTP:', error);
        }
    };

    const handleNavigateToForgotPassword = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        return navigate("/forgot-password");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsVerificationLoading(true);
        try {
            const response = await authVerificationService({ requester: id, submittedOTP: formDetails.otp });
            if (response.status === "success") {
                setIsVerificationLoading(false);
                navigate(`/reset-password/${id}`);
            } else {
                setIsVerificationLoading(false);
                setError('Auth OTP verification failed. Please check your credentials and try again.');
            }
        } catch (error: any) {
            setIsVerificationLoading(false);
            setError(`Failed to verify auth OTP. ${error.message}`);
            console.error('Failed to verify auth OTP:', error);
        }
    };

    return (
        <AuthLayout>
            <VerificationWrapper
                onSubmit={handleSubmit}
            >
                <Box
                    overflow={"hidden"}
                >
                    <BaseLegend
                        sx={{ textAlign: "center" }}
                    >
                        Verify It’s you
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
                            We sent a one time verification code to <Typography
                                component={"span"}
                                fontFamily={"inherit"}
                                fontWeight={"inherit"}
                                fontSize={"inherit"}
                                lineHeight={"inherit"}
                                color={"var(--primary-color-variant)"}
                                whiteSpace={"inherit"}
                                textAlign={"inherit"}
                            >
                                {id}
                            </Typography>
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
                <Grid
                    container
                    justifyContent={"space-between"}
                    spacing={{ mobile: "calc(var(--flex-gap)/4)", laptop: "calc(var(--flex-gap)/2)" }}
                >
                    {otp.map((digit, index) => (
                        <Grid
                            key={index}
                            flexGrow={1}
                            size={{ mobile: 2 }}
                        >
                            <BaseFieldSet>
                                <BaseInput
                                    required
                                    value={digit}
                                    inputProps={{ maxLength: 1 }}
                                    isError={error ? true : false}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleNavigate(e, index)}
                                    inputRef={(el) => (inputRefs.current[index] = el)}
                                />
                            </BaseFieldSet>
                        </Grid>
                    ))}
                </Grid>
                <Box>
                    {hasOTPResent ? (
                        <Typography
                            fontFamily={"Roboto"}
                            fontWeight={"400"}
                            fontSize={15}
                            lineHeight={"normal"}
                            color={"var(--primary-color)"}
                            whiteSpace={"normal"}
                            textAlign={"center"}
                        >
                            Resent!
                        </Typography>
                    ) : (
                        <Typography
                            fontFamily={"Roboto"}
                            fontWeight={"400"}
                            fontSize={15}
                            lineHeight={"normal"}
                            color={"var(--input-field-text-color)"}
                            whiteSpace={"normal"}
                            textAlign={"center"}
                        >
                            {isResendOTPLoading ? (
                                <CircularProgress color="inherit" className="loader" />
                            ) : (
                                <Fragment>
                                    {" Didn’t Recieve OTP,"}{" "}
                                    < Typography
                                        component={"span"}
                                        fontFamily={"inherit"}
                                        fontWeight={"inherit"}
                                        fontSize={"inherit"}
                                        lineHeight={"inherit"}
                                        color={"var(--primary-color)"}
                                        whiteSpace={"inherit"}
                                        textAlign={"inherit"}
                                        sx={{ cursor: "pointer" }}
                                        onClick={handleResendOTP}
                                    >
                                        Resend Code
                                    </Typography>
                                </Fragment>)}
                        </Typography>
                    )}
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
                            {isVerificationLoading ? (
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
                                    Verify
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
            </VerificationWrapper>
        </AuthLayout >
    )
}