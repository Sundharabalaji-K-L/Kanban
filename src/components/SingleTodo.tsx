import React, { useState, useRef, useEffect, memo } from "react";
import { Draggable } from "react-beautiful-dnd";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { Task } from "../models/models";

interface SingleTodoProps {
  index: number;
  todo: Task;
  owners: Array<string>;
  todos: Array<Task>;
  setTodos: React.Dispatch<React.SetStateAction<Array<Task>>>;
}

const SingleTodo: React.FC<SingleTodoProps> = memo(({
  index,
  todo,
  owners,
  todos,
  setTodos,
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodo, setEditTask] = useState<string>(todo.todo);
  const [editDescription, setEditDescription] = useState<string>(
    todo.description || ""
  );
  const [editOwner, setEditOwner] = useState<string>(todo.owner);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTask = {
      ...todo,
      todo: editTodo,
      description: editDescription,
      owner: editOwner,
    };

    try {
      const response = await axios.put(
        `http://localhost:5555/update/${todo._id}`,
        updatedTask
      );

      const updatedData = response.data;

      setTodos((prevTodos) =>
        prevTodos.map((t) => (t._id === todo._id ? updatedData : t))
      );

      setEdit(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5555/delete/${todo._id}`);

      setTodos((prevTodos) => prevTodos.filter((t) => t._id !== todo._id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Draggable draggableId={todo._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card style={{ margin: 8, position: "relative" }}>
            <CardContent>
              {edit ? (
                <form onSubmit={handleEdit}>
                  <TextField
                    label="Task"
                    value={editTodo}
                    onChange={(e) => setEditTask(e.target.value)}
                    fullWidth
                    style={{ marginBottom: 16 }}
                    inputRef={inputRef}
                  />
                  <TextField
                    label="Description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    fullWidth
                    style={{ marginBottom: 16 }}
                  />
                  <Select
                    label="Owner"
                    value={editOwner}
                    onChange={(e) => setEditOwner(e.target.value as string)}
                    fullWidth
                    style={{ marginBottom: 16 }}
                  >
                    {owners.map((owner) => (
                      <MenuItem key={owner} value={owner}>
                        {owner}
                      </MenuItem>
                    ))}
                  </Select>
                  <div>
                    <Button type="submit" color="primary" variant="contained">
                      Save
                    </Button>
                    <Button
                      onClick={() => setEdit(false)}
                      color="secondary"
                      variant="outlined"
                      style={{ marginLeft: 8 }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <Typography variant="h6">{todo.todo}</Typography>
                  <Typography variant="subtitle2">
                    Description: {todo.description}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Owner: {todo.owner}
                  </Typography>
                  <div style={{ position: "absolute", top: 8, right: 8 }}>
                    <IconButton onClick={handleMenuOpen}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        onClick={() => {
                          setEdit(true);
                          handleMenuClose();
                        }}
                      >
                        <AiFillEdit style={{ marginRight: 8 }} /> Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleDelete();
                          handleMenuClose();
                        }}
                      >
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
});

export default SingleTodo;