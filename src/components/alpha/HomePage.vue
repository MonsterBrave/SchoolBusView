<template>
<el-row>
    <el-col :span="6">
        <RouteMenu/>
        <router-view/>
        <!--h1 class="mb-2">校车可视化平台</h1-->
        <!--el-menu
            class="el-menu-vertical-demo">
            <el-sub-menu index="1">
                <template #title>
                    <span>查看接驳车路线详情</span>
                </template>
                <el-menu-item index="1-1">校内接驳车</el-menu-item>
                <el-menu-item index="1-2">校内接驳车（限行时段）</el-menu-item>
                <el-menu-item index="1-3">苏源研究生公寓接驳车</el-menu-item>
                <el-menu-item index="1-4">兰台研究生公寓接驳车</el-menu-item>
                <el-menu-item index="1-5">无线谷接驳车</el-menu-item>
            </el-sub-menu>
        </el-menu-->
        <!--a href="" @click.prevent="comName = 'RouteMenu'">选择路线</a>
        <a href="" @click.prevent="comName = 'RouteInfo'">路线信息</a>
        <a href="" @click.prevent="comName = 'StationInfo'">站点信息</a>
        <component :is="comName"></component-->
    </el-col>
    <el-col :span="18">
        <Home />
    </el-col>
</el-row>
</template>

<script>
import RouteMenu from './RouteMenu.vue'
import ShuttleRoute from './ShuttleRoute.vue'
import Map from './Map.vue'
import Home from './Home.vue'
export default {
    name: 'HomePage',
    components: {
        RouteMenu,
        ShuttleRoute,
        Map,
        Home
    },
    data() {
        return {  
            comName: 'RouteMenu'
        };
    },
};
</script>
