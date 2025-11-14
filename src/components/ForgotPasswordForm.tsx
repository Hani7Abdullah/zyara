import { useState, useEffect, useRef } from "react";
import {
  Stack,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { useForm } from "../hooks/useForm";
import * as Yup from "yup";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "react-i18next";

interface Props {
  onBack: () => void;
}

export default function ResetPasswordFlow({ onBack }: Props) {
  const { loading, requestResetPassword, verifyOtp, resetPassword } = useAuthStore();
  const [step, setStep] = useState<"request" | "verify" | "reset">("request");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  /** STEP 1: Request Reset **/
  const requestSchema = Yup.object({
    email: Yup.string()
      .email(t("reset.email-validation"))
      .required(t("reset.email-required")),
  });

  const requestForm = useForm<{ email: string }>({
    initialValues: { email: "" },
    validationSchema: requestSchema,
    onSubmit: async (values) => {
      const success = await requestResetPassword(values);
      if (success) {
        setEmail(values.email);
        setStep("verify");
        setCooldown(60);
      }
    },
  });

  /** STEP 2: Verify OTP **/
  const otpLength = 6;
  const [otpValues, setOtpValues] = useState(Array(otpLength).fill(""));
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);
    if (value && index < otpLength - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const submitOtp = async () => {
    const code = otpValues.join("");
    if (code.length !== otpLength) return;
    setIsVerifying(true);
    try {
      const token = await verifyOtp({ email, code });
      if (token) {
        setResetToken(token);
        setStep("reset");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  /** STEP 3: Reset Password **/
  const resetSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, t("reset.password-min"))
      .required(t("reset.password-required")),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], t("reset.password-match"))
      .required(t("reset.password-confirm-required")),
  });

  const resetForm = useForm<{ newPassword: string; confirmNewPassword: string }>({
    initialValues: { newPassword: "", confirmNewPassword: "" },
    validationSchema: resetSchema,
    onSubmit: async (values) => {
      const success = await resetPassword({
        reset_token: resetToken,
        password: values.newPassword,
        password_confirmation: values.confirmNewPassword,
      });
      if (success) onBack();
    },
  });

  return (
    <Stack spacing={4}>
      {/* STEP 1: Request Reset */}
      {step === "request" && (
        <Stack component="form" onSubmit={requestForm.handleSubmit} spacing={2}>
          <Typography variant="h5" fontWeight="bold">
            {t("reset.forgot-title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("reset.forgot-description")}
          </Typography>

          <TextField
            name="email"
            fullWidth
            placeholder={t("login.email-placeholder")}
            type="email"
            size="small"
            value={requestForm.values.email}
            onChange={requestForm.handleChange}
            onBlur={requestForm.handleBlur}
            error={requestForm.touched.email && Boolean(requestForm.errors.email)}
            helperText={requestForm.touched.email && requestForm.errors.email}
          />

          <Stack direction="row" spacing={2} alignItems="center">
            <Button onClick={onBack} variant="outlined" disabled={loading}>
              {t("reset.back")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={cooldown > 0 || requestForm.isSubmitting || loading}
              startIcon={
                (requestForm.isSubmitting || loading) ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
            >
              {cooldown > 0
                ? `${t("reset.resend-in")} ${cooldown}s`
                : t("reset.send-otp")}
            </Button>

            {cooldown > 0 && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {cooldown}s
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      )}

      {/* STEP 2: Verify OTP */}
      {step === "verify" && (
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight="bold">
            {t("reset.verify-title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("reset.verify-description", { email })}
          </Typography>

          <Stack direction="row" spacing={1}>
            {otpValues.map((value, index) => (
              <TextField
                key={index}
                inputRef={(el) => (otpRefs.current[index] = el)}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                slotProps={{
                  input: {
                    inputProps: {
                      maxLength: 1,
                      style: { textAlign: "center", fontSize: "1.2rem" },
                    },
                  },
                }}
                disabled={isVerifying || loading}
                sx={{ width: 50 }}
              />
            ))}
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              onClick={submitOtp}
              disabled={isVerifying || loading}
              startIcon={
                isVerifying ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
            >
              {isVerifying ? t("reset.verifying") : t("reset.verify")}
            </Button>

            <Button
              variant="outlined"
              disabled={cooldown > 0 || isResending || loading}
              onClick={async () => {
                setIsResending(true);
                try {
                  await requestResetPassword({ email });
                  setCooldown(60);
                } finally {
                  setIsResending(false);
                }
              }}
              startIcon={
                isResending ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
            >
              {isResending ? t("reset.sending") : t("reset.resend")}
            </Button>

            {cooldown > 0 && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {cooldown}s
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      )}

      {/* STEP 3: Reset Password */}
      {step === "reset" && (
        <Stack component="form" onSubmit={resetForm.handleSubmit} spacing={2}>
          <Typography variant="h5" fontWeight="bold">
            {t("reset.reset-title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("reset.reset-description")}
          </Typography>

          <TextField
            name="newPassword"
            label={t("reset.new-password")}
            type="password"
            size="small"
            fullWidth
            value={resetForm.values.newPassword}
            onChange={resetForm.handleChange}
            error={resetForm.touched.newPassword && Boolean(resetForm.errors.newPassword)}
            helperText={resetForm.touched.newPassword && resetForm.errors.newPassword}
            disabled={resetForm.isSubmitting || loading}
          />

          <TextField
            name="confirmNewPassword"
            label={t("reset.confirm-password")}
            size="small"
            type="password"
            fullWidth
            value={resetForm.values.confirmNewPassword}
            onChange={resetForm.handleChange}
            error={resetForm.touched.confirmNewPassword && Boolean(resetForm.errors.confirmNewPassword)}
            helperText={
              resetForm.touched.confirmNewPassword && resetForm.errors.confirmNewPassword
            }
            disabled={resetForm.isSubmitting || loading}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={resetForm.isSubmitting || loading}
            startIcon={
              (resetForm.isSubmitting || loading) ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
          >
            {resetForm.isSubmitting ? t("reset.submitting") : t("reset.submit")}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
