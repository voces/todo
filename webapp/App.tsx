import { h, Fragment, useState, useRef } from "./deps.ts";

export const App = () => {
  const [todos, setTodos] = useState<{ todo: string; done: boolean }[]>([
    { todo: "Foo", done: false },
    { todo: "Bar", done: false },
    { todo: "Baz", done: true },
  ]);
  const inputRef = useRef<HTMLInputElement>();

  return (
    <>
      <header style={{ fontSize: "125%" }}>
        <span style={{ fontStyle: "italic" }}>todo</span>
      </header>
      <div style={{ width: "100%", maxWidth: 512, margin: "0 auto" }}>
        <div>
          {todos
            .sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0))
            .map((todo, i) => (
              <label key={i} style={{ display: "flex" }}>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() =>
                    setTodos([
                      ...todos.slice(0, i),
                      { ...todo, done: !todo.done },
                      ...todos.slice(i + 1),
                    ])
                  }
                />
                <span
                  style={{
                    textDecoration: todo.done ? "line-through" : undefined,
                  }}
                >
                  {todo.todo}
                </span>
              </label>
            ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const todo = inputRef.current.value.trim();
            if (todo.length > 0)
              setTodos([
                ...todos,
                { todo: inputRef.current.value, done: false },
              ]);
            inputRef.current.value = "";
          }}
          style={{ textAlign: "right" }}
        >
          <input ref={inputRef} placeholder="Create an actual app"></input>
          <button type="submit">Add</button>
        </form>
      </div>
    </>
  );
};
