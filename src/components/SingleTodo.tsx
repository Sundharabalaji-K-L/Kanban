// src/components/SingleTodo.tsx
import React, { useState, useRef, useEffect } from "react";
import { 
  Draggable 
} from "react-beautiful-dnd";
import { 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  Select,
  TextField,  // Added TextField import
  Button      // Added Button import
} from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import { 
  AiFillEdit, 
  AiFillDelete 
} from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { Task } from "../models/models";

interface SingleTodoProps {
  index: number;
  todo: Task
  todos: Array<Task>;
  setTodos: React.Dispatch<React.SetStateAction<Array<Task>>>;
}

const SingleTodo: React.FC<SingleTodoProps> = ({ 
  index, 
  todo, 
  todos, 
  setTodos 
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodo, setEditTask] = useState<string>(todo.todo);
  const [editOwner, setEditOwner] = useState<string>(todo.owner);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setTodos(
      todos.map((t) => 
        t.id === todo.id 
          ? { ...t, todo: editTodo, owner: editOwner } 
          : t
      )
    );
    setEdit(false);
  };

  const handleDelete = () => {
    setTodos(todos.filter((t) => t.id !== todo.id));
  };


  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card style={{ margin: 8, position: 'relative' }}>
            <CardContent>
              {edit ? (
                <form onSubmit={handleEdit}>
                  <TextField
                    value={editTodo}
                    onChange={(e) => setEditTask(e.target.value)}
                    fullWidth
                    style={{ marginBottom: 16 }}
                    inputRef={inputRef}
                  />
                  <Select
                    value={editOwner}
                    onChange={(e) => setEditOwner(e.target.value as string)}
                    fullWidth
                  >
                    <MenuItem value="John">John</MenuItem>
                    <MenuItem value="Jane">Jane</MenuItem>
                    <MenuItem value="Alice">Alice</MenuItem>
                    <MenuItem value="Bob">Bob</MenuItem>
                  </Select>
                  <Button type="submit" color="primary">Save</Button>
                  <Button onClick={() => setEdit(false)} color="secondary">Cancel</Button>
                </form>
              ) : (
                <>
                  <Typography 
                    variant="h6" 
                    style={{ 
                      textDecoration: 'none' 
                    }}
                  >
                    {todo.todo}
                  </Typography>
                  <Typography variant="subtitle2">
                    Description: {todo.description}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Owner: {todo.owner}
                  </Typography>
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton onClick={handleMenuOpen}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => { setEdit(true); handleMenuClose(); }}>
                        <AiFillEdit style={{ marginRight: 8 }} /> Edit
                      </MenuItem>
                      <MenuItem onClick={() => { handleDelete(); handleMenuClose(); }}>
                        <AiFillDelete style={{ marginRight: 8 }} /> Delete
                      </MenuItem>
                    </Menu>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default SingleTodo;