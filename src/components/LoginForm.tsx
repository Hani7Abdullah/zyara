// React
import { useNavigate } from 'react-router-dom';

// MUI
import { Button, TextField, Stack, Typography } from '@mui/material';

// Yup
import * as Yup from 'yup';

// Hooks
import { useForm } from '../hooks/useForm';

// Types
import type { LoginModel } from '../types/auth';

// Store
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';

interface Props {
    onForgot: () => void;
}

function LoginForm({ onForgot }: Props) {
    const login = useAuthStore((s) => s.login);
    const loading = useAuthStore((s) => s.loading);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const loginSchema = Yup.object({
        email: Yup.string()
            .email(t("login.email-validation"))
            .required(t("login.email-required")),
        password: Yup.string()
            .min(8, t("login.password-validation"))
            .required(t("login.password-required")),
    });

    const handleSubmit = async (values: LoginModel) => {
        const success = await login(values);
        if (success) {
            navigate('/');
        }
    };

    const formik = useForm<LoginModel>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: handleSubmit,
    });

    return (
        <Stack
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            autoComplete="off"
            direction="column"
            alignItems="center"
            justifyContent="center"
            rowGap={3}
            width="100%"
        >
            <Stack width="100%" rowGap={1}>
                <Typography variant="body2" fontWeight={600} sx={{ textTransform: "capitalize" }}>
                    {t("login.email")}
                </Typography>
                <TextField
                    fullWidth
                    name="email"
                    placeholder={t("login.email-placeholder")}
                    type="email"
                    size="small"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
            </Stack>

            <Stack width="100%" rowGap={1}>
                <Typography variant="body2" fontWeight={600} sx={{ textTransform: "capitalize" }}>
                    {t("login.password")}
                </Typography>
                <TextField
                    fullWidth
                    name="password"
                    placeholder={t("login.password-placeholder")}
                    type="password"
                    size="small"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />

                <Typography
                    variant="body2"
                    sx={{ mt: 2, textAlign: "right", cursor: "pointer", color: "#1976d2" }}
                    onClick={onForgot}
                >
                    {t("login.forgot-password")}
                </Typography>
            </Stack>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={formik.isSubmitting || loading}
                sx={{ mt: 3 }}
            >
                {loading ? t("login.loading") : t("login.login")}
            </Button>
        </Stack>
    );
}

export default LoginForm;
