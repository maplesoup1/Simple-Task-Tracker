import React from 'react';
import { render, screen } from '@testing-library/react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import TaskCard from '../components/taskCard';
import PopupProvider from '../components/popupProvider';
import { Task } from '../types';

jest.mock('../components/popupProvider', () => ({
  ...jest.requireActual('../components/popupProvider'),
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

describe('TaskCard - Render', () => {
  it('should render task title and description', () => {
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

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
