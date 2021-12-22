import User from "../dataModels/User"
import {ElInput} from "element-plus"
import {markRaw} from 'vue'
import VFrame from "@vshen/v-frame-core/lib/VFrame"

export default class LoginForm extends User {
    getFormConfig() {
        return {
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
    }

    getFormActionList() {
        return [
            {
                name: '登录',
                type: 'login',
                options: {
                    class: 'width-100',
                    type: 'primary'
                }
            },
        ]
    }

    onFormLogin() {
        return new Promise(next => {
            setTimeout(() => {
                VFrame.getInstance().showToast({
                    message: '登录成功',
                    type: 'success'
                })
                next()
            }, 1500)
        })
    }
}

