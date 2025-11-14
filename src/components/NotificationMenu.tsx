import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Button
} from '@mui/material';
import { Search, Delete, Add } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';


interface NotificationMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
}


export default function NotificationMenu({ anchorEl, open, onClose }: NotificationMenuProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const per_page = 5;

  const { t } = useTranslation();

  const fakeNotifications = Array.from({ length: 28 }).map((_, i) => ({
    id: i + 1,
    title: t('notification.title', { number: i + 1 }),
    body: t('notification.body', { number: i + 1 }),
    date: new Date().toLocaleDateString(),
  }));

  const [notifications, setNotifications] = useState(fakeNotifications);


  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * per_page, page * per_page);
  const pageCount = Math.ceil(filtered.length / per_page);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 380,
            maxHeight: 500,
            p: 2,
            borderRadius: 3,
            boxShadow: 4,
          }
        }
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="bold">{t("notifications")}</Typography>
          <Button startIcon={<Add />} size="small" variant="outlined">
            {t("create")}
          </Button>
        </Stack>

        <TextField
          size="small"
          placeholder={t("notification.searchPlaceholder")}
          fullWidth
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }
          }}
        />

        <Divider />

        {paginated.length > 0 ? (
          paginated.map((n) => (
            <MenuItem key={n.id} sx={{ alignItems: 'flex-start' }}>
              <Box flexGrow={1}>
                <Typography fontWeight="bold">{n.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {n.body}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {n.date}
                </Typography>
              </Box>
              <Tooltip title={t("delete")}>
                <IconButton size="small" onClick={() => handleDelete(n.id)}>
                  <Delete fontSize="small" color="error" />
                </IconButton>
              </Tooltip>
            </MenuItem>
          ))
        ) : (
          <Typography textAlign="center" color="text.secondary">
            {t("notification.noFound")}
          </Typography>
        )}

        {/* Pagination Controls */}
        {pageCount > 1 && (
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              {t("notification.prev")}
            </Button>
            <Typography>
              {t('notification.page', { current: page, total: pageCount })}
            </Typography>
            <Button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
            >
              {t("notification.next")}
            </Button>
          </Stack>
        )}
      </Stack>
    </Menu>
  );
}
