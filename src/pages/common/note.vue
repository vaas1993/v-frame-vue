<template>
    <div>
        <div class="text-extra-large text-bold mb-2">
            概述
        </div>
        有时候我们希望在页面中弹出一个小卡片用来显示一些需要持久展示的信息，这个时候只靠之前提及的四种提示肯定是不行了，我们用VUE封装了一个带有关闭按钮的小便签，它支持拖拽使用，类似于电脑系统的小窗口。

        <div class="mv-2">
            <el-button @click="onNoteCreate">添加一个</el-button>
        </div>

        <template v-for="id of noteList" :key="id">
            <v-note :name="'便签演示 #' + id" :id="id" @close="onNoteClose">
                <div class="text-mini">
                    <div>
                        每一个便签需要指定一个唯一的ID，在关闭的时候可以根据ID来关闭
                    </div>
                    <div>
                        你可以像使用电脑程序一样，点击标签头部进行拖动，也可以点击最小化和展开按钮来切换展示模式
                    </div>
                    <div>
                        便签的内容直接就使用了VUE的插槽，所以你可以任意的编辑便签的内容
                    </div>
                    <div>
                        你还可以通过 width、height、top、left 四个参数来指定尺寸和默认的展示位置
                    </div>
                </div>
            </v-note>
        </template>

        <v-tree
            :model="model"
            v-model="tree"
            :search-params-handle="onSearchParams"
        ></v-tree>
    </div>
</template>

<script>
import VNote from "../../components/VNote";
import VTree from "../../components/forms/VTree";
import Tree from '../../models/dataModels/Tree'
export default {
    name: "note",
    components: {VTree, VNote},
    data() {
        return {
            model: new Tree(),
            noteList: [],
            tree: 1
        }
    },
    methods: {
        onNoteCreate() {
            this.noteList.push('note-' + Math.random().toFixed(5))
        },
        onNoteClose(id) {
            this.noteList.splice(this.noteList.indexOf(id), 1)
        },
        onSearchParams(params) {
            if( JSON.stringify(params) === '{}' ) {
                params.id = 1
            }
            return params
        }
    },
}
</script>

<style scoped>

</style>