import BaseDataModel from "../baseModels/BaseDataModel";

export default class Tree extends BaseDataModel {
    static ListApi = 'store.list'

    get icon() {
        if( parseInt(this.getSource('type')) === 1 ) {
            return 'icon-company-1'
        }
        return 'icon-store-1'
    }
}