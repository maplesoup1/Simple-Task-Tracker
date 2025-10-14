import React from 'react';
import { render, screen } from '@testing-library/react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import TaskCard from '../components/taskCard';
import PopupProvider from '../components/popupProvider';
import { Task } from '../components/types';

jest.mock('../components/popupProvider', () => ({
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
