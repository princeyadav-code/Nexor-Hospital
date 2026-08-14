import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Check, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  id?: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: 'square' | 'wide' | 'avatar' | 'banner';
  placeholder?: string;
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  id = 'image-uploader',
  label,
  value,
  onChange,
  aspectRatio = 'avatar',
  placeholder = 'Paste image URL or upload file',
  helperText = 'Recommended: JPG, PNG, WebP up to 5MB',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file format. Please upload JPG, PNG, or WebP.');
      return;
    }

    // Validate size (< 6MB)
    if (file.size > 6 * 1024 * 1024) {
      setError('File size too large. Maximum allowed size is 6MB.');
      return;
    }

    setError(null);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onChange(result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://') && !urlInput.startsWith('data:image/')) {
      setError('Please enter a valid HTTP(S) image URL or Data URL.');
      return;
    }
    setError(null);
    onChange(urlInput.trim());
    setUrlInput('');
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setError(null);
  };

  // Pre-configured curated medical image presets for quick testing
  const samplePresets = [
    { label: 'Male Doctor 1', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80' },
    { label: 'Female Doctor 1', url: 'https://images.unsplash.com/photo-1594824813689-53e7f5eb33da?w=800&auto=format&fit=crop&q=80' },
    { label: 'Male Doctor 2', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=80' },
    { label: 'Female Doctor 2', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80' },
    { label: 'Hospital OT', url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80' },
    { label: 'Cardiology Lab', url: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&auto=format&fit=crop&q=80' }
  ];

  return (
    <div id={id} className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-1 rounded-md transition-colors ${
              activeMode === 'upload' ? 'bg-white text-cyan-700 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-1 rounded-md transition-colors ${
              activeMode === 'url' ? 'bg-white text-cyan-700 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Image Link
          </button>
        </div>
      </div>

      {/* Image Preview & Upload Controls */}
      <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
        {/* Preview Frame */}
        <div className="relative group shrink-0">
          <div
            className={`overflow-hidden rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center ${
              aspectRatio === 'avatar'
                ? 'w-24 h-24 rounded-2xl'
                : aspectRatio === 'wide'
                ? 'w-40 h-24'
                : aspectRatio === 'banner'
                ? 'w-48 h-24'
                : 'w-28 h-28'
            }`}
          >
            {value ? (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-slate-400 text-center">
                <ImageIcon className="w-8 h-8 stroke-1" />
                <span className="text-[10px] mt-1 font-medium">No Image</span>
              </div>
            )}
          </div>

          {value && (
            <button
              type="button"
              onClick={handleRemove}
              title="Remove image"
              className="absolute -top-2 -right-2 p-1.5 bg-rose-600 text-white rounded-full shadow-md hover:bg-rose-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Upload Actions */}
        <div className="flex-1 w-full space-y-2.5">
          {activeMode === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
                id={`${id}-file-input`}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-cyan-500 hover:text-cyan-700 shadow-xs transition-all"
                >
                  <Upload className="w-4 h-4 text-cyan-600" />
                  {value ? 'Replace Photo' : 'Select Photo from Computer'}
                </button>
                {value && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium hover:bg-rose-100 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3.5 py-2 rounded-xl bg-cyan-700 text-white text-xs font-semibold hover:bg-cyan-800 transition-colors shrink-0"
              >
                Apply URL
              </button>
            </div>
          )}

          {/* Quick Presets Picker */}
          <div className="pt-1">
            <div className="text-[11px] font-medium text-slate-500 mb-1.5 flex items-center gap-1">
              <span>Quick Presets:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {samplePresets.slice(0, 4).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(preset.url)}
                  className="px-2 py-1 text-[10px] font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-cyan-500 hover:text-cyan-700 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">{helperText}</p>

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
};
