import React, { useState } from "react";
import {
  Container,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@material-ui/core";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Todo } from "./models/models";
import InputField from "./components/InputField";
import TodoList from "./components/TodoList";

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [doing, setDoing] = useState<Todo[]>([]);
  const [complete, setComplete] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>('All');

  const owners = ['All', 'John', 'Jane', 'Alice', 'Bob'];

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    // Determine source and destination lists
    const sourceList =
      source.droppableId === 'todo' ? todos :
      source.droppableId === 'doing' ? doing : complete;

    const destList =
      destination.droppableId === 'todo' ? todos :
      destination.droppableId === 'doing' ? doing : complete;

    const setSourceList =
      source.droppableId === 'todo' ? setTodos :
      source.droppableId === 'doing' ? setDoing : setComplete;

    const setDestList =
      destination.droppableId === 'todo' ? setTodos :
      destination.droppableId === 'doing' ? setDoing : setComplete;

    // Remove from source list
    const [removed] = sourceList.splice(source.index, 1);

    // Update status
    removed.status = destination.droppableId as Todo['status'];

    // Add to destination list
    destList.splice(destination.index, 0, removed);

    // Update state
    setSourceList([...sourceList]);
    setDestList([...destList]);
  };

  // Filter function for todos
  const filterTodos = (todoList: Todo[]) => {
    return filter === 'All' 
      ? todoList 
      : todoList.filter(todo => todo.owner === filter);
  };

  return (
    <Container>
      <Grid container spacing={0} justify="space-between" alignItems="center" style={{ marginBottom: 16 }}>
        <Grid item>
          <InputField 
            setTodos={setTodos} 
            setDoing={setDoing} 
            setComplete={setComplete} 
          />
        </Grid>
        <Grid item>
          <FormControl variant="outlined" style={{ minWidth: 120 }}>
            <InputLabel htmlFor="owner-filter"></InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as string)}
              inputProps={{
                name: 'owner',
                id: 'owner-filter',
              }}
            >
              {owners.map(owner => (
                <MenuItem key={owner} value={owner}>
                  {owner}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={3}>
          <TodoList
            todos={filterTodos(todos)}
            setTodos={setTodos}
            droppableId="todo"
            title="Todo"
          />
          <TodoList
            todos={filterTodos(doing)}
            setTodos={setDoing}
            droppableId="doing"
            title="Doing"
          />
          <TodoList
            todos={filterTodos(complete)}
            setTodos={setComplete}
            droppableId="complete"
            title="Complete"
          />
        </Grid>
      </DragDropContext>
    </Container>
  );
};

export default App;