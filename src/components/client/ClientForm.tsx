import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import EntityModalForm from "../EntityModal";
import ViewTable from "../ViewTable";

import type { ClientModel } from "../../types/client";
import type { CRUDMode } from "../../types/common";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm?: (data?: Partial<ClientModel>) => void;
  mode: CRUDMode;
  initialData?: Partial<ClientModel>;
}

export default function ClientForm({
  open,
  onClose,
  mode,
  initialData,
}: Props) {
  const { t } = useTranslation();
  const { reset } = useForm<Partial<ClientModel>>({ defaultValues: {} });

  useEffect(() => {
    if (mode === "create") {
      reset({
        full_name: "",
        email: "",
        mobile_number: "",
        country: "",
        addresses: [],
      });
    } else if (initialData) {
      reset(initialData);
    }
  }, [mode, initialData, reset]);

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <EntityModalForm
      open={open}
      onClose={handleClose}
      title={`${t(mode)} ${t("client.title")}`}
    >
      <ViewTable
        rows={[
          { label: t("shared.name"), value: initialData?.full_name },
          { label: t("shared.email"), value: initialData?.email },
          { label: t("mobile_number"), value: initialData?.mobile_number },
          { label: t("client.country"), value: initialData?.country },
          {
            label: t("client.addresses"),
            value: initialData?.addresses?.map((addr, idx) => (
              <div key={addr.id} style={{ marginBottom: 8 }}>
                <div><strong>{addr.address_name}</strong></div>
                <div>{addr.country}, {addr.city}, {addr.area}</div>
                <div>{addr.street}, {t("client.address.floor")}: {addr.floor}</div>
                {addr.delivery_instruction && <div>{t("client.address.instructions")}: {addr.delivery_instruction}</div>}
                {idx < (initialData.addresses?.length ?? 0) - 1 && <hr style={{ borderTop: "1px dashed #ccc" }} />}
              </div>
            ))
          }
        ]}
      />
    </EntityModalForm>
  );
}


