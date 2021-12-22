import User from "../dataModels/User";
import {markRaw} from "vue";
import {ElDatePicker, ElInput} from "element-plus";
import VSelect from "../../components/forms/VSelect";

export default class UserSearch extends User {
    static ListApi = 'user.list'

    formatConfig = Object.assign(this.formatConfig, {
        gender: {
            value: {
                1: '男',
                2: '女'
            }
        },

        create_time: {
            value: () => {
                if( Array.isArray(this.create_time) && this.create_time.length === 2 ) {
                    return this.create_time.join(' 至 ')
                }
                return null
            }
        }
    })

    getFormConfig() {
        return {
            username: {
                component: {
                    widget: markRaw(ElInput)
                }
            },
            name: {
                component: {
                    widget: markRaw(ElInput)
                }
            },
            phone: {
                component: {
                    widget: markRaw(ElInput)
                }
            },
            email: {
                component: {
                    widget: markRaw(ElInput)
                }
            },
            gender: {
                component: {
                    widget: markRaw(VSelect),
                    options: {
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
            create_time: {
                options: {
                    style: 'width: 100%;'
                },
                component: {
                    widget: markRaw(ElDatePicker),
                    options: {
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                        style: 'width: 100%',
                        type: 'daterange',
                        format: 'YYYY-MM-DD',
                        valueFormat: 'YYYY-MM-DD'
                    }
                }
            },
        }
    }
}