// src/components/TodoList.tsx
import React from "react";
import { 
  Grid, 
  Paper, 
  Typography 
} from "@material-ui/core";
import { Droppable } from "react-beautiful-dnd";
import { Todo } from "../models/models";
import SingleTodo from "./SingleTodo";

interface props {
  todos: Array<Todo>;
  setTodos: React.Dispatch<React.SetStateAction<Array<Todo>>>;
  droppableId: string;
  title: string;
}

const TodoList: React.FC<props> = ({ 
  todos, 
  setTodos, 
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
              {todos.map((todo, index) => (
                <SingleTodo
                  index={index}
                  todos={todos}
                  todo={todo}
                  key={todo.id}
                  setTodos={setTodos}
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