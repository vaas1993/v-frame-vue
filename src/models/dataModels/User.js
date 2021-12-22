import BaseUserModel from "../baseModels/BaseUserModel"


export default class User extends BaseUserModel {
    fieldLabels = {
        username: '用户名',
        name: '姓名',
        email: '邮箱',
        password: '密码',
        phone: '手机号',
        gender: '性别',
        create_time: '注册时间'
    }
}