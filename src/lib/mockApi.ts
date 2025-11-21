// Mock API for task management
// In production, this would connect to a real backend

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  subtasks: Subtask[];
  groupId: string;
}

export interface TaskGroup {
  id: string;
  name: string;
  userId: string;
}

// Mock storage
let mockUser: User | null = null;
let mockGroups: TaskGroup[] = [];
let mockTasks: Task[] = [];

// Initialize with demo data
const initializeMockData = (userId: string) => {
  mockGroups = [
    { id: '1', name: 'Personal', userId },
    { id: '2', name: 'Work', userId },
  ];

  mockTasks = [
    {
      id: '1',
      title: 'Complete project proposal',
      completed: false,
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      groupId: '2',
      subtasks: [
        { id: '1-1', title: 'Research competitors', completed: true },
        { id: '1-2', title: 'Write executive summary', completed: false },
      ],
    },
    {
      id: '2',
      title: 'Buy groceries',
      completed: false,
      groupId: '1',
      subtasks: [],
    },
  ];
};

// Auth API
export const mockAuthApi = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password.length < 6) {
      throw new Error('Invalid credentials');
    }

    const user: User = {
      id: 'user-' + email.split('@')[0],
      email,
      name: email.split('@')[0],
    };

    mockUser = user;
    initializeMockData(user.id);

    return {
      user,
      token: 'mock-jwt-token-' + user.id,
    };
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockUser = null;
  },

  getCurrentUser: async (token: string): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockUser;
  },
};

// Task Groups API
export const mockGroupsApi = {
  getAll: async (userId: string): Promise<TaskGroup[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockGroups.filter((g) => g.userId === userId);
  },

  create: async (name: string, userId: string): Promise<TaskGroup> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const group: TaskGroup = {
      id: Date.now().toString(),
      name,
      userId,
    };
    mockGroups.push(group);
    return group;
  },

  update: async (id: string, name: string): Promise<TaskGroup> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const group = mockGroups.find((g) => g.id === id);
    if (!group) throw new Error('Group not found');
    group.name = name;
    return group;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockGroups = mockGroups.filter((g) => g.id !== id);
    mockTasks = mockTasks.filter((t) => t.groupId !== id);
  },
};

// Tasks API
export const mockTasksApi = {
  getAll: async (userId: string): Promise<Task[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const userGroups = mockGroups.filter((g) => g.userId === userId).map((g) => g.id);
    return mockTasks.filter((t) => userGroups.includes(t.groupId));
  },

  create: async (task: Omit<Task, 'id'>): Promise<Task> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    mockTasks.push(newTask);
    return newTask;
  },

  update: async (id: string, updates: Partial<Task>): Promise<Task> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const taskIndex = mockTasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) throw new Error('Task not found');
    mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates };
    return mockTasks[taskIndex];
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockTasks = mockTasks.filter((t) => t.id !== id);
  },

  toggleComplete: async (id: string): Promise<Task> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const task = mockTasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');
    task.completed = !task.completed;
    return task;
  },

  addSubtask: async (taskId: string, subtaskTitle: string): Promise<Task> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const task = mockTasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    const subtask: Subtask = {
      id: Date.now().toString(),
      title: subtaskTitle,
      completed: false,
    };
    task.subtasks.push(subtask);
    return task;
  },

  toggleSubtask: async (taskId: string, subtaskId: string): Promise<Task> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const task = mockTasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    const subtask = task.subtasks.find((s) => s.id === subtaskId);
    if (!subtask) throw new Error('Subtask not found');
    subtask.completed = !subtask.completed;
    return task;
  },

  deleteSubtask: async (taskId: string, subtaskId: string): Promise<Task> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const task = mockTasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.subtasks = task.subtasks.filter((s) => s.id !== subtaskId);
    return task;
  },
};
