// src/App.jsx
import React, { useState } from 'react';
import TaskColumn from './components/TaskColumn';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { getAiTaskSuggestion } from './utils/openai';

const App = () => {
  const [tasks, setTasks] = useState({
    todo: [
      { id: 'todo-1', content: 'Plan wireframe layout' },
      { id: 'todo-2', content: 'Setup project environment' },
    ],
    'in-progress': [
      { id: 'in-progress-1', content: 'Implement drag-and-drop' },
    ],
    done: [
      { id: 'done-1', content: 'Install dependencies' },
    ],
  });

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    const sourceColumn = Object.keys(tasks).find((column) =>
      tasks[column].some((task) => task.id === activeId)
    );
    const targetColumn = Object.keys(tasks).find((column) =>
      tasks[column].some((task) => task.id === overId)
    );

    if (!sourceColumn || !targetColumn) return;

    if (sourceColumn === targetColumn) {
      const oldIndex = tasks[sourceColumn].findIndex((task) => task.id === activeId);
      const newIndex = tasks[targetColumn].findIndex((task) => task.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        setTasks((prev) => ({
          ...prev,
          [sourceColumn]: arrayMove(prev[sourceColumn], oldIndex, newIndex),
        }));
      }
      return;
    }

    const draggedTask = tasks[sourceColumn].find((task) => task.id === activeId);
    setTasks((prev) => {
      const newSource = prev[sourceColumn].filter((task) => task.id !== activeId);
      const newTarget = [...prev[targetColumn], draggedTask];

      return {
        ...prev,
        [sourceColumn]: newSource,
        [targetColumn]: newTarget,
      };
    });
  };

  const addTask = (columnId, content) => {
    const newTask = {
      id: `${columnId}-${Date.now()}`,
      content,
    };
    setTasks((prev) => ({
      ...prev,
      [columnId]: [...prev[columnId], newTask],
    }));
  };

  const addAiTask = async () => {
    const suggestion = await getAiTaskSuggestion();
    addTask('todo', suggestion);
  };

  const deleteTask = (columnId, taskId) => {
    setTasks((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((task) => task.id !== taskId),
    }));
  };

  const editTask = (columnId, taskId, newContent) => {
    setTasks((prev) => ({
      ...prev,
      [columnId]: prev[columnId].map((task) =>
        task.id === taskId ? { ...task, content: newContent } : task
      ),
    }));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center mb-6 font-orbitron text-[#26547c]">
          🧠 AI Task Planner
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <SortableContext
              key={column.id}
              items={tasks[column.id].map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <TaskColumn
                id={column.id}
                title={column.title}
                tasks={tasks[column.id]}
                addTask={addTask}
                deleteTask={deleteTask}
                editTask={editTask}
              />
            </SortableContext>
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default App;