<template>
    <div class="height-100">
        <v-table :data-provider="dataProvider"></v-table>
    </div>
</template>

<script>
import VTable from "../../components/VTable"
import UserList from "../../models/listModels/UserList"
export default {
    name: "index",
    components: {VTable},
    data() {
        return {
            dataProvider: new UserList()
        }
    }
}
</script>

<style scoped>

</style>