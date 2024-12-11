import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@material-ui/core";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Task } from "./models/models";
import InputField from "./components/InputField";
import TodoList from "./components/TodoList";
import axios from "axios";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [doing, setDoing] = useState<Task[]>([]);
  const [complete, setComplete] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [ownersMenu, setOwnersMenu] = useState<string[]>([]);

  const updateOwners = useCallback((newTasks: Task[] | Task) => {
    const tasksToAdd = Array.isArray(newTasks) ? newTasks : [newTasks];
    
    const _owners = [
      ...tasks.map(task => task.owner),
      ...doing.map(task => task.owner),
      ...complete.map(task => task.owner),
      ...tasksToAdd.map(task => task.owner)
    ];

    const uniqueOwners = Array.from(new Set(_owners)).sort();
    setOwnersMenu(uniqueOwners);
  }, [tasks, doing, complete]);

  useEffect(() => {
    let isMounted = true;
    axios.get('http://localhost:5555/')
      .then((response) => {
        if (isMounted) {
          const todoTasks = response.data.data.filter((task: Task) => task.status === 'todo');
          const doingTasks = response.data.data.filter((task: Task) => task.status === 'doing');
          const completeTasks = response.data.data.filter((task: Task) => task.status === 'complete');
          
          setTasks(todoTasks);
          setDoing(doingTasks);
          setComplete(completeTasks);

          updateOwners([...todoTasks, ...doingTasks, ...completeTasks]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [updateOwners]);

  const onDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceList =
      source.droppableId === 'todo' ? tasks :
      source.droppableId === 'doing' ? doing : complete;

    const destList =
      destination.droppableId === 'todo' ? tasks :
      destination.droppableId === 'doing' ? doing : complete;

    const setSourceList =
      source.droppableId === 'todo' ? setTasks :
      source.droppableId === 'doing' ? setDoing : setComplete;

    const setDestList =
      destination.droppableId === 'todo' ? setTasks :
      destination.droppableId === 'doing' ? setDoing : setComplete;

    const newSourceList = [...sourceList];
    const [removed] = newSourceList.splice(source.index, 1);

    const newStatus = destination.droppableId as Task['status'];
    const updatedTask = { ...removed, status: newStatus };

    try {
      const response = await axios.put(
        `http://localhost:5555/update/${updatedTask._id}`, 
        updatedTask
      );

      const newDestList = [...destList];
      newDestList.splice(destination.index, 0, updatedTask);

      setSourceList(newSourceList);
      setDestList(newDestList);

      updateOwners([...newSourceList, ...newDestList]);
    } catch (error) {
      console.error('Error updating task status:', error);
      setSourceList(sourceList);
    }
  }, [tasks, doing, complete, updateOwners]);

  const filterTodos = useCallback((todoList: Task[]) => {
    return filter === 'All' 
      ? todoList 
      : todoList.filter(todo => todo.owner === filter);
  }, [filter]);

  const owners: string[] = ['All', ...ownersMenu];

  return (
    <Container>
      <Grid container spacing={0} justify="space-between" alignItems="center" style={{ marginBottom: 16 }}>
        <Grid item>
          <InputField 
            setTodos={setTasks} 
            setDoing={setDoing} 
            setComplete={setComplete} 
            owners={ownersMenu}
            updateOwners={updateOwners}
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
            tasks={filterTodos(tasks)}
            setTasks={setTasks}
            droppableId="todo"
            owners={ownersMenu}
            title="Todo"
          />
          <TodoList
            tasks={filterTodos(doing)}
            setTasks={setDoing}
            droppableId="doing"
            owners={ownersMenu}
            title="Doing"
          />
          <TodoList
            tasks={filterTodos(complete)}
            setTasks={setComplete}
            droppableId="complete"
            owners={ownersMenu}
            title="Complete"
          />
        </Grid>
      </DragDropContext>
    </Container>
  );
};

export default React.memo(App);