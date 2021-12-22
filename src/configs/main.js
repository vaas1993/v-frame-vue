import User from "../models/dataModels/User";
import apis from "./apis";
import axios from "axios";
import VFrame from "@vshen/v-frame-core/lib/VFrame";
import ObjectHelper from "@vshen/v-frame-core/src/helpers/ObjectHelper";

export default {
    name: 'VFrame For Vue',

    user: {
        class: User
    },

    api: {
        list: apis,
        driver: axios,
        defaultHeaders: () => {
            let headers = {
                Authorization: 'Bearer 871b4927c06249db505c11d94cddd9ff'
            }
            if(VFrame.getInstance().user.getIsLogin()) {
                headers.Authorization = 'Bearer ' + VFrame.getInstance().user.getAccessToken()
            }
            return headers
        },
        filter: [
            {
                type: 'success',
                validate: response => response.status === 200 && response.statusText === 'OK',
                data: response => {
                    return {
                        data: ObjectHelper.getValue(response, 'data'),
                        message: ObjectHelper.getValue(response, 'data'),
                        items: ObjectHelper.getValue(response, 'data.items'),
                        listMeta: {
                            pagination: ObjectHelper.getValue(response, 'data._meta.currentPage'),
                            size: ObjectHelper.getValue(response, 'data._meta.perPage'),
                            total: ObjectHelper.getValue(response, 'data._meta.totalCount'),
                        },
                    }
                }
            },
            {
                type: 'error',
                validate: response => response.status === 200 && response.data?.code === 400,
                data: response => {
                    return {
                        data: ObjectHelper.getValue(response, 'data.data.attribute'),
                        message: ObjectHelper.getValue(response, 'data.msg'),
                    }
                }
            },
            {
                type: 'error',
                validate: response => response.status === 200 && response.data?.code === 403,
                data: response => {
                    return {
                        message: ObjectHelper.getValue(response, 'data.msg'),
                    }
                }
            },
            {
                type: 'error',
                validate: response => response.status === 403 && response.data?.code === 403,
                data: response => {
                    return {
                        message: ObjectHelper.getValue(response, 'data.msg'),
                    }
                }
            },
            {
                type: 'error',
                validate: response => response.status === 200 && response.data?.code === 404,
                data: response => {
                    return {
                        message: ObjectHelper.getValue(response, 'data.msg'),
                    }
                }
            },
        ]
    },
}