import { useState } from 'react';
import { GripVertical, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ExternalBlob } from '../../backend';

interface ImageItem {
  id: string;
  image: ExternalBlob;
  order: number;
}

interface DraggableImageListProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  onRemove?: (id: string) => void;
  showNumberedControls?: boolean;
}

export default function DraggableImageList({
  images,
  onChange,
  onRemove,
  showNumberedControls = false,
}: DraggableImageListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);

    // Update order numbers
    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      order: idx,
    }));

    onChange(reorderedImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleOrderChange = (index: number, newOrder: string) => {
    const orderNum = parseInt(newOrder, 10);
    if (isNaN(orderNum) || orderNum < 1 || orderNum > images.length) {
      return;
    }

    const targetIndex = orderNum - 1;
    if (targetIndex === index) return;

    const newImages = [...images];
    const [movedItem] = newImages.splice(index, 1);
    newImages.splice(targetIndex, 0, movedItem);

    // Update order numbers
    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      order: idx,
    }));

    onChange(reorderedImages);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border border-dashed border-gold/20 rounded-lg">
        No images added yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {images.map((item, index) => (
        <Card
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`p-3 cursor-move transition-all ${
            draggedIndex === index ? 'opacity-50' : ''
          } ${
            dragOverIndex === index ? 'border-gold border-2' : 'border-gold/20'
          }`}
        >
          <div className="flex items-center gap-3">
            <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            
            {showNumberedControls && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max={images.length}
                  value={index + 1}
                  onChange={(e) => handleOrderChange(index, e.target.value)}
                  className="w-16 h-8 text-center"
                />
              </div>
            )}

            <img
              src={item.image.getDirectURL()}
              alt={`Image ${index + 1}`}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Image {index + 1}</p>
              <p className="text-xs text-muted-foreground">
                Drag to reorder {showNumberedControls && 'or enter position number'}
              </p>
            </div>

            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
