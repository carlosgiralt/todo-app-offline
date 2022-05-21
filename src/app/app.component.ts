import { Component } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, TodoList } from 'src/db/db';
import { ulid } from 'ulid';
@Component({
  selector: 'app-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <h1>{{title}}</h1>

    <label>
      New list:
      <input type="text" autocomplete="off" id="list-name" [(ngModel)]="newListName">
    </label>
    <button type="button" (click)="addNewList()">Add</button>
    <button (click)="resetDatabase()">Reset all</button>

    <div *ngFor="let todoList of todoLists$ | async; trackBy: identifyList">
      <app-item-list [todoList]="todoList"></app-item-list>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'ToDo';
  todoLists$ = liveQuery(() => db.todoLists.toArray())

  newListName = ""

  async addNewList() {
    await db.todoLists
      .add({
        id: ulid(),
        title: this.newListName
      })
      .finally(() => this.newListName = "")
  }

  async resetDatabase() {
    if (confirm('Are you sure you want to reset the database?')) {
      await db.resetDatabase()
    }
  }

  identifyList(index: number, list: TodoList) {
    return `${list.id}${list.title}`
  }
}
