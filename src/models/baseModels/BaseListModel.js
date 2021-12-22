import AppList from "@vshen/v-frame-core/lib/models/AppList"
import VFrame from "@vshen/v-frame-core/lib/VFrame"

export default class BaseListModel extends AppList {
    /**
     * 是否在第一列显示复选框
     * @type {boolean}
     */
    isSelectionShow = false

    /**
     * 表格已选项，格式为 {页码：[选中项]}
     * @type {array<int|string>}
     */
    selectionList = []

    /**
     * 设置复选项
     * @param {string|int} primaryKey 需要操作项的模型实例ID
     * @param {boolean} selection 选中与否
     */
    setSelection(primaryKey, selection = true) {
        primaryKey += ''
        if( selection ) {
            if( !this.getIsSelected(primaryKey) ) {
                this.selectionList.push(primaryKey)
            }
        } else {
            if( this.getIsSelected(primaryKey) ) {
                this.selectionList.splice(this.selectionList.indexOf(primaryKey), 1)
            }
        }

        this.selectionList = [].concat(this.selectionList)
    }

    /**
     * 清空已选项
     */
    clearSelection() {
        this.selectionList = []
    }

    /**
     * 根据实例ID获取其是否已经选中
     * @param {string|int} primaryKey
     * @returns {boolean}
     */
    getIsSelected(primaryKey) {
        primaryKey += ''
        return this.selectionList.indexOf(primaryKey) !== -1
    }

    /**
     * 导出按钮点击事件
     * @param setLoading
     * @param setLoaded
     */
    onActionExport({setLoading, setLoaded}) {
        VFrame.getInstance().showToast({
            message: '点击了导出按钮'
        })
        setLoading()
        setTimeout(() => {
            setLoaded()
        }, 1500)
    }

    /**
     * 获取需要作为搜索预览的数据
     * 返回 key => value 的形式，其中 key 作为字段，value 作为展示值
     */
    getSearchPreviewData() {
        let data = {}
        this.searchModel.getFormFields().map(field => {
            if( !this.searchModel.getIsEmpty(field) ) {
                data[field] = {
                    value: this.searchModel.getValue(field),
                    // name: '自定义的标签名' // name 不是必填的，如果name为空则会自动调用 this.showModel.getLabel(field)
                }
            }
        })
        return data
    }
}