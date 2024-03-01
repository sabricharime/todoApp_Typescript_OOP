/*
 * Simple Todolist  is a minimal tool to manage your daily tasks .
 * Copyright (c) 2024 Sabri Charime
 * type language : typescript
 * scripting language : javascript
 */

type TodoObject = {
  id: string;
  name: string;
};

class TODO {
  main: HTMLElement | null;
  form: HTMLFormElement;
  input: HTMLInputElement;
  submit: HTMLButtonElement;
  items: HTMLElement;
  todos: TodoObject[];
  todosObject: TodoObject | null;
  editFlag: boolean;
  temp: HTMLElement | null;
  htmlInitial: () => this;
  random: null | (() => string);
  htmlafterLoad: () => void;

  // Get Started
  static getID(id: string) {
    return document.getElementById(id);
  }
  static newElement<T>(name: string): T {
    // @ts-ignore
    return document.createElement(name);
  }
  static KEY = "TODOS_KEY";

  // Constructor
  constructor() {
    this.random = null;
    this.main = TODO.getID("mainPage");
    this.form = TODO.newElement<HTMLFormElement>("form");
    this.input = TODO.newElement<HTMLInputElement>("input")!;
    this.submit = TODO.newElement<HTMLButtonElement>("button"!);
    this.items = TODO.newElement<HTMLElement>("div")!;
    this.todos = localStorage.getItem(TODO.KEY)
      ? JSON.parse(localStorage.getItem(TODO.KEY)!)
      : [];
    this.todosObject = null;
    this.editFlag = false;
    this.temp = null;

    this.htmlInitial = function () {
      this.form.id = "mainForm";
      this.submit.type = "submit";
      this.submit.textContent = "submit";
      this.input.placeholder = "eg: eggs , sugar , ...";

      // Elements Appends To form
      this.form.appendChild(this.input);
      this.form.appendChild(this.submit);

      // Initial  actions
      this.form.onsubmit = (e) => {
        e.preventDefault();
        this.input.value.length >= 3 && !this.editFlag
          ? this.add(this.input.value)
          : this.input.value.length >= 3 && this.editFlag
          ? this.edit(this.input.value)
          : alert("The Input Field Most be Not Empty ");
      };

      // Elements Appends to mainPage
      this.main?.appendChild(this.form);
      this.main?.appendChild(this.items);
      return this;
    };

    this.htmlafterLoad = function () {
      this.todos.map((item) => {
        this.items.innerHTML += `
        <div class="item" data-id="${item.id}">
          <p class="content">${item.name}</p>
          <div id="tools">
            <button class="deletebtn">delete</button>
            <button class="edit">edit</button>
          </div>
        </div>`;
        const deleteButtons: NodeListOf<HTMLButtonElement> =
          document.querySelectorAll(".deletebtn");
        const editbutton: NodeListOf<HTMLButtonElement> =
          document.querySelectorAll(".edit");

        deleteButtons.forEach((item) => {
          item.addEventListener("click", (e) => {
            // @ts-ignore
            const current = e.currentTarget.parentElement.parentElement;
            let newArraysOfItem = [];
            for (let item of this.todos) {
              if (item.id !== current.dataset.id) {
                newArraysOfItem.push(item);
              }
            }
            this.todos = newArraysOfItem;
            localStorage.setItem(TODO.KEY, JSON.stringify(this.todos));
            current.remove();
          });
        });
        editbutton.forEach((item) => {
          item.addEventListener("click", (e) => {
            // @ts-ignore
            const current = e.currentTarget.parentElement.parentElement;

            this.temp = current;
            this.editFlag = true;
            this.input.value = current.children[0].textContent;
            this.submit.textContent = "Edit";
          });
        });
      });

      return this;
    };
  }

  add(value: string) {
    this.random = () =>
      Math.abs(~~(Math.random() * new Date().getTime())).toString(16);
    this.todosObject = {
      id: this.random(),
      name: value,
    };
    this.todos.push(this.todosObject);
    localStorage.setItem(TODO.KEY, JSON.stringify(this.todos));
    this.items.innerHTML += `
    <div class="item" data-id="${this.todosObject.id}">
      <p class="content">${todo.todosObject?.name}</p>
      <div id="tools">
        <button class="deletebtn">delete</button>
        <button class="edit">edit</button>
      </div>
    </div>`;
    const deleteButtons: NodeListOf<HTMLButtonElement> =
      document.querySelectorAll(".deletebtn");
    const editbutton: NodeListOf<HTMLButtonElement> =
      document.querySelectorAll(".edit");

    deleteButtons.forEach((item) => {
      item.addEventListener("click", (e) => {
        // @ts-ignore
        const current = e.currentTarget.parentElement.parentElement;
        let newArraysOfItem = [];
        for (let item of this.todos) {
          if (item.id !== current.dataset.id) {
            newArraysOfItem.push(item);
          }
        }

        this.todos = newArraysOfItem;
        localStorage.setItem(TODO.KEY, JSON.stringify(this.todos));
        current.remove();
      });
    });
    editbutton.forEach((item) => {
      item.addEventListener("click", (e) => {
        // @ts-ignore
        const current = e.currentTarget.parentElement.parentElement;

        this.temp = current;
        this.editFlag = true;
        this.input.value = current.children[0].textContent;
        this.submit.textContent = "Edit";
      });
    });

    this.input.value = "";
  }

  edit(value: string) {
    this.temp!.children[0].textContent = value;

    let newArraysOfItem = [];
    for (let item of this.todos) {
      if (this.temp?.dataset.id === item.id) {
        item.name = value;
      }
      newArraysOfItem.push(item);
    }
    localStorage.setItem(TODO.KEY, JSON.stringify(newArraysOfItem));
    this.input.value = "";
    this.editFlag = false;
    this.submit.textContent = "submit";
  }
}

const todo = new TODO();

todo.htmlInitial();
todo.htmlafterLoad();
