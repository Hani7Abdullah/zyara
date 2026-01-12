import { useEffect, useState, type ChangeEvent } from "react";
import EntityModal from "./EntityModal";
import {
  Stack,
  Button,
  TextField,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import UploadImage from "./UploadImage";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: Props) {
  const {
    data: { profile: user },
    changePassword,
    updateProfile,
    logout,
    loading,
  } = useAuthStore();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const [profileValues, setProfileValues] = useState({
    name: "",
    email: "",
    mobile_number: "",
    role_name: "",
  });

  const [passwordValues, setPasswordValues] = useState({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setProfileValues({
        name: user.name || "",
        email: user.email || "",
        mobile_number: user.mobile_number || "",
        role_name: user.role_name || "",
      });
      setPreview(user.image || "");
    }
  }, [user]);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileChange =
    (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setProfileValues((prev) => ({ ...prev, [field]: e.target.value }));
      setProfileErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handlePasswordChange =
    (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setPasswordValues((prev) => ({ ...prev, [field]: e.target.value }));
      setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
    };

  // 🔹 Validate profile fields
  const validateProfile = () => {
    const errors: Record<string, string> = {};
    if (!profileValues.name.trim()) errors.name = t("validation.required");
    if (!profileValues.mobile_number.trim())
      errors.mobile_number = t("validation.required");
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 🔹 Validate password fields
  const validatePassword = () => {
    const errors: Record<string, string> = {};
    if (!passwordValues.old_password.trim())
      errors.old_password = t("validation.required");
    if (!passwordValues.new_password.trim())
      errors.new_password = t("validation.required");
    else if (passwordValues.new_password.length < 8)
      errors.new_password = t("reset.password-min");
    if (!passwordValues.new_password_confirmation.trim())
      errors.new_password_confirmation = t("reset.password-confirm-required");
    else if (
      passwordValues.new_password !== passwordValues.new_password_confirmation
    )
      errors.new_password_confirmation = t("reset.password-match");
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile() || isSubmittingProfile) return;

    setIsSubmittingProfile(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PATCH");
      formData.append("name", profileValues.name);
      formData.append("mobile_number", profileValues.mobile_number);
      if (selectedImage) formData.append("image", selectedImage);

      await updateProfile(formData);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleSubmitPasswordChange = async () => {
    if (!validatePassword() || isSubmittingPassword) return;

    setIsSubmittingPassword(true);
    try {
      const success = await changePassword(passwordValues);
      if (success) {
        logout();
        navigate("/login");
      }
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <EntityModal open={open} onClose={onClose} title={t("profile")}>
      <Tabs
        value={tab}
        onChange={(_, newTab) => setTab(newTab)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label={t("profile")} />
        <Tab label={t("change-password")} />
      </Tabs>

      {/* --- Profile Tab --- */}
      {tab === 0 && (
        <Stack sx={{ py: 1, px: 3 }} spacing={3} alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center" width="100%" pb={2}>
            <UploadImage
              imageFile={selectedImage || preview}
              initialImage={user?.image}
              onChange={handleImageChange}
              disabled={isSubmittingProfile}
            />
            <Stack direction="column" rowGap={1}>
              <Typography>{`${t("shared.name")} : ${profileValues.name}`}</Typography>
              <Typography>{`${t("shared.email")} : ${profileValues.email}`}</Typography>
              <Typography>{`${t("mobile_number")} : ${profileValues.mobile_number}`}</Typography>
              {profileValues.role_name && <Typography>{`${t("role.title")} : ${profileValues.role_name}`}</Typography>}
            </Stack>
          </Stack>

          <TextField
            label={t("shared.name")}
            value={profileValues.name}
            onChange={handleProfileChange("name")}
            fullWidth
            size="small"
            error={!!profileErrors.name}
            helperText={profileErrors.name}
            disabled={isSubmittingProfile}
          />

          <TextField
            label={t("mobile_number")}
            value={profileValues.mobile_number}
            onChange={handleProfileChange("mobile_number")}
            fullWidth
            size="small"
            error={!!profileErrors.mobile_number}
            helperText={profileErrors.mobile_number}
            disabled={isSubmittingProfile}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={onClose} variant="outlined" disabled={isSubmittingProfile}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSaveProfile}
              variant="contained"
              disabled={isSubmittingProfile || loading}
              startIcon={
                isSubmittingProfile ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
            >
              {isSubmittingProfile ? t("saving") : t("save")}
            </Button>
          </Stack>
        </Stack>
      )}

      {/* --- Change Password Tab --- */}
      {tab === 1 && (
        <Stack sx={{ py: 1, px: 3 }} spacing={3}>
          <TextField
            label={t("old_password")}
            type="password"
            value={passwordValues.old_password}
            onChange={handlePasswordChange("old_password")}
            fullWidth
            size="small"
            error={!!passwordErrors.old_password}
            helperText={passwordErrors.old_password}
            disabled={isSubmittingPassword}
          />

          <TextField
            label={t("new_password")}
            type="password"
            value={passwordValues.new_password}
            onChange={handlePasswordChange("new_password")}
            fullWidth
            size="small"
            error={!!passwordErrors.new_password}
            helperText={passwordErrors.new_password}
            disabled={isSubmittingPassword}
          />

          <TextField
            label={t("new_password_confirmation")}
            type="password"
            value={passwordValues.new_password_confirmation}
            onChange={handlePasswordChange("new_password_confirmation")}
            fullWidth
            size="small"
            error={!!passwordErrors.new_password_confirmation}
            helperText={passwordErrors.new_password_confirmation}
            disabled={isSubmittingPassword}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={onClose} variant="outlined" disabled={isSubmittingPassword}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSubmitPasswordChange}
              variant="contained"
              disabled={isSubmittingPassword || loading}
              startIcon={
                isSubmittingPassword ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
            >
              {isSubmittingPassword ? t("changing") : t("change")}
            </Button>
          </Stack>
        </Stack>
      )}
    </EntityModal>
  );
}
