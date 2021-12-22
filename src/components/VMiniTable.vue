<template>
    <div class="height-100 relative">
        <!-- 加载中的动画组件，通过 props.isLoading 来控制 -->
        <v-loading-bar v-if="isLoading"></v-loading-bar>

        <!-- 表格的组件 -->
        <el-table
            ref="t"
            :data="dataProvider.modelList"
            class="full"
            :empty-text="isLoading ? '加载中' : '暂无信息'"
            height="calc(100% - 54px)"
            border
            stripe
            :row-key="primaryKey"
            size="small"
            :header-cell-style="{fontSize: '14px'}"
        >
            <el-table-column v-if="dataProvider.isSelectionShow" :width="36">
                <template #default="scope">
                    <el-checkbox v-model="selectionList[scope.row[primaryKey]]" @change="onSelectionChange"></el-checkbox>
                </template>
                <template #header>
                    <el-checkbox :disabled="dataProvider.modelList.length === 0" @change="onSelectionAll" v-model="isSelectionAll"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                v-for="(item, field) of columnList"
                :prop="field"
                :label="item.name"
                v-bind="item.options || {}"
                :key="field"
            >
                <template #default="scope">
                    <component
                        v-if="item.component && !scope.row.getIsEmpty(field)"
                        v-bind:is="item.component.widget"
                        v-bind="item.component.options || {}"
                        v-on="item.component.events || {}"
                        :model="scope.row"
                        :field="field"
                    >
                        <template #empty>
                            <span class="text-mini">
                                /
                            </span>
                        </template>
                    </component>
                    <span v-else-if="scope.row.getValue(field)">
                        {{scope.row.getValue(field)}}
                    </span>
                    <span v-else class="text-mini">
                        /
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="mt-2 text-right"
            background
            :hide-on-single-page="false"
            :default-current-page="dataProvider.pager.pagination"
            :default-page-size="dataProvider.pager.size"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="dataProvider.pager.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dataProvider.pager.total || 0"
            @size-change="onSizeChange"
            @current-change="onPageChange"
        >
        </el-pagination>
    </div>
</template>

<script>
import BaseListModel from "../models/baseModels/BaseListModel"
import VLoadingBar from "./VLoadingBar"

export default {
    name: "VMiniTable",
    components: {VLoadingBar},
    props: {
        isLoading: {
            type: Boolean,
            default: false
        },
        dataProvider: {
            type: BaseListModel,
            required: true,
        },
    },
    data() {
        return {
            selectionList: {},
            isSelectionAll: false,
        }
    },
    computed: {
        primaryKey() {
            return this.dataProvider.getShowModel().primaryKey
        },
        columnList() {
            return this.dataProvider.getBodyConfig()
        },
    },
    watch: {
        'dataProvider.selectionList'() {
            this.calcSelectionStatus()
        }
    },
    methods: {
        calcSelectionStatus() {
            let count = 0
            this.selectionList = {}
            for (let model of this.dataProvider.modelList) {
                this.selectionList[model[this.primaryKey]] = this.dataProvider.getIsSelected(model[this.primaryKey])
                count += this.selectionList[model[this.primaryKey]] ? 1 : 0
            }
            this.isSelectionAll = (count !== 0 && count === this.dataProvider.modelList.length)
        },

        onSelectionChange() {
            for (let id in this.selectionList) {
                this.dataProvider.setSelection(id, this.selectionList[id])
            }
        },

        onSelectionAll() {
            for (let id in this.selectionList) {
                this.selectionList[id] = this.isSelectionAll
            }
            this.onSelectionChange()
        },

        onSizeChange(size) {
            this.dataProvider.setPager({
                pagination: 1,
                size,
            })
            this.onLoad()
        },

        onPageChange(page) {
            this.dataProvider.setPager({
                pagination: page,
            })
            this.onLoad()
        },

        async onLoad() {
            // 页面重新加载和手动调用表格设置复选框状态的方法时都会触发复选框事件
            // 这样会导致很多奇怪的问题，这里加个锁，用来规避这个问题
            let result = await this.dataProvider.onLoad(this.dataProvider.pager.pagination)
            this.calcSelectionStatus()
            return result
        },
    },
}
</script>

<style scoped>

</style>