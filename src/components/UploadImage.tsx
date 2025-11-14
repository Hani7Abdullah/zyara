import { Stack, Avatar, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { ChangeEvent } from "react";

interface UploadImageProps {
  label?: string;
  imageFile?: File | string | null;
  initialImage?: string;
  disabled?: boolean;
  onChange: (file: File | null) => void;
}

export default function UploadImage({
  imageFile,
  initialImage,
  disabled = false,
  onChange,
}: UploadImageProps) {

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const imagePreview =
    imageFile instanceof File
      ? URL.createObjectURL(imageFile)
      : imageFile || initialImage;

  return (
    <Stack spacing={1} alignItems="center">
      <Box
        sx={{
          position: "relative",
          display: "inline-block",
        }}
      >
        {/* Avatar */}
        <Avatar
          src={imagePreview}
          alt="Preview"
          sx={{
            width: 110,
            height: 110,
            border: "1px solid",
            borderColor: "#ccc",
          }}
        />

        {/* Edit Icon Button */}
        {!disabled && (
          <IconButton
            component="label"
            size="small"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "primary.main",
              color: "#fff",
              "&:hover": { bgcolor: "primary.dark" },
              width: 28,
              height: 28,
              boxShadow: 2,
            }}
          >
            <EditIcon sx={{ fontSize: 17 }} />
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleFileChange}
            />
          </IconButton>
        )}
      </Box>

      {/* File name display (optional) */}
      {/* {imageFile instanceof File && (
        <Typography variant="caption" color="text.secondary">
          {imageFile.name}
        </Typography>
      )} */}
    </Stack>
  );
}
