import React, { useRef, useState } from 'react';

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
        setPreview('📄'); 
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
        className="min-w-[48px] h-[48px] rounded-xl bg-gray-100 border-2 border-[#F5DEB3] text-gray-600 hover:bg-[#F5DEB3] transition-colors flex items-center justify-center relative overflow-hidden"
        aria-label="Upload document or image"
      >
        {preview ? (
          typeof preview === 'string' && preview.startsWith('data:') ? (
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">{preview}</span>
          )
        ) : (
          <span className="text-2xl">📷</span>
        )}
      </button>
    </div>
  );
}
