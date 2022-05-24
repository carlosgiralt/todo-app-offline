import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() OnRemove = new EventEmitter()

  todoItems$ = liveQuery(() => this.listTodoItems());
  newItemName = ''
  itemsCount: number = 0

  constructor() { }

  ngOnInit() {
    this.todoItems$.subscribe(items => this.itemsCount = items.length)
  }

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
      if (confirm(`You will remove "${item.title}". Are yoy sure?`)) {
        await db.todoItems.delete(item.id)
      }
    }
  }

  removeTodoList() {
    if (confirm(`You will remove "${this.todoList?.title}" list. Are you sure?`)) {
      this.OnRemove.emit()
    }
  }
}
