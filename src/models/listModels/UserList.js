import UserSearch from "../searchModels/UserSearch"
import VFrame from "@vshen/v-frame-core/lib/VFrame"
import BaseListModel from "../baseModels/BaseListModel"
import VActionColumn from "../../components/tables/VActionColumn"
import {markRaw} from "vue"
import VPrimaryTextColumn from "../../components/tables/VPrimaryTextColumn";

export default class UserList extends BaseListModel {
    isSelectionShow = true

    searchModel = new UserSearch()

    modelList = []

    actionList = [
        {
            name: '新建',
            type: 'create',
        },
        {
            name: '导入',
            type: 'import'
        },
    ]

    bodyConfig = {
        username: {
            component: {
                widget: markRaw(VPrimaryTextColumn),
                options: {
                    class: 'text-pointer'
                },
                events: {
                    click: (model) => {
                        VFrame.getInstance().showToast({
                            message: '点击了' + model.getValue('username')
                        })
                    }
                }
            }
        },
        gender: {},
        name: {
        },
        phone: {},
        email: {},
        create_time: {
        },
        action: {
            options: {
                align: 'center',
                fixed: 'right',
            },
            name: '操作',
            component: {
                widget: markRaw(VActionColumn),
                options: {
                    items: [
                        {
                            name: '编辑',
                            type: 'update'
                        },
                    ]
                },
                events: {
                    actionClick: (item) => {
                        VFrame.getInstance().showToast({
                            message: '点击了' + item.name
                        })
                    }
                }
            }
        }
    }

    onActionCreate() {
        VFrame.getInstance().showToast({
            message: '点击了新建按钮'
        })
    }

    onActionImport() {
        VFrame.getInstance().showToast({
            message: '点击了导入按钮'
        })
    }
}