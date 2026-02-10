import { AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface GuestMergePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  type: 'cart' | 'wishlist';
  itemCount: number;
}

export default function GuestMergePrompt({ open, onOpenChange, onConfirm, type, itemCount }: GuestMergePromptProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-gold">
            <AlertCircle className="h-5 w-5" />
            Merge {type === 'cart' ? 'Cart' : 'Wishlist'}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You have {itemCount} item{itemCount !== 1 ? 's' : ''} in your guest {type}. 
            Would you like to merge {itemCount !== 1 ? 'them' : 'it'} with your account?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Skip</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-gold hover:bg-gold/90 text-white"
          >
            Merge {type === 'cart' ? 'Cart' : 'Wishlist'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
