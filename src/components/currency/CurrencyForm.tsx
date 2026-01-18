"use client";

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
  MenuItem,
} from "@mui/material";

// i18n
import { useTranslation } from "react-i18next";

// Components
import EntityModalForm from "../EntityModal";

// Utils
import { currencyOptions } from "../../utils/currencies";

// Types
import type { CurrencyModel } from "../../types/currency";
import type { CRUDMode } from "../../types/common";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (formData: FormData, id?: string) => Promise<void>;
  mode: CRUDMode;
  initialData?: Partial<CurrencyModel>;
}

type FormValues = {
  code: string;
  symbol: string;
  rate: number;
};

export default function CurrencyForm({
  open,
  onClose,
  onConfirm,
  mode,
  initialData,
}: Props) {
  const { t } = useTranslation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      code: "",
      symbol: "",
      rate: 0,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDelete = mode === "delete";
  const isCreate = mode === "create";

  // Reset on mode / initialData
  useEffect(() => {
    if (isCreate) {
      reset({ code: "", symbol: "", rate: 0 });
    } else if (initialData && mode === "update") {
      reset({
        code: initialData.code ?? "",
        symbol: initialData.symbol ?? "",
        rate: Number(initialData.rate ?? 0),
      });
    }
  }, [mode, initialData, reset, isCreate]);

  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      if (mode === "update") {
        formData.append("_method", "PATCH");
      }

      (Object.keys(data) as (keyof FormValues)[]).forEach((key) => {
        const value = data[key];
        const initialValue = initialData?.[key as keyof CurrencyModel];

        if (value !== undefined && value !== initialValue) {
          formData.append(key, value.toString());
        }
      });

      await onConfirm(formData, initialData?.id?.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ FIXED: delete handler
  const handleDelete = async () => {
    if (!initialData?.id || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onConfirm(new FormData(), initialData.id.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <EntityModalForm
      open={open}
      onClose={handleClose}
      title={`${t(mode)} ${t("currency.title")}`}
    >
      {isDelete ? (
        <Stack spacing={3}>
          {/* ✅ FIXED translation key */}
          <Typography>{t("currency.confirmDelete")}</Typography>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>

            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={isSubmitting}
              startIcon={
                isSubmitting && (
                  <CircularProgress size={18} color="inherit" />
                )
              }
            >
              {t("sure")}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} pt={1}>
            <Grid container spacing={3}>
              {/* Currency Code (Select) */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="code"
                  control={control}
                  rules={{ required: t("validation.required") as string }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={t("currency.code")}
                      fullWidth
                      size="small"
                      disabled={isSubmitting}
                      error={!!errors.code}
                      helperText={errors.code?.message}
                      onChange={(e) => {
                        const code = e.target.value;
                        const selected = currencyOptions.find(
                          (c) => c.code === code
                        );
                        field.onChange(code);
                        setValue("symbol", selected?.symbol ?? "");
                      }}
                    >
                      {currencyOptions.map((c) => (
                        <MenuItem key={c.code} value={c.code}>
                          {c.code} — {c.symbol} ({c.name})
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              {/* Rate */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("currency.rate")}
                  type="number"
                  {...register("rate", {
                    required: t("validation.required") as string,
                    valueAsNumber: true,
                  })}
                  error={!!errors.rate}
                  helperText={errors.rate?.message}
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                />
              </Grid>
            </Grid>

            {/* Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting && (
                    <CircularProgress size={20} color="inherit" />
                  )
                }
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
