import { CardMedia, Stack } from '@mui/material';
import { type ChangeEvent, useRef } from 'react';

import DefaultImage from '../assets/images/default-upload.jpg';

interface ImageUploaderProps {
  value?: string;
  onChange: (base64: string) => void;
  disabled?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  disabled
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        onChange(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Stack direction="row" justifyContent="center">
      <input
        type="file"
        hidden
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      <CardMedia
        component="img"
        image={value || DefaultImage}
        alt="Preview"
        sx={{
          height: 120,
          width: 120,
          borderRadius: '50%',
          objectFit: 'cover',
          cursor: disabled ? 'auto': 'pointer',
          border: '1px solid #ccc',
        }}
        onClick={() => !disabled && fileInputRef.current?.click()}
      />
    </Stack>
  );
}
