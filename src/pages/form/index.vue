<template>
    <div>
        <div class="width-80 text-justify">
            <div class="text-extra-large text-bold mb-2">
                概述
            </div>
            <div>
可以使用 VForm 组件来快速渲染表单，组件接收一个 formModel 参数，表单的内容、提交操作 等都由传入的 formModel 来完成。
formModel 是一个 AppModel 子类的实例，需要实现 getFormConfig 方法和定义静态变量 ActionApi，VForm 组件会自动调用getFormConfig ，
并使用其返回值来渲染表单内容，在表单提交后，会自动调用 formModel.action 方法来提交表单收集到的数据，formModel.action 方法默认会调用 ActionApi 指定接口地址。
            </div>
            <h2>示例一：登录表单</h2>
        </div>

        <div class="width-40 hidden">
            <v-form :form-model="formModel1" :is-action-show="false"></v-form>
        </div>

        <div class="width-80 text-justify">

            <pre>
要渲染上面这个登录表单，我们只需要创建一个表单类，重写 getFormConfig 方法，返回一个以下所示的结构即可：
{
    username: {
        component: {
            widget: markRaw(ElInput),
        },
        options: {
            class: 'width-100'
        }
    },
    password: {
        component: {
            widget: markRaw(ElInput),
            options: {
                type: 'password'
            }
        },
        options: {
            class: 'width-100'
        }
    }
}

我们可以继续完善这个登录表单，比如作为登录表单它还需要一个登录按钮。
formModel集成了对操作按钮的定义，我们可以通过重写 getFormActionList 方法来满足这个需求。
假如我们需要返回一个【登录】按钮，我们可以在 getFormActionList 方法里返回以下所示的结构：
[
    {
        text: '登录',
        options: {
            class: 'width-100',
            type: 'primary'
        }
    }
]
            </pre>
            <h3>完整的登录表单例子：</h3>
        </div>
        <div class="width-40 hidden">
            <v-form :form-model="formModel1"></v-form>
        </div>

        <div class="width-80 text-justify">
            <h1>新建用户表单：</h1>
        </div>

        <div class="width-40 hidden">
            <v-form :form-model="formModel2"></v-form>
        </div>

        <h3>配置：</h3>
        <pre>
{
    username: {
        component: {
            widget: markRaw(ElInput),
        },
        options: {
            class: 'width-100'
        }
    },

    name: {
        component: {
            widget: markRaw(ElInput),
        },
    },

    phone: {
        component: {
            widget: markRaw(ElInput),
            options: {
                type: 'number'
            }
        },
    },

    email: {
        component: {
            widget: markRaw(ElInput),
        },
    },

    gender: {
        component: {
            widget: markRaw(VSelect),
            options: {
                clearable: true,
                items: [{
                        name: '男',
                        value: 1
                    },
                    {
                        name: '女',
                        value: 2
                    },
                ]
            }
        }
    },

    protocol: {
        label: '勾选即视为已读并同意以下内容',
        component: {
            widget: markRaw(ElCheckbox),
            options: {
                label: '同意《网站服务条款》、《法律申明和隐私政策》'
            }
        },
        options: {
            class: 'width-100'
        }
    }
}
        </pre>
    </div>
</template>

<script>
import VForm from "../../components/VForm";
import LoginForm from "../../models/formModels/LoginForm";
import UserCreateForm from "../../models/formModels/UserCreateForm";
export default {
    name: "index",
    components: {VForm},
    data() {
        return {
            formModel1: new LoginForm(),
            formModel2: new UserCreateForm(),
        }
    }
}
</script>

<style scoped>

</style>