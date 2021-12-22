<template>
    <div class="v-table height-100">
        <div class="v-table-header flex width-100" @keyup.enter="onLoad">
            <v-table-action v-if="!actionToHeader" :action-list="actionList" @action-click="onActionClick"></v-table-action>
            <div
                class="hidden"
                v-if="dataProvider.isSearchShow"
                :class="isAdvancedShow ? 'advanced-search-container' : 'search-container'"
            >
                <v-form
                    ref="searchForm"
                    class="float-left"
                    :form-model="dataProvider.searchModel"
                    :form-config="formConfig"
                    :is-action-show="false"
                    :is-error-message-show="false"
                    :adaption="true"
                ></v-form>

                <el-button
                    type="text"
                    v-if="dataProvider.isSearchShow && isAdvancedShow"
                    class="mt-2 advanced-search-button"
                    @click="onAdvancedClick"
                >
                    高级搜索
                </el-button>
            </div>
            <div class="float-left action-container hidden" :class="dataProvider.isSearchShow ? 'mt-2' : ''">
                <el-button
                    v-if="dataProvider.isSearchShow"
                    @click="onLoad"
                >
                    搜索
                </el-button>
                <el-button
                    type="text"
                    v-if="dataProvider.isExportShow"
                    @click="onActionClick({type: 'export', name: '导出'})"
                >
                    导出
                </el-button>
            </div>
        </div>

        <div
            class="v-table-search-preview mv-1 relative hidden"
            ref="preview"
            v-if="JSON.stringify(dataProvider.getSearchPreviewData()) !== '{}' || dataProvider.selectionList.length > 0"
        >
            <div v-if="dataProvider.selectionList.length > 0" class="mr-1 float-left">
                <v-icon icon="icon-selection-1" class="text-mini lh-1">
                    <span class="pl-1">已选：</span>
                </v-icon>

                <el-tag size="mini" closable @close="onSelectionToEmpty">
                    {{dataProvider.selectionList.length}} 项
                </el-tag>
            </div>

            <div v-if="JSON.stringify(dataProvider.getSearchPreviewData()) !== '{}'" class="float-left">
                <v-icon icon="icon-search-2" class="text-mini lh-1">
                    <span class="pl-1">筛选项：</span>
                </v-icon>

                <el-tag
                    size="mini" closable
                    v-for="(item, field) of dataProvider.getSearchPreviewData()"
                    :key="field"
                    @close="onFormItemToEmpty(field, item)"
                >
                    <span class="text-black-4">
                        {{ item.name || dataProvider.searchModel.getLabel(field) }}：
                    </span>
                    <span>
                        {{ item.value }}
                    </span>
                </el-tag>
            </div>
        </div>
        <div v-else class="mt-2"></div>
        <div class="v-table-body hidden" :style="bodyStyle">
            <v-mini-table
                ref="t"
                :is-loading="isLoading > 0"
                :dataProvider="dataProvider"
            ></v-mini-table>
        </div>
    </div>
</template>

<script>
import VForm from "./VForm"
import VTableAction from "./VTableAction"
import VFrame from "@vshen/v-frame-core/lib/VFrame"
import {markRaw} from "vue"
import VMiniTable from "./VMiniTable"
import BaseListModel from "../models/baseModels/BaseListModel"
import VIcon from "./VIcon";

