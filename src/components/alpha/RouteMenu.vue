<template>
    <el-menu
        class="el-menu-vertical-demo"
        router
        @open="handleOpen"
        @close="handleClose">
        <el-sub-menu index="1">
            <template #title>
                <!--el-icon><location /></el-icon-->
                <span>查看接驳车路线详情</span>
            </template>
            <el-menu-item index="/">校内接驳车</el-menu-item>
            <el-menu-item index="1-2">校内接驳车（限行时段）</el-menu-item>
            <el-menu-item index="1-3">苏源研究生公寓接驳车</el-menu-item>
            <el-menu-item index="1-4">兰台研究生公寓接驳车</el-menu-item>
            <el-menu-item index="1-5">无线谷接驳车</el-menu-item>
        </el-sub-menu>
    </el-menu>
    <!--el-button plain class="button" v-on:click="chooseRoute()">校内接驳车</el-button-->
</template>

<script>
export default {
    name: 'RouteMenu',
    methods: {
        chooseRoute: function() {
            //
        }
    }
}
</script>