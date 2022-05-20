import { Component, Input, OnInit } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, TodoList } from 'src/db/db';
import { ulid } from 'ulid';

@Component({
  selector: 'app-item-list',
  template: `
   <h3>{{ todoList?.title }}</h3>

   <label>
     Add item:
     <input type="text" autocomplete="off" [(ngModel)]="newItemName">
     <button type="button" (click)="addNewItem()">Add</button>

   </label>

   <ul>
     <li *ngFor="let item of todoItems$ | async">{{ item.title }}</li>
   </ul>
  `,
  styles: []
})
export class ItemListComponent implements OnInit {
  @Input() todoList?: TodoList;

  todoItems$ = liveQuery(() => this.listTodoItems());
  newItemName = ''

  constructor() { }

  ngOnInit() {
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
          todoListId: this.todoList.id,
          _id: ulid(),
          title: this.newItemName,
        })
        .finally(() => this.newItemName = "")
    }
  }
}
