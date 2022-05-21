import { Component, Input, OnInit } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, TodoItem, TodoList } from 'src/db/db';
import { ulid } from 'ulid';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styles: []
})
export class ItemListComponent implements OnInit {
  @Input() todoList?: TodoList;

  todoItems$ = liveQuery(() => this.listTodoItems());
  newItemName = ''

  constructor() { }

  ngOnInit() { }

  async listTodoItems() {
    return await db.todoItems
      .where({
        todoListId: this.todoList?.id
      })
      .toArray()
  }

  async addNewItem() {
    if (this.todoList?.id) {
      await db.todoItems
        .add({
          id: ulid(),
          todoListId: this.todoList.id,
          title: this.newItemName,
        })
        .finally(() => this.newItemName = "")
    }
  }

  async markAsDone(item: TodoItem) {
    await db.todoItems.update(item, { done: !item?.done })
  }

  async removeItem(item: TodoItem) {
    if (item?.id) {
      if (window.confirm(`You will remove "${item.title}". Are yoy sure?`)) {
        await db.todoItems.delete(item.id)
      }
    }
  }
}
