// src/components/TaskItem.jsx
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Pencil, GripVertical } from 'lucide-react';

const TaskItem = ({ id, content, columnId, deleteTask, editTask }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);

  const handleSave = () => {
    if (editValue.trim()) {
      editTask(columnId, id, editValue);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="p-3 rounded-md shadow bg-[#ffd166] text-[#26547c] relative flex items-start justify-between gap-2 transition-transform"
    >
      {/* Drag Handle Only */}
      <span
        {...listeners}
        className="cursor-grab pt-1"
        title="Drag"
      >
        <GripVertical size={18} />
      </span>

      <div className="flex-1">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 text-sm px-2 py-1 border border-[#26547c] rounded"
            />
            <button
              onClick={handleSave}
              className="text-sm bg-[#06d6a0] text-white px-2 py-1 rounded"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{content}</span>
            <div className="flex gap-2 items-center pl-3">
              <Pencil size={16} className="cursor-pointer" onClick={() => setIsEditing(true)} />
              <Trash2
                size={16}
                className="cursor-pointer text-red-600"
                onClick={() => deleteTask(columnId, id)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
