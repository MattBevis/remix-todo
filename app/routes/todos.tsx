import type { ActionArgs, DataFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Form, redirect } from "react-router-dom";
import { prisma } from "~/db.server";
import { getUserId } from "~/session.server";

export async function loader({ request }: DataFunctionArgs) {
  const userId = await getUserId(request);
  if (!userId) return redirect("/login");

  return json({
    todos: await prisma.todo.findMany({
      where: { userId: userId },
      select: {
        id: true,
        title: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create":
      console.log("create");
      return { success: true };
  }

  return { success: true };
}

export default function TodosRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="mb-4 text-lg font-medium">My Todo List</h1>
      <Form method="post">
        <input className="p-1 border rounded" type="text" name="title" />
        <button
          className="p-1 rounded border-emerald-600 bg-emerald-500"
          value="create"
          name="intent"
          type="submit"
        >
          Add Todo
        </button>
      </Form>
      <ul className="list-none">
        {data.todos.map((todo) => (
          <li key={todo.id} className="flex items-center mb-4">
            <input
              checked={todo.completed}
              disabled={todo.completed}
              type="checkbox"
              className="w-6 h-6 text-indigo-600 transition duration-150 ease-in-out form-checkbox"
              id={todo.id}
            />
            <label for="todo-1" className="ml-3">
              <span className="block font-medium text-gray-700 ">
                {todo.title}
              </span>
            </label>
          </li>
        ))}
        {/* <li className="flex items-center mb-4">
          <input
            type="checkbox"
            className="w-6 h-6 text-indigo-600 transition duration-150 ease-in-out form-checkbox"
            id="todo-2"
          />
          <label for="todo-2" className="ml-3">
            <span className="block font-medium text-gray-700">
              Buy groceries
            </span>
          </label>
        </li>
        <li className="flex items-center mb-4">
          <input
            type="checkbox"
            className="w-6 h-6 text-indigo-600 transition duration-150 ease-in-out form-checkbox"
            id="todo-3"
          />
          <label for="todo-3" className="ml-3">
            <span className="block font-medium text-gray-700">Wash dishes</span>
          </label>
        </li> */}
      </ul>
      {/* <div className="flex justify-evenly">
        <button type="submit">Add</button>
        <button type="submit">Delete</button>
        <button type="submit">Delete all completed</button>
      </div> */}
    </div>
  );
}
