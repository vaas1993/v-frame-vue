import User from "../dataModels/User";
import {markRaw} from "vue";
import VSelect from "../../components/forms/VSelect";
import {ElCheckbox, ElInput} from "element-plus";

export default class UserCreateForm extends User {
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
                        items: [
                            {
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
    }
}