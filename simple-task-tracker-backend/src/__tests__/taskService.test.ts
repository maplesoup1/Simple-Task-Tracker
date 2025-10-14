import { TaskStatus } from '@prisma/client';

const mockPrismaClient = {
  task: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
  $transaction: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  TaskStatus: {
    TODO: 'TODO',
    INPROGRESS: 'INPROGRESS',
    DONE: 'DONE',
  },
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

import * as taskService from '../services/taskService';

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Create a new task
  describe('createTask', () => {
    it('should create a task with TODO status', async () => {
      const mockTask = {
        id: 1,
        userId: 'user123',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        position: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.task.create.mockResolvedValue(mockTask);

      const result = await taskService.createTask('user123', 'Test Task', 'Test Description');

      expect(mockPrismaClient.task.create).toHaveBeenCalledWith({
        data: {
          userId: 'user123',
          title: 'Test Task',
          description: 'Test Description',
          status: TaskStatus.TODO,
        },
      });
      expect(result).toEqual(mockTask);
    });
  });

  // Test 2: Edit task
  describe('editTask', () => {
    it('should update task title and description', async () => {
      const mockUpdatedTask = {
        id: 1,
        userId: 'user123',
        title: 'Updated Title',
        description: 'Updated Description',
        status: TaskStatus.TODO,
        position: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.task.update.mockResolvedValue(mockUpdatedTask);

      const result = await taskService.editTask(1, {
        title: 'Updated Title',
        description: 'Updated Description',
      });

      expect(mockPrismaClient.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'Updated Title', description: 'Updated Description' },
      });
      expect(result).toEqual(mockUpdatedTask);
    });
  });

  // Test 3: Change task status
  describe('changeTaskStatus', () => {
    it('should change task status to INPROGRESS', async () => {
      const mockTask = {
        id: 1,
        userId: 'user123',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.INPROGRESS,
        position: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.task.update.mockResolvedValue(mockTask);

      const result = await taskService.changeTaskStatus(1, TaskStatus.INPROGRESS);

      expect(mockPrismaClient.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: TaskStatus.INPROGRESS },
      });
      expect(result.status).toBe(TaskStatus.INPROGRESS);
    });
  });

  // Test 4: Delete task
  describe('deleteTask', () => {
    it('should delete a task by id', async () => {
      const mockDeletedTask = {
        id: 1,
        userId: 'user123',
        title: 'Deleted Task',
        description: 'To be deleted',
        status: TaskStatus.TODO,
        position: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.task.delete.mockResolvedValue(mockDeletedTask);

      const result = await taskService.deleteTask(1);

      expect(mockPrismaClient.task.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockDeletedTask);
    });
  });

  // Test 5: Get task by id with authorization check
  describe('getTaskById', () => {
    it('should return task if user is authorized', async () => {
      const mockTask = {
        id: 1,
        userId: 'user123',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        position: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.task.findUnique.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1, 'user123');

      expect(mockPrismaClient.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockTask);
    });

    it('should return null if user is not authorized', async () => {
      const mockTask = {
        id: 1,
        userId: 'user123',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        position: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.task.findUnique.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1, 'wrongUser');

      expect(result).toBeNull();
    });
  });
});
