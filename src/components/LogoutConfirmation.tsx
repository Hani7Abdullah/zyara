import EntityModal from './EntityModal';
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmation({ open, onClose, onConfirm }: Props) {
  
  const { t } = useTranslation();

  return (
    <EntityModal open={open} onClose={onClose} title={t('logout')}>
      <Stack
        spacing={3}
        sx={{
          "& button": {
            minWidth: "15%"
          }
        }}
      >
        <Typography>{t('sureLogout')}</Typography>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onClose} variant="outlined">
            {t('cancel')}
          </Button>
          <Button onClick={onConfirm} variant="contained" color="error">
            {t('sure')}
          </Button>
        </Stack>
      </Stack>
    </EntityModal>
  );
}
