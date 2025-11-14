import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string | number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write here...',
  minHeight = '150px',
}: Props) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ minHeight }}
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
      }}
    />
  );
}
