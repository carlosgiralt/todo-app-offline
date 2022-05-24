import { Component } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, TodoList } from 'src/db/db';
import { ulid } from 'ulid';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
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

  async removeList(list: TodoList) {
    if (list.id) {
      db.todoLists.delete(list.id)
    }
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
