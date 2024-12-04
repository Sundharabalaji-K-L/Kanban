// src/components/InputField.tsx
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem
} from "@material-ui/core";
import { Todo } from "../models/models";

interface Props {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setDoing: React.Dispatch<React.SetStateAction<Todo[]>>;
  setComplete: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const InputField: React.FC<Props> = ({ 
  setTodos, 
  setDoing, 
  setComplete 
}) => {
  const [open, setOpen] = useState(false);
  const [todo, setTodo] = useState<string>("");
  const [owner, setOwner] = useState<string>("");

  const handleAdd = () => {
    if (todo && owner) {
      const newTodo: Todo = {
        id: Date.now(),
        todo,
        isDone: false,
        owner,
        status: 'todo'
      };
      
      // Always add to todos list by default
      setTodos(prevTodos => [...prevTodos, newTodo]);
      
      setTodo("");
      setOwner("");
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Add Task
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Name"
            fullWidth
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Select
            value={owner}
            onChange={(e) => setOwner(e.target.value as string)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Select Owner
            </MenuItem>
            <MenuItem value="John">John</MenuItem>
            <MenuItem value="Jane">Jane</MenuItem>
            <MenuItem value="Alice">Alice</MenuItem>
            <MenuItem value="Bob">Bob</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InputField;