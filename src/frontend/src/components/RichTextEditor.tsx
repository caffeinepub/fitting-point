import { useEffect, useRef, useState } from 'react';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className = '' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: LinkIcon, command: 'link', title: 'Insert Link', onClick: insertLink },
  ];

  const isEmpty = !editorRef.current?.textContent?.trim();

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gold/20 bg-muted/30">
        {toolbarButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <Button
              key={btn.command}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => btn.onClick ? btn.onClick() : execCommand(btn.command)}
              title={btn.title}
              className="h-8 w-8 p-0 hover:bg-gold/10 hover:text-gold"
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Editor */}
      <div className="relative">
        {isEmpty && placeholder && (
          <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`min-h-[200px] p-4 outline-none prose prose-sm max-w-none ${
            isFocused ? 'ring-2 ring-gold/20' : ''
          }`}
        />
      </div>
    </Card>
  );
}
