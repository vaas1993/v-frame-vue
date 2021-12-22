import AppModel from "@vshen/v-frame-core/lib/models/AppModel"

export default class BaseDataModel extends AppModel {
    getListQueryParams() {
        let query = {}
        let params = super.getListQueryParams()
        for (let field in params) {
            query['filter['+field+']'] = params[field]
        }
        return query
    }
}