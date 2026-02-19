import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalBlob } from '../../backend';
import { toast } from 'sonner';

interface MultiImageUploaderProps {
  images: ExternalBlob[];
  onImagesChange: (images: ExternalBlob[]) => void;
  maxImages?: number;
}

export default function MultiImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleFilesSelect = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      toast.error('Please select image files');
      return;
    }

    if (images.length + imageFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const newBlobs: ExternalBlob[] = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(Math.round(((i + percentage / 100) / imageFiles.length) * 100));
        });

        newBlobs.push(blob);
      }

      onImagesChange([...images, ...newBlobs]);
      toast.success(`${imageFiles.length} image(s) uploaded successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await handleFilesSelect(files);
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    toast.success('Image removed');
  };

  const handleReplace = async (index: number, file: File) => {
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

      const newImages = [...images];
      newImages[index] = blob;
      onImagesChange(newImages);
      toast.success('Image replaced successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to replace image');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
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
      await handleFilesSelect(files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <Card
        className={`border-gold/20 p-6 transition-all ${isDragging ? 'border-gold border-2 bg-gold/5' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            {isDragging ? 'Drop images here' : 'Drag and drop images here'}
          </p>
          <p className="text-xs text-muted-foreground mb-4">or</p>
          <Button
            variant="outline"
            className="border-gold text-gold hover:bg-gold/10"
            onClick={() => document.getElementById('multi-file-input')?.click()}
            disabled={uploading || images.length >= maxImages}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Select Images
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            {images.length} / {maxImages} images
          </p>
        </div>
        <input
          id="multi-file-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
      </Card>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="border-gold/20 overflow-hidden group relative">
              <img
                src={image.getDirectURL()}
                alt={`Image ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleReplace(index, file);
                    };
                    input.click();
                  }}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
