<template>
    <div class="action-container" v-if="actionList.length > 0">
        <template v-if="actionList.length <= mergeCount">
            <el-button
                v-for="(item, index) of actionList"
                :key="index"
                v-bind="item.options || {}"
                round
                type="primary"
                :plain="index === 1"
                @click="onActionClick(item)"
            >
                {{item.name}}
            </el-button>
        </template>
        <template v-else>
            <template v-for="(item, index) of actionList">
                <el-button
                    :key="index"
                    v-if="index < mergeCount"
                    v-bind="item.options || {}"
                    type="primary"
                    round
                    @click="onActionClick(item)"
                >
                    {{item.name}}
                </el-button>
            </template>
            <el-dropdown class="ml-1" @command="onActionClick" trigger="click">
                <el-button round>
                    更多
                    <v-icon icon="icon-down-1"></v-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <template
                            v-for="(item, index) of actionList"
                        >
                            <el-dropdown-item
                                :key="index"
                                v-if="index >= mergeCount"
                                :command="item"
                            >
                                {{item.name}}
                            </el-dropdown-item>
                        </template>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </template>
    </div>
</template>

<script>
import VIcon from "./VIcon";
export default {
    name: "VTableAction",
    components: {VIcon},
    props: {
        actionList: {
            type: Array,
            required: true,
        },
        mergeCount: {
            type: Number,
            default: 2
        }
    },
    methods: {
        onActionClick(item) {
            this.$emit('action-click', item)
        }
    }
}
</script>

<style scoped>

</style>