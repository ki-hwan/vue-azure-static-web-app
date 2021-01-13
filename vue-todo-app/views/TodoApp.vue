<template>
  <div calss="toto-app">
    <div class="todo-app__actions">
      <div class="filters">
        <button
          :class="{ active: filter === 'all' }"
          @click="changeFilter('all')"
        >
          모든항목 ({{ total }})
        </button>
        <button
          :class="{ active: filter === 'active' }"
          @click="changeFilter('active')"
        >
          해야 할 항목 ({{ activeCount }})
        </button>
        <button
          :class="{ active: filter === 'completed' }"
          @click="changeFilter('completed')"
        >
          완료된 항목 ({{ completedCount }})
        </button>
      </div>

      <div class="actions">
        <input type="checkbox" v-model="allDone" />
        <button @click="clearCompleted">
          <i class="material-icons">delete_sweep</i>
        </button>
      </div>
    </div>

    <div class="todo-app__list">
      <todo-item
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @update-todo="updateTodo"
        @delete-todo="deleteTodo"
      ></todo-item>
    </div>
    <hr />
    <todo-creator
      class="todo-app_creator"
      @create-todo="createTodo"
    ></todo-creator>
  </div>
</template>
<script>
import lowdb from "lowdb";
import localStroage from "lowdb/adapters/LocalStorage";
//import cryptoRandomString from 'crypto-random-string'
import _cloneDeep from "lodash/cloneDeep";
import _find from "lodash/find";
import _assign from "lodash/assign";
import _findIndex from "lodash/findIndex";
import _forEachRight from "lodash/forEachRight"
import dayjs from "dayjs";
import TodoCreator from "~/components/TodoCreator";
import TodoItem from "~/components/TodoItem";

export default {
  components: {
    TodoCreator,
    TodoItem,
  },
  data() {
    return {
      db: null,
      id: dayjs(new Date()).format("YYYYMMDDmss"),
      todos: [],
      filter: "all",
    };
  },
  computed: {
    filteredTodos() {
      switch (this.filter) {
        case "all":
        default:
          return this.todos;
        case "active":
          return this.todos.filter((todo) => !todo.done);
        case "completed":
          return this.todos.filter((todo) => todo.done);
      }
    },
    total() {
      return this.todos.length;
    },
    activeCount() {
      return this.todos.filter((todo) => !todo.done).length;
    },
    completedCount() {
      return this.total - this.activeCount;
    },
    allDone: {
      get() {
        return this.total === this.completedCount && this.total > 0;
      },
      set(checked) {
        this.completeAll(checked);
      },
    },
  },
  created() {
    this.initDB();
  },
  methods: {
    initDB() {
      const adapter = new localStroage("todo-app"); // DB
      this.db = lowdb(adapter);
      console.log(this.db);

      const hasTodos = this.db.has("todos").value();

      if (hasTodos) {
        this.todos = _cloneDeep(this.db.getState().todos);
      } else {
        // Local DB 초기화
        this.db
          .defaults({
            todos: [], // Collection
            // users : [],
            // date: new Date()
          })
          .write();
      }
    },
    createTodo(title) {
      const newTodo = {
        id: this.id,
        //id: cryptoRandomString({ length: 10 }),
        // title: title,
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false,
      };
      this.db
        .get("todos")
        .push(newTodo) // lodsh
        .write(); // lowdb

      //화면갱신
      this.todos.push(newTodo);
    },
    updateTodo(todo, value) {
      this.db.get("todos").find({ id: todo.id }).assign(value).write();

      const foundTodo = _find(this.todos, { id: todo.id });
      _assign(foundTodo, value);
    },
    deleteTodo(todo) {
      this.db.get("todos").remove({ id: todo.id }).write();

      const foundIndex = _findIndex(this.todos, { id: todo.id });
      this.$delete(this.todos, foundIndex);
    },
    changeFilter(filter) {
      this.filter = filter;
    },
    completeAll(checked) {
      //DB
      const newTodos = this.db
        .get("todos")
        .forEach((todo) => {
          todo.done = checked;
        })
        .write();
      // Local Todos
      //this.todos.forEach( todo => { todo.done = checked})
      this.todos = _cloneDeep(newTodos);
    },
    clearCompleted() {
      //this.todos.forEach((todo) => {
      //  if (todo.done) {
      //    this.deleteTodo(todo);
      //  }
      //});
      // this.todos.reduce((list, todo, index) => {
      //   if(todo.done){
      //     list.push(index)
      //   }
      //   return list
      // }, []).reverse().forEach(index => {
      //   this.deleteTodo(this.todos[index])
      // })
      _forEachRight(this.todos, todo => {
        if(todo.done){
          this.deleteTodo(todo)
        }
      })
    }
  }
};
</script>

<style lang="scss">
  @import "../scss/style"
</style>
