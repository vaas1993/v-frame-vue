<template>
<div class="full">

    <div class="width-80 text-justify">

        <div class="text-extra-large text-bold mb-2">
            概述
        </div>
        VF提供了一个弹出模态框的方法，我们可以靠它来实现一些既不方便在现有布局中处理，也不方便跳转的操作，比如一些小表单。

        <h2>
            使用方法
        </h2>
<pre>
VFrame.getInstance().showModal({
    title: String,
    content: Object,
    showClose: Boolean,
})

title：弹出框的标题，为空时会隐藏标题
content：弹出框的内容，格式为 &lt;widget: VueComponent, options: object, events: object&gt;，稍后会说明这个格式
showClose：是否显示弹出框的关闭按钮，默认是显示
</pre>
        <div>
            其中我们需要注意content的格式，我们支持传入VUE的组件，并通过 options 参数和 events 参数分别传入组件的props和事件监听，我们来看一个简单的例子：
        </div>
<pre>
import VForm from '../../components/VForm'
import {markRaw} from "vue"
VFrame.getInstance().showModal({
    title: "模态框演示",
    content: {
        widget: markRaw(VForm),
        options: {
            formModel: demoFormModel,
        }
    }
})
</pre>
        <div>

            <el-button @click="onDemo1" type="primary">点击这里查看例子</el-button>
        </div>
        <div>
            可以看出，content.widget 参数接收一个正常的VUE组件，并通过 options 参数传递组件所需要的参数即可在模态框中渲染，
            不难发现我们这里渲染的和
            <router-link to="/form/index" class="text-primary">表单</router-link>
            一节中的 新建用户表单 是一模一样的。
        </div>
        <div>
            由于我们使用的是VUE的语法进行组件渲染，这样可以在编写组件时也不会丢失应用程序的上下文，你只需要正常的编写组件即可。
        </div>
    </div>
</div>
</template>

<script>
import UserCreateForm from "../../models/formModels/UserCreateForm"
import VForm from "../../components/VForm"
import {markRaw} from "vue";

export default {
    name: "index",
    data() {
        return {
            demoFormModel: new UserCreateForm(),
        }
    },
    methods: {
        onDemo1() {
            this.$vf.showModal({
                title: "模态框演示",
                content: {
                    widget: markRaw(VForm),
                    options: {
                        formModel: this.demoFormModel,
                    }
                }
            })
        }
    }
}
</script>

<style scoped>

</style>