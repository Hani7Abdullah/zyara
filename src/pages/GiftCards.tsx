import {
  Stack,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGiftCardStore } from "../store/useGiftCardStore";
import type { GiftCardModel } from "../types/giftCard";
import GiftCard from "../components/giftCard/GiftCard"; 

const initialState: GiftCardModel = {
  id: "",
  title: "",
  arabic_title: "",
  summary: "",
  arabic_summary: "",
  description: "",
  arabic_description: "",
  price: 0,
  cost: 0,
  color: "#1976d2",
  icon: "",
  classifications: [],
  type: "internal",
  external_stores: [],
  expiration_date: "",
  is_active: true,
};

const GiftCards = () => {
  const {
    data,
    createGiftCard,
    updateGiftCard,
  } = useGiftCardStore();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<GiftCardModel>(initialState);

  const handleOpen = (card?: GiftCardModel) => {
    setFormData(card || { ...initialState, id: uuidv4() });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "cost"].includes(name) ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const exists = (data as GiftCardModel[]).some((c) => c.id === formData.id);
    if (exists) await updateGiftCard(formData.id, formData);
    else await createGiftCard(formData);
    handleClose();
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={() => handleOpen()}>
          Add New Gift Card
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {(data as GiftCardModel[]).map((card) => (
          <Grid key={card.id} size={{ xs:12, sm:6, md:4 }}>
            <GiftCard card={card}/>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {(data as GiftCardModel[]).some((c) => c.id === formData.id)
            ? "Edit"
            : "Add"}{" "}
          Gift Card
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Cost"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Color"
              name="color"
              type="color"
              value={formData.color}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {(data as GiftCardModel[]).some((c) => c.id === formData.id)
              ? "Update"
              : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default GiftCards;
