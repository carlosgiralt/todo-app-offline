import Dexie, { Table } from "dexie";
import { ulid } from "ulid";

export interface Item {
  id?: number;
  _id?: string;
  name: string;
}

export interface TodoList {
  id?: number;
  _id?: string;
  title: string;
}

export interface TodoItem {
  id?: number;
  todoListId: number;
  _id?: string;
  title: string;
  done?: boolean;
}

export class AppDB extends Dexie {
  todoItems!: Table<TodoItem, number>;
  todoLists!: Table<TodoList, number>;

  constructor() {
    super('todo-app');
    this.version(3).stores({
      todoLists: `++id`,
      todoItems: `++id, todoListId`,
    })
    this.on('populate', () => this.populate());
  }

  async populate() {
    const todoListId = await db.todoLists.add({ _id: ulid(), title: "Today" })
    await db.todoItems.bulkAdd([
      {
        todoListId,
        _id: ulid(),
        title: 'Finish ToDo app ofline',
      },
      {
        todoListId,
        _id: ulid(),
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
