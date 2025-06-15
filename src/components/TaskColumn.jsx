// src/components/TaskColumn.jsx
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskItem from './TaskItem';

const TaskColumn = ({ id, title, tasks, addTask, deleteTask, editTask }) => {
  const { setNodeRef } = useDroppable({ id });
  const [inputValue, setInputValue] = useState('');

  const handleAddTask = () => {
    if (inputValue.trim() !== '') {
      addTask(id, inputValue);
      setInputValue('');
    }
  };

  return (
    <div ref={setNodeRef} className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-[#26547c]">{title}</h2>
      <div className="space-y-4 mb-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            id={task.id}
            content={task.content}
            columnId={id}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="New task..."
          className="flex-1 px-2 py-1 border rounded text-sm"
        />
        <button
          onClick={handleAddTask}
          className="bg-[#06d6a0] text-white px-3 py-1 rounded text-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default TaskColumn;