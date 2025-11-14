// React
import { useState } from "react";

// MUI
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled, type Theme } from "@mui/material/styles";

// Zustand store
import { useGiftCardStore } from "../../store/useGiftCardStore";

// Types
import type { GiftCardModel } from "../../types/giftCard";

const StyledCard = styled(Card)(({ theme }: { theme: Theme }) => ({
  minHeight: "150px",
  borderRadius: "8px",
  boxShadow: theme.shadows[2],
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "row",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const PriceTag = styled(Box)(({ color }: { color: string }) => ({
  backgroundColor: color,
  color: "#fff",
  padding: "8px 12px",
  writingMode: "vertical-rl",
  textOrientation: "mixed",
  fontWeight: 600,
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const GiftCard = ({ card }: { card: GiftCardModel }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { deleteGiftCard, switchActivation, setSelectedGiftCard } = useGiftCardStore();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    setSelectedGiftCard(card); 
    handleMenuClose();
  };

  const handleDelete = async () => {
    await deleteGiftCard(card.id);
    handleMenuClose();
  };

  const handleToggle = async () => {
    await switchActivation(card.id);
    handleMenuClose();
  };

  return (
    <StyledCard>
      <PriceTag color={card.color}>{card.price.toLocaleString()} SYP</PriceTag>

      <CardContent sx={{ flex: 1, position: "relative" }}>
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{ position: "absolute", top: 8, right: 4 }}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
          <MenuItem onClick={handleToggle}>
            {card.is_active ? "Deactivate" : "Activate"}
          </MenuItem>
        </Menu>

        <Typography variant="h6" fontWeight="bold" color={card.color} mb={1}>
          {card.title}
        </Typography>

        <Typography variant="body2" mb={2}>
          {card.description}
        </Typography>

        <Typography variant="body2" fontWeight="bold">
          Buy it for {card.cost.toLocaleString()} SYP
        </Typography>

        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            color: card.is_active ? "success.main" : "error.main",
            fontWeight: 600,
          }}
        >
          {card.is_active ? "Active" : "Inactive"}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default GiftCard;
