import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockGroupsApi, mockTasksApi, TaskGroup, Task } from '@/lib/mockApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Plus, CheckSquare } from 'lucide-react';
import { GroupList } from '@/components/GroupList';
import { TaskList } from '@/components/TaskList';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { CreateGroupDialog } from '@/components/CreateGroupDialog';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<TaskGroup[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [groupsData, tasksData] = await Promise.all([
        mockGroupsApi.getAll(user.id),
        mockTasksApi.getAll(user.id),
      ]);
      setGroups(groupsData);
      setTasks(tasksData);
      if (groupsData.length > 0 && !selectedGroupId) {
        setSelectedGroupId(groupsData[0].id);
      }
    } catch (error) {
      toast({
        title: 'Error loading data',
        description: 'Failed to load your tasks and groups',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleCreateGroup = async (name: string) => {
    if (!user) return;
    try {
      const newGroup = await mockGroupsApi.create(name, user.id);
      setGroups([...groups, newGroup]);
      setSelectedGroupId(newGroup.id);
      toast({ title: 'Group created', description: `"${name}" has been created` });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create group',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await mockGroupsApi.delete(groupId);
      setGroups(groups.filter((g) => g.id !== groupId));
      setTasks(tasks.filter((t) => t.groupId !== groupId));
      if (selectedGroupId === groupId) {
        setSelectedGroupId(groups[0]?.id || null);
      }
      toast({ title: 'Group deleted' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete group',
        variant: 'destructive',
      });
    }
  };

  const handleCreateTask = async (task: Omit<Task, 'id'>) => {
    try {
      const newTask = await mockTasksApi.create(task);
      setTasks([...tasks, newTask]);
      toast({ title: 'Task created' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const updatedTask = await mockTasksApi.toggleComplete(taskId);
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await mockTasksApi.delete(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      toast({ title: 'Task deleted' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    }
  };

  const handleAddSubtask = async (taskId: string, subtaskTitle: string) => {
    try {
      const updatedTask = await mockTasksApi.addSubtask(taskId, subtaskTitle);
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add subtask',
        variant: 'destructive',
      });
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    try {
      const updatedTask = await mockTasksApi.toggleSubtask(taskId, subtaskId);
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update subtask',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSubtask = async (taskId: string, subtaskId: string) => {
    try {
      const updatedTask = await mockTasksApi.deleteSubtask(taskId, subtaskId);
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete subtask',
        variant: 'destructive',
      });
    }
  };

  const filteredTasks = selectedGroupId
    ? tasks.filter((t) => t.groupId === selectedGroupId)
    : [];

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <CheckSquare className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">TaskFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar - Groups */}
          <div className="md:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Lists</h2>
              <CreateGroupDialog onCreateGroup={handleCreateGroup} />
            </div>
            <GroupList
              groups={groups}
              selectedGroupId={selectedGroupId}
              onSelectGroup={setSelectedGroupId}
              onDeleteGroup={handleDeleteGroup}
            />
          </div>

          {/* Main Content - Tasks */}
          <div className="md:col-span-3">
            {selectedGroup ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
                  <CreateTaskDialog
                    groupId={selectedGroupId!}
                    onCreateTask={handleCreateTask}
                  />
                </div>
                <TaskList
                  tasks={filteredTasks}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  onAddSubtask={handleAddSubtask}
                  onToggleSubtask={handleToggleSubtask}
                  onDeleteSubtask={handleDeleteSubtask}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No list selected</p>
                <CreateGroupDialog onCreateGroup={handleCreateGroup} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
