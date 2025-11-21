import { TaskGroup } from '@/lib/mockApi';
import { Button } from '@/components/ui/button';
import { Trash2, List } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface GroupListProps {
  groups: TaskGroup[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
}

export function GroupList({
  groups,
  selectedGroupId,
  onSelectGroup,
  onDeleteGroup,
}: GroupListProps) {
  return (
    <div className="space-y-1">
      {groups.map((group) => (
        <div
          key={group.id}
          className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer group ${
            selectedGroupId === group.id
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'hover:bg-secondary'
          }`}
          onClick={() => onSelectGroup(group.id)}
        >
          <div className="flex items-center gap-2 flex-1">
            <List className="h-4 w-4" />
            <span className="font-medium">{group.name}</span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                  selectedGroupId === group.id ? 'hover:bg-primary-foreground/20' : ''
                }`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete "{group.name}"?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this list and all its tasks. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeleteGroup(group.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}
