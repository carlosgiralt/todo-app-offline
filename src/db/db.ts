import Dexie, { Table } from "dexie";
import { monotonicFactory } from "ulid";

const ulid = monotonicFactory()

export interface TodoList {
  id?: string;
  title: string;

}

export interface TodoItem {
  todoListId: string;
  id?: string;
  title: string;
  done?: boolean;
}

export class AppDB extends Dexie {
  todoItems!: Table<TodoItem, string>;
  todoLists!: Table<TodoList, string>;

  constructor() {
    super('todo-app');
    this.version(1).stores({
      todoLists: `id`,
      todoItems: `id, todoListId`,
    })
    this.on('populate', () => this.populate());
  }

  async populate() {
    const todoListId = await db.todoLists.add({ id: ulid(), title: "Today" })
    await db.todoItems.bulkAdd([
      {
        id: ulid(),
        todoListId,
        title: 'Finish ToDo app ofline',
      },
      {
        id: ulid(),
        todoListId,
        title: 'Setup database in another project',
      },
    ])
  }

  async resetDatabase() {
    await db.transaction('rw', 'todoItems', 'todoLists', () => {
      this.todoItems.clear();
      this.todoLists.clear();
      this.populate();
    })
  }

}

export const db = new AppDB();
