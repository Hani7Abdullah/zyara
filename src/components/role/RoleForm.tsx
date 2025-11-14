// React
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

// MUI
import {
  Button,
  Stack,
  TextField,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";

// i18next
import { useTranslation } from "react-i18next";

// Components
import EntityModalForm from "../EntityModal";
import PaginatedSelect from "../PaginatedSelect";

// Stores
import { usePermissionStore } from "../../store/usePermissionStore";

// Types
import type { CRUDMode } from "../../types/common";
import type { RoleModel } from "../../types/role";
import type { PermissionModel } from "../../types/permission";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (
    formData: Partial<RoleModel>,
    id?: string
  ) => Promise<void> | void;
  mode: CRUDMode;
  initialData?: Partial<RoleModel>;
}

export default function RoleForm({
  open,
  onClose,
  onConfirm,
  mode,
  initialData,
}: Props) {
  const { t, i18n } = useTranslation();
  const { fetchPermissions } = usePermissionStore();
  const [loading, setLoading] = useState(false);

  const isDelete = mode === "delete";
  const isCreate = mode === "create";
  const isUpdate = mode === "update";

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<{
    name: string;
    arabic_name: string;
    permissions: number[];
  }>({
    defaultValues: {
      name: "",
      arabic_name: "",
      permissions: [],
    },
  });

  /** Reset form when initialData or mode changes **/
  useEffect(() => {
    if (isCreate) {
      reset({
        name: "",
        arabic_name: "",
        permissions: [],
      });
    } else if (initialData && isUpdate) {
      // Convert permissions to IDs
      const permissionIds = (initialData.permissions || []).map(p =>
        typeof p === 'object' ? p.id : p
      );

      reset({
        ...initialData,
        permissions: permissionIds,
      });
    }
  }, [initialData, isCreate, isUpdate, reset]);

  /** Handle form submit - no conversion needed now **/
  const onSubmit = async (data: { name: string; arabic_name: string; permissions: number[] }) => {
    setLoading(true);
    try {
      // No need to convert permissions anymore
      await onConfirm(data, initialData?.id?.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm({}, initialData?.id?.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      reset();
    }
  };

  return (
    <EntityModalForm
      open={open}
      onClose={handleClose}
      title={`${t(mode)} ${t("role.title")}`}
    >
      {isDelete ? (
        <Stack spacing={3}>
          <Typography>{t("role.confirmDelete")}</Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleClose} variant="outlined" disabled={loading}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={loading}
              startIcon={loading && <CircularProgress size={18} color="inherit" />}
            >
              {t("sure")}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" rowGap={3}>
            <Grid container spacing={3} pt={1}>
              {/* English Name */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("shared.name")}
                  {...register("name", { required: t("validation.required") })}
                  error={!!errors.name}
                  fullWidth
                  size="small"
                  disabled={loading}
                />
              </Grid>

              {/* Arabic Name */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("shared.arabic_name")}
                  {...register("arabic_name", { required: t("validation.required") })}
                  error={!!errors.arabic_name}
                  fullWidth
                  size="small"
                  disabled={loading}
                />
              </Grid>

              {/* Permissions Dropdown */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="permissions"
                  control={control}
                  rules={{ required: t("validation.required") }}
                  render={({ field }) => (
                    <PaginatedSelect<number, PermissionModel>
                      label={t("role.permissions")}
                      multiple
                      value={field.value}
                      onChange={(val) => field.onChange(val)} 
                      fetchOptions={fetchPermissions}
                      getOptionLabel={(permission) =>
                    i18n.language === "ar" ? permission.arabic_name : permission.name
                  } 
                      getOptionValue={(p) => p.id}
                      error={!!errors.permissions}
                      helperText={errors.permissions?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={handleClose} variant="outlined" disabled={loading}>
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size={18} color="inherit" />}
              >
                {t(isCreate ? "create" : "update")}
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </EntityModalForm>
  );
}
