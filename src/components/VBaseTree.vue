<template>
    <div class="tree-container height-100">
        <div class="search-container">
            <el-input placeholder="请输入搜索内容" v-model="queryText" clearable>
                <template #append>
                    <el-button @click="onSearchClick">搜索</el-button>
                </template>
            </el-input>
        </div>

        <div class="body-container hidden mt-1" :style="{height: height, overflowY: 'auto'}">
            <el-tree
                :default-expanded-keys="expandedKeys"
                :props="config"
                :load="onNodeLoad"
                :node-key="config.value"
                check-on-click-node
                :expand-on-click-node="false"
                :current-node-key="value"
                lazy
                :data="items"
                @node-click="onNodeClick"
            >
                <template #default="scope">
                    <div :class="scope.data.getSource(config.value) === value ? 'text-primary' : ''">
                        {{scope.data.getValue(config.label)}}
                    </div>
                </template>
            </el-tree>
        </div>

    </div>
</template>

<script>
export default {
    name: "VBaseTree",
    props: [
        'config',
        'load',
        'modelValue',
        'model',
        'searchField',
        'parentField',
        'defaultParentId',
        'height'
    ],
    data() {
        return {
            queryText: '',
            items: [],
            expandedKeys: [],
            value: this.modelValue,
        }
    },
    methods: {
        /**
         * 树节点被点击时的事件
         * @param {object} node 点击的节点，可通过 node.data 取到节点数据模型
         * @param {function} resolve 完成后的回调函数，可以传入一个模型数组作为被点击节点的子节点
         * @returns {Promise<void>}
         */
        async onNodeLoad(node, resolve) {
            let params = {}
            params[this.parentField] = node.data.id || this.defaultParentId

            let items = await this.onSearch(params)
            resolve([])
            if( !Array.isArray(node.data) ) {
                node.data.setSource(this.config.children, items)
            }

            if( node.data.id === undefined ) {
                this.expandedKeys = this.items.map(item => item.id)
            }
        },

        /**
         * 调用接口读取树数据的方法
         * @param {object} params 接口请求参数
         * @returns {Promise<*[]>} 返回一个模型列表，用于构建树节点
         */
        async onSearch(params = {}) {
            let items = []
            if( await this.model.list(params) ) {
                if( this.items.length === 0 ) {
                    this.items = this.model.response.models
                }
                items = this.model.response.models
            }
            return items
        },

        /**
         * 树节点被点击时的事件，用来触发 update:modelValue 事件
         * @param {object} model 被点击的节点模型
         */
        onNodeClick(model) {
            this.value = model.getSource(this.config.value)
            this.model.setSource(this.config.value, model.getSource(this.config.value))
            this.model.setSource(this.config.value + '_view', model.getSource(this.config.label))
            this.$emit('node-click', model)
        },

        /**
         * 搜索按钮被点击的事件
         * 调用 onSearch 方法从远程加载数据
         */
        onSearchClick() {
            let params = {}
            this.items = []
            if( this.queryText !== '' ) {
                params[this.searchField] = this.queryText
            } else {
                params[this.parentField] = this.defaultParentId
            }
            this.onSearch(params)
        }
    },

}
</script>

<style scoped>

</style>