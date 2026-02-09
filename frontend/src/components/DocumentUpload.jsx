import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FileUp, Image as ImageIcon } from 'lucide-react';

export default function DocumentUpload({ onUpload }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
          setTimeout(() => setPreview(null), 3000);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview('DOC');
        setTimeout(() => setPreview(null), 3000);
      }

      onUpload(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/jpeg,image/png,application/pdf"
      />
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleClick}
        className="relative flex min-h-[52px] min-w-[52px] items-center justify-center overflow-hidden rounded-2xl glass-subtle text-warm-100/50 transition-colors hover:text-golden hover:bg-white/[0.06]"
        aria-label="Upload document or image"
      >
        {preview ? (
          typeof preview === 'string' && preview.startsWith('data:') ? (
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <span className="text-base font-bold text-golden">{preview}</span>
          )
        ) : (
          <span className="flex items-center gap-1">
            <FileUp className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          </span>
        )}
      </motion.button>
    </div>
  );
}
