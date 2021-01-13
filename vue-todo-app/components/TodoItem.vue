<template>
    <div class="todo-item" :class="{ done }">
        <div class="item__inner item--edit" v-if="isEditMode">
            <input ref="titleInput" type="text" :value="editedTitle" @input="editedTitle = $event.target.value" @keypress.enter="editedTodo" @keypress.esc="offEditedMode"/>
            <div class="item__actions">
                <button class="btn btn--primary" key="complate" @click="editedTodo">
                    <i class="material-icons">done</i>
                </button>
                <button class="btn" key="cancel" @click="offEditedMode">
                    <i class="material-icons">clear</i>
                </button>
            </div>
        </div>
        <div class="item__inner item--normal" v-else>
            <label>
                <input type="checkbox" v-model="done" />
                <span class="icon"><i class="material-icons">check</i></span>
            </label>
            <div class="item__title-wrap">
                <div class="item__title">
                    {{ todo.title }}
                </div>
                <div class="item__date">
                    {{ date }}
                </div>
            </div>
            <div class="item__actions">
                <button class="btn" key="update" @click="onEditMode">
                    <i class="material-icons">edit</i>
                </button>
                <button class="btn btn--danger" key="delete" @click="deleteTodo">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
    props: {
        todo: Object
    },
    data() {
        return{
            isEditMode : false,
            editedTitle:''
        }
    },
    computed: {
        done: {
            get() {
                return this.todo.done
            },
            set(done) {
                this.updateTodo({
                    done
                })
            }
        },
        date() {
            const date = dayjs(this.todo.createdAt)
            const isSame = date.isSame(this.todo.updatedAt) //날짜 비교 retrun : true, false

            if(isSame){
                return date.format('YYYY년 MM월 DD일')
            }else {
                return `${date.format('YYYY년 MM월 DD일')} (edited)`
            }
            
        }
    },
    methods: {
        editedTodo(){
            if(this.todo.title !== this.editedTitle){
                this.updateTodo({
                    title: this.editedTitle,
                    updatedAt: new Date()
                })
            }
            this.offEditedMode()
        },
        onEditMode() {
            this.isEditMode = true
            this.editedTitle = this.todo.title
            
            this.$nextTick(() => {
                this.$refs.titleInput.focus()
            })
        },
        offEditedMode() {
            this.isEditMode = false
        },
        updateTodo (value) {
            this.$emit('update-todo', this.todo, value)
        },
        deleteTodo () {
            this.$emit('delete-todo', this.todo)
        }
    }
}
</script>