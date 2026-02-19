import { useState } from 'react';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

interface MediaSlotUploaderProps {
  currentImage?: ExternalBlob;
  onImageChange: (image: ExternalBlob | undefined) => void;
  label: string;
}

export default function MediaSlotUploader({ currentImage, onImageChange, label }: MediaSlotUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      onImageChange(blob);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFileSelect(file);
  };

  const handleRemove = () => {
    onImageChange(undefined);
    toast.success('Image removed');
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileSelect(files[0]);
    }
  };

  return (
    <Card 
      className={`border-gold/20 p-4 transition-all ${isDragging ? 'border-gold border-2 bg-gold/5' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {currentImage ? (
        <div className="space-y-4">
          <img
            src={currentImage.getDirectURL()}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-gold text-gold hover:bg-gold/10"
              onClick={() => document.getElementById(`file-input-${label}`)?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Replace
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            {isDragging ? 'Drop image here' : 'Drag and drop an image here'}
          </p>
          <p className="text-xs text-muted-foreground mb-4">or</p>
          <Button
            variant="outline"
            className="border-gold text-gold hover:bg-gold/10"
            onClick={() => document.getElementById(`file-input-${label}`)?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {label}
              </>
            )}
          </Button>
        </div>
      )}
      <input
        id={`file-input-${label}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </Card>
  );
}
