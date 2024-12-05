// src/components/TodoList.tsx
import React from "react";
import { 
  Grid, 
  Paper, 
  Typography 
} from "@material-ui/core";
import { Droppable } from "react-beautiful-dnd";
import { Task } from "../models/models";
import SingleTodo from "./SingleTodo";

interface props {
  tasks: Array<Task>;
  setTasks: React.Dispatch<React.SetStateAction<Array<Task>>>;
  droppableId: string;
  title: string;
}

const TodoList: React.FC<props> = ({ 
  tasks, 
  setTasks, 
  droppableId, 
  title 
}) => {
  return (
    <Grid item xs={12} md={4}>
      <Paper style={{ padding: 16, minHeight: 500 }}>
        <Typography variant="h5" style={{ marginBottom: 16 }}>
          {title}
        </Typography>

        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                background: snapshot.isDraggingOver 
                  ? 'lightblue' 
                  : 'lightgrey',
                padding: 8,
                minHeight: 400
              }}
            >
              {tasks.map((task, index) => (
                <SingleTodo
                  index={index}
                  todos={tasks}
                  todo={task}
                  key={task.id}
                  setTodos={setTasks}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Paper>
    </Grid>
  );
};

export default TodoList;