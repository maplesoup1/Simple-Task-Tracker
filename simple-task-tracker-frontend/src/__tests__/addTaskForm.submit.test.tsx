import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTaskForm from '../components/addTaskForm';

const mockOnAddTask = jest.fn();
const mockOnClose = jest.fn();

describe('AddTaskForm - Submit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call onAddTask and onClose when form is submitted with valid data', async () => {
    render(
      <AddTaskForm
        onAddTask={mockOnAddTask}
        onClose={mockOnClose}
        isOpen={true}
      />
    );

    const titleInput = screen.getByPlaceholderText('Enter task title');
    const descriptionInput = screen.getByPlaceholderText('Enter task description');
    const submitButton = screen.getByText('Add Task');

    await userEvent.type(titleInput, 'New Task');
    await userEvent.type(descriptionInput, 'New Description');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnAddTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
        status: 'TODO',
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