export default {
    name: "VTable",
    data() {
        return {
            isLoading: 0,
            bodyStyle: {
                height: 'calc(100% - 68px - 20px)'
            }
        }
    },
    components: {VIcon, VMiniTable, VTableAction, VForm},
    computed: {
        /**
         * 列表的
         */
        actionList() {
            return this.dataProvider.getActionList()
        },
        /**
         * 搜索表单的配置
         */
        formConfig() {
            let config = {}
            let items = this.dataProvider.searchModel.getFormConfig()
            for (let field in items) {
                config[field] = items[field]
                if (Object.keys(config).length >= this.maxFormItemCount) {
                    break
                }
            }
            return config
        },
        /**
         * 是否展示高级搜索
         */
        isAdvancedShow() {
            return Object.keys(this.dataProvider.searchModel.getFormConfig()).length > this.maxFormItemCount
        }
    },
    props: {
        /**
         * 是否将操作按钮展示到面包屑的右侧
         */
        actionToHeader: {
            type: Boolean,
            default: true
        },
        /**
         * 数据提供者
         */
        dataProvider: {
            type: BaseListModel,
            required: true
        },
        /**
         * 搜索表单默认最多展示的数量
         */
        maxFormItemCount: {
            type: Number,
            default: window.innerWidth > 1366 ? 6 : 4
        },
        /**
         * 是否在初始化时自动调用接口加载数据
         */
        autoInit: {
            type: Boolean,
            default: true
        },
        /**
         * 是否自动将查询参数同步到URL中
         * 注意，如果设置为 false，将一并关掉从URL中读取数据的能力
         */
        pushToUrl: {
            type: Boolean,
            default: true,
        }
    },
    beforeCreate() {
        if( this.pushToUrl ) {
            try {
                this.dataProvider.searchModel.setSources( JSON.parse(this.$route.query.params || '{}') )
                this.dataProvider.setPager( JSON.parse(this.$route.query.pager || '{}') )
            } catch (e) {
                console.log(e)
            }
        }
    },
    mounted() {
        if (this.actionToHeader) {
            VFrame.getInstance().pageActionComponent = {
                widget: markRaw(VTableAction),
                options: {
                    actionList: this.actionList
                },
                events: {
                    'action-click': (item) => {
                        this.onActionClick(item)
                    }
                }
            }
        }

        if (this.autoInit) {
            this.onLoad()
        }
    },
    watch: {
        'dataProvider': {
            deep: true,
            handler() {
                this.renderBody()
            }
        },
    },
    unmounted() {
        if (this.actionToHeader) {
            VFrame.getInstance().pageActionComponent = undefined
        }
    },
    methods: {
        /**
         * 高级搜索按钮点击事件
         */
        onAdvancedClick() {
            VFrame.getInstance().showModal({
                title: '高级搜索',
                content: {
                    widget: markRaw(VForm),
                    options: {
                        actionHandler: (button, formData) => {
                            VFrame.getInstance().hideModal()
                            if (button.type === 'submit') {
                                this.dataProvider.searchModel.setSources(formData)
                                this.onLoad()
                            }
                        },
                        formModel: this.dataProvider.searchModel
                    }
                }
            })
        },

        onSelectionToEmpty() {
            this.dataProvider.clearSelection()
        },

        /**
         * 搜索预览的标签关闭事件
         */
        onFormItemToEmpty(field, item) {
            // 如果已经设置了 item.close ，则调用它，否则调用 setEmpty 方法
            if (typeof item.close === 'function') {
                item.close()
            } else {
                this.dataProvider.searchModel.setEmpty(field)
            }
            this.$refs.searchForm.loadDataFromModel()
            this.onLoad()
        },

        /**
         * 计算表格框的样式
         */
        renderBody() {
            this.$nextTick(() => {
                let previewHeight = 20
                if (this.$refs.preview) {
                    previewHeight = this.$refs.preview.clientHeight + 20
                }
                this.bodyStyle = Object.assign({}, this.bodyStyle, {
                    height: 'calc(100% - 60px - ' + previewHeight + 'px)'
                })
            })
        },

        /**
         * 操作按钮的点击事件
         */
        onActionClick(item) {
            let eventName = item.type.split('')
            eventName[0] = eventName[0].toUpperCase()
            eventName = 'onAction' + eventName.join('')
            this.dataProvider[eventName]({
                vue: this,
                item,
                setLoading: () => {
                    this.isLoading++
                },
                setLoaded: () => {
                    this.isLoading--
                },
            })
        },

        /**
         * 使用 dataProvider 读取列表数据
         * @returns {Promise<void>}
         */
        async onLoad() {
            this.pushSearchQueryToUrl()
            this.$refs.searchForm.submitDataToModel()
            this.isLoading++
            await this.$refs.t.onLoad()
            this.isLoading--
        },

        /**
         * 将搜索参数推送到链接中，以在页面刷新后复原
         */
        pushSearchQueryToUrl() {
            // 可通过组件参数设置为不推送
            if (!this.pushToUrl) {
                return
            }
            // 如果浏览器不支持则跳过下面的逻辑
            if (!window.history) {
                return
            }

            // 将现有的参数和需要推送的参数进行合并
            let query = Object.assign({}, this.$route.query || {})

            query.params = JSON.stringify(this.$refs.searchForm.formData || {})
            query.pager = JSON.stringify(this.dataProvider.pager || {})

            if( query.params === '{}' ) {
                delete query.params
            }
            if( query.pager === '{}' ) {
                delete query.pager
            }

            // 拼凑成完成的URL
            let url = [
                window.location.protocol,
                '//',
                window.location.host,
                window.location.pathname,
            ].join('')
            let queryList = []
            for (let field in query) {
                queryList.push(field + '=' + query[field])
            }
            window.history.replaceState({}, null, decodeURIComponent(url + '?' + queryList.join('&')))
        }
    },
}
</script>

<style scoped>
.action-container {
    width: 110px;
}

.search-container {
    width: calc(100% - 110px);
}

.advanced-search-container {
    width: calc(100% - 110px);
    box-sizing: border-box;
}

.advanced-search-container .v-form {
    width: unset;
    max-width: calc(100% - 78px);
}

.advanced-search-container .advanced-search-button {
    float: left;
}

.v-table-body {
    box-sizing: border-box;
}

.v-table-search-preview .el-tag {
    position: relative;
    top: -1px;
}

.v-table-search-preview .el-tag + .el-tag {
    margin-left: 10px;
}

.v-table-search-preview {
    height: 20px;
    box-sizing: border-box;
}
</style>