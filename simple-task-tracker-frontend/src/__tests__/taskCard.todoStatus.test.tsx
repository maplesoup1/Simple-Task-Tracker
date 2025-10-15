import React from 'react';
import { render, screen } from '@testing-library/react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import TaskCard from '../components/task/TaskCard';
import PopupProvider from '../components/modal/PopupProvider';
import { Task } from '../types';

jest.mock('../components/modal/PopupProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  usePopup: () => ({
    confirm: jest.fn().mockResolvedValue(true),
  }),
}));

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  status: 'TODO',
};

describe('TaskCard - TODO Status', () => {
  it('should apply pink colors for TODO status', () => {
    render(
      <PopupProvider>
        <DragDropContext onDragEnd={() => {}}>
          <Droppable droppableId="test">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <TaskCard
                  task={mockTask}
                  index={0}
                  onDelete={jest.fn()}
                  onTaskClick={jest.fn()}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </PopupProvider>
    );

    const badge = screen.getByText('Test Task');
    expect(badge).toHaveClass('bg-pink-200', 'text-pink-800');
  });
});
