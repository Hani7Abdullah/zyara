import { Dialog, DialogTitle, DialogContent } from '@mui/material';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function EntityModalForm({ open, onClose, title, children }: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        fontWeight={700}
        align='center'
        sx={{
          mb: 2
        }}
      >{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
}
