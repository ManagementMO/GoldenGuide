import React, { useRef, useState } from 'react';
import { FileUp, Image as ImageIcon } from 'lucide-react';

export default function DocumentUpload({ onUpload }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
          // Auto-clear preview after a short delay or just keep it until next upload
          setTimeout(() => setPreview(null), 3000); 
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs/docs, just show a generic icon or name
        setPreview('DOC');
        setTimeout(() => setPreview(null), 3000);
      }
      
      onUpload(file);
      
      // Reset input so same file can be selected again if needed
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
      <button
        onClick={handleClick}
        className="relative flex min-h-[52px] min-w-[52px] items-center justify-center overflow-hidden rounded-2xl border border-[#CBD5E1] bg-white text-[#334155] transition-colors hover:bg-[#F8FAFC]"
        aria-label="Upload document or image"
      >
        {preview ? (
          typeof preview === 'string' && preview.startsWith('data:') ? (
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-base font-semibold">{preview}</span>
          )
        ) : (
          <span className="flex items-center gap-1">
            <FileUp className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          </span>
        )}
      </button>
    </div>
  );
}
