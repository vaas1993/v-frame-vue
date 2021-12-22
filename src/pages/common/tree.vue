<template>
    <div>
        <div class="text-extra-large text-bold mb-2">
            概述
        </div>
        用清晰的层级结构展示信息，数据通过远程接口懒加载，可展开或折叠。

        <div class="mt-4">

        </div>
        <v-tree
            :model="model"
            v-model="tree"
        ></v-tree>
    </div>
</template>

<script>
import VTree from "../../components/forms/VTree";
import Tree from '../../models/dataModels/Tree'
export default {
    name: "tree",
    components: {VTree},
    data() {
        return {
            model: new Tree(),
            tree: 1
        }
    },
}
</script>

<style scoped>

</style>