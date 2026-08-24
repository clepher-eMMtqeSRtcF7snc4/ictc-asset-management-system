import { ImageIcon, Upload, X } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

export default function FileUploadArea({ onFileSelect, className }: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];

    if(file && file.type.startsWith("image/")){
      onFileSelect(file);
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(file && file.type.startsWith("image/")){
      onFileSelect(file);
    }
  };


  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef?.current?.click()}
      className="border-dashed border-2 border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors">

        <Upload className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />

        <p className="text-lg font-medium mb-2">
          Drag photo here
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          or click to select a file from your computer
        </p>

        <Button type="button" variant="outline">
          <ImageIcon className="w-4 h-4 mr-2" />
          Select from your computer
        </Button>

        <Input 
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleFileSelect}
          className='hidden'
        />
      </div>
  );
}