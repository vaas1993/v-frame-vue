<template>
    <div class="v-tree hidden border-box">
        <el-popover
            placement="bottom-start"
            trigger="click"
            width="300px"
        >
            <template #reference>
                <el-input readonly :value="model.getValue(config.value)" :placeholder="model.getValue(config.value) ? '' : '请选择'"></el-input>
            </template>

            <template #default>
                <v-base-tree
                    height="300px"
                    :config="config"
                    :model="model"
                    :searchField="searchField"
                    :parentField="parentField"
                    :defaultParentId="defaultParentId"
                    @node-click="onNodeClick"
                    v-model="value"
                >
                </v-base-tree>

            </template>
        </el-popover>
    </div>
</template>

<script>
import VBaseTree from "../VBaseTree";
/**
 * 从远程数据读取，并展示成一个懒加载的树形结构
 */

export default {
    name: "VTree",
    components: {VBaseTree},
    props: {
        /**
         * 数据模型
         */
        model: {
            type: Object,
            required: true
        },
        /**
         * 调用接口时，搜索框内容对应的字段
         */
        searchField: {
            type: String,
            default: 'filter[name]'
        },
        /**
         * 调用接口时，父节点ID的传递字段
         */
        parentField: {
            type: String,
            default: 'filter[parent_id]'
        },

        defaultParentId: {
            type: [String, Number],
            default: '0'
        },

        /**
         * 双向绑定的值
         */
        modelValue: {
        },

        /**
         * 树控件的参数
         */
        treeParams: {
            type: Object,
        }
    },

    computed: {
        config() {
            return Object.assign({
                value: 'id',
                disabled: 'disabled',
                label: 'name',
                children: 'children'
            }, this.treeParams)
        }
    },

    data() {
        return {
            value: this.modelValue,
        }
    },
    watch: {
        modelValue() {
            this.value = this.modelValue
        }
    },
    methods: {

        /**
         * 树节点被点击时的事件，用来触发 update:modelValue 事件
         * @param {object} model 被点击的节点模型
         */
        onNodeClick(model) {
            this.value = model.getSource(this.config.value)
            this.$emit('update:modelValue', this.value)
            this.$emit('update:modelName', model.getValue(this.config.label))
        },
    },
}
</script>

<style scoped>
</style>
