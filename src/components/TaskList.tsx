import { Task } from '@/lib/mockApi';
import { TaskItem } from '@/components/TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddSubtask: (taskId: string, subtaskTitle: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
}

export function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No tasks yet. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggleTask(task.id)}
          onDelete={() => onDeleteTask(task.id)}
          onAddSubtask={(title) => onAddSubtask(task.id, title)}
          onToggleSubtask={(subtaskId) => onToggleSubtask(task.id, subtaskId)}
          onDeleteSubtask={(subtaskId) => onDeleteSubtask(task.id, subtaskId)}
        />
      ))}
    </div>
  );
}
