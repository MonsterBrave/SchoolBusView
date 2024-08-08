<template>
<el-container id="home-container">

<el-header>
    <div>
        <span style="vertical-align: middle; color: #fff; font-size: 24px; font-weight: bolder;"> 校车可视化平台    </span>
        <el-tag size="small" style="vertical-align: middle; background-color: #d8e4d3; color: #006400;">测试版</el-tag>
    </div>
</el-header>

<el-main id="map-container">
    <baidu-map
        class="bm-view"
        :center="map.center" 
        :zoom="map.zoom"
        @ready="handler"
        enableWheelZoom>
        <!--通知公告-->
        <div class="circle-container">
            <Tooltip title="运行通知" placement="right">
                <!--div class="circle" @click="goBusNotice"-->
                <el-button style="background-color: #006400;" @click="goBusNotice" circle>
                    <el-icon style="color:#fff"><ChatLineSquare /></el-icon>
                </el-button>
                <!--/div-->
            </Tooltip>
        </div>>
        <!-- 接驳车 -->
        <bm-marker
            v-for="(shuttle, index) in shuttleList"
            :key="index"
            :top="true"
            :position="{ lng: shuttle.lng, lat: shuttle.lat }"
            :rotation="shuttle.direction"
            :icon="{ url:shuttle.icon , size: { width: 20, height: 48 } }"
            @click="infoWindowOpen(index)">
        </bm-marker>
        <!-- 点击接驳车图标，显示车辆详情 -->
        <bm-info-window
            :position="{ lng: shuttleInfo.lng, lat: shuttleInfo.lat }"
            title="接驳车详情" :show="shuttleInfo.show" @close="shuttleInfo.show = false">
            <div style="margin-top:5px;height: 2px; width:100%;background-color: #1981E1 !important;"></div>
            <div style="margin-top:10px;width:220px">  车辆名称：{{ shuttleInfo.vehicleName }}</div>
            <div style="margin-top:5px;width:220px">  车牌号：{{ shuttleInfo.plateNo }}</div>
            <div style="margin-top:5px;width:220px">  时速：{{ shuttleInfo.speed }}km/h</div>
        </bm-info-window>

        <!-- 站点 -->
        <bm-marker
            v-for="(station, index) in stations"
            :key="index"
            :position="{ lng: station.lng, lat: station.lat }"
            :icon="{ url:stationIcon , size: { width: 25, height: 30 } }"
            @click="displayStationInfo(station)">
        </bm-marker>
        <!-- 点击站点图标，显示线路详情 -->
        <el-drawer v-model="stationInfo.show" :show-close="true" size='40%'>
            <template #header="{ titleId, titleClass }">
            <h4 :id="titleId" :class="titleClass">站点信息</h4>
            </template>
            <h2>{{ stationInfo.stationName }}</h2>
                <div v-for="(time,index) in stationInfo.departureTime"
                :key="index">
                    <el-divider />
                    <h5 :id="desc">线路：{{time.routeDesc}}</h5>
                    <div v-if="time.workDayTime.length !== 0">
                        <el-tag size="middle" style="vertical-align: middle; background-color: #d8e4d3; color: #006400;">工作日发车时间</el-tag>
                        <div style="display: flex;">{{ time.workDayTime.join('  ') }}</div>
                    </div>
                    <div v-if="time.holidayTime.length !== 0">
                        <el-tag size="middle" style="vertical-align: middle; background-color: #ffdeb8; color: #cb7f00;">节假日发车时间</el-tag>
                        <div style="display: flex;">{{ time.holidayTime.join('  ') }}</div>
                    </div>
                </div>
        </el-drawer>
              
        <!-- 路线 -->
        <bm-polyline
            v-for="(route,key) in routes"
            :key="key"
            :path="route.route"
            :stroke-color="route.color"
            :stroke-opacity="0.9"
            :stroke-weight="6">
        </bm-polyline>

    </baidu-map>
</el-main>

<footer id="my-footer">
    <div>校研会联合计软智学院、建筑学院学生开发</div>
    <div>支持单位：校长办公室、党委研工部、校团委、总务处、校车队和网信办</div>
</footer>

</el-container>
</template>
    
<script>
import { ElMessage } from 'element-plus';
import{ref} from 'vue';
import {Tooltip} from 'ant-design-vue';
export default {
    name: 'Home',
    data() {
        // const stationInfo=ref( {
        //         show: false,
        //         stationName: "",
        //         stationTime:[
        //             //station中要添加一个routeTime内容形式
        //             // {
        //             //     routeDesc:"",
        //             //     workDayTime:[],
        //             //     holidayTime:[],
        //             // }
        //         ],
        //         content: "运行时刻表+到站信息",
        //     });
        return {
            //stationInfo,
            shuttleLantaiIcon: new URL('../../assets/blueBus.svg', import.meta.url).href,
            shuttleSuyuanIcon: new URL('../../assets/greenBus.svg', import.meta.url).href,
            shuttleXiaoneiIcon:new URL('../../assets/redBus.svg',import.meta.url).href,
            shuttleLinshiIcon:new URL('../../assets/whiteBus.svg',import.meta.url).href,
            stationIcon: new URL('../../assets/station-seu.svg', import.meta.url).href,
            noticeIcon:new URL('../../assets/icon-notice.svg',import.meta.url).href,
            map: {
                center: { lng: 118.82565,lat: 31.893575 },
                zoom: 16,
                show: true,
                dragging: true
            },
            XiaoNeiLineList: [
                //圆环
                {lng:118.826007,lat:31.895176,},
                {lng:118.826438,lat:31.895045},
                {lng:118.82677,lat:31.89493,},
                {lng:118.827139,lat:31.894739},
                {lng:118.827624,lat:31.894486,},
                {lng:118.827903,lat:31.894248,},
                {lng:118.828154,lat:31.893934,},
                {lng:118.828154,lat:31.893934,},
                {lng:118.828567,lat:31.892915},
                {lng:118.828567,lat:31.892516,},
                {lng:118.828531,lat:31.892202,},
                {lng:118.828109,lat:31.891405,},
                {lng:118.828109,lat:31.891405,},
                {lng:118.82713,lat:31.890623},
                {lng:118.826169,lat:31.89034,},
                {lng:118.826169,lat:31.89034,},
                {lng:118.824992,lat:31.890455,},
                {lng:118.824273,lat:31.890715,},
                {lng:118.82368,lat:31.891098,},
                {lng:118.823339,lat:31.891551,},
                {lng:118.823088,lat:31.892018,},
                {lng:118.823088,lat:31.892018,},
                {lng:118.823088,lat:31.892018,},
                {lng:118.822899,lat:31.892639},
                //机械楼
                {lng:118.821587,lat:31.892555},
                {lng:118.820285,lat:31.892516,},
                //橘园
                {lng:118.820357,lat:31.891451},
                {lng:118.820411,lat:31.89083,},
                {lng:118.820411,lat:31.89083,},
                {lng:118.820545,lat:31.889956,},
                {lng:118.820545,lat:31.889956,},
                {lng:118.82103,lat:31.888707,},
                {lng:118.821291,lat:31.888569,},
                {lng:118.82148,lat:31.8885},
                //行政楼
                {lng:118.821695,lat:31.888431,},
                {lng:118.821974,lat:31.888439,},
                {lng:118.825594,lat:31.888577,},
                {lng:118.830912,lat:31.888937,},
                //梅园
                {lng:118.831056,lat:31.889075,},
                {lng:118.831056,lat:31.889075,},
                {lng:118.831559,lat:31.892026,},
                {lng:118.831478,lat:31.892907,},
                {lng:118.831406,lat:31.893873,},
                {lng:118.831136,lat:31.894739,},
                {lng:118.830292,lat:31.89749,},
                {lng:118.830229,lat:31.897536,},
                {lng:118.830229,lat:31.897536,},
                {lng:118.830139,lat:31.897674,},
                {lng:118.830202,lat:31.897828},
                {lng:118.829744,lat:31.899268,},
                {lng:118.829726,lat:31.899429,},
                {lng:118.829555,lat:31.89995},
                {lng:118.82978,lat:31.900027},
                {lng:118.837065,lat:31.900403},
            ],
            stations: [],
            routes: [
                { color: '#006ae6', route: [], description:"", },
                { color: '#387d34', route: [], description:"", },
                { color: '#de4a2e', route: [], description:"", },
                { color: '#92c13d', route: [], description:"", },
            ],
            shuttleList: [],
            /*
            stations: [
                {
                    id: 1,
                    lng:118.831172,  
                    lat: 31.87548,
                    point: { lng:118.831172,  lat: 31.87548, },
                    name: "紫金山实验室",
                    show: false,
                },
                {
                    id: 2,
                    lng:118.82042,
                    lat: 31.883249,
                    point: { lng:118.82042,  lat: 31.883249, },
                    name: "苏源公寓",
                    show: false,
                },
                {
                    id: 3,
                    lng:118.820438,
                    lat: 31.889933,
                    point: { lng:118.820438,  lat: 31.889933, },
                    name: "橘园食堂",
                    show: false,
                },
                {
                    id: 4,
                    lng:118.823609,
                    lat: 31.905576,
                    point: { lng:118.823609,  lat: 31.905576, },
                    name: "兰台公寓",
                    show: false,
                },
            ],
            */
            shuttleInfo: {
                show: false,
                lng: Number,
                lat: Number,
                vehicleName: "",
                plateNo: "",
                speed: "",
            },
            stationInfo:{
                show: false,
                stationName: "",
                stationTime:[
                    //station中要添加一个routeTime内容形式
                    // {
                    //     routeDesc:"",
                    //     workDayTime:[],
                    //     holidayTime:[],
                    // }
                ],
                content: "运行时刻表+到站信息",
            },
        }
    },
    created: function() {
        //console.log("created")
        this.getStationInfo()
        this.getRouteInfo()
        this.getShuttleInfo()
        //this.getStationTime()
        this.interval = setInterval(() =>{ this.getShuttleInfo() },2500)
    },
    mounted: function() {
        //console.log("mounted")
    },
    destroyed(){
        clearInterval(this.interval)
    },
    methods: {
        infoWindowOpen: function(i) {
            //console.log(this.shuttleList[i])
            this.shuttleInfo.lng = this.shuttleList[i].lng
            this.shuttleInfo.lat = this.shuttleList[i].lat
            this.shuttleInfo.vehicleName = this.shuttleList[i].vehicleName
            this.shuttleInfo.plateNo = this.shuttleList[i].plateNo
            this.shuttleInfo.speed = this.shuttleList[i].speed
            this.shuttleInfo.show = true
            //console.log(this.shuttleInfo)
        },
        displayStationInfo: function(station) {
            //console.log(station)
            this.stationInfo.stationName = station.name
            this.stationInfo.departureTime=station.departureTime
            this.stationInfo.show = true
        },
        handler({ BMap, map }) {
            map.setMapStyle({
            //    styleJson:[
            //         {
            //             "featureType": "building",
            //             "elementType": "all",
            //             "stylers": {
            //                 "color": "#ffe599ff",
            //                     "lightness": 2,
            //                     "saturation": 26
            //                 }
            //         },
            //         {
            //             "featureType": "local",
            //             "elementType": "geometry",
            //             "stylers": {
            //                 "color": "#ffe599ff",
            //                 "lightness": 30,
            //                 "saturation": -21
            //             }
            //         },
            //         {
            //             "featureType": "green",
            //             "elementType": "all",
            //             "stylers": {
            //                 "color": "#b6d7a8ff",
            //                 "lightness": 53,
            //                 "saturation": 15
            //             }
            //         },
            //         {
            //             "featureType": "water",
            //             "elementType": "all",
            //             "stylers": {
            //                 "lightness": 30,
            //                 "saturation": -5
            //             }
            //         },
            //         {
            //             "featureType": "land",
            //             "elementType": "all",
            //             "stylers": {
            //                     "color": "#ffffffff",
            //                     "lightness": 100,
            //                     "saturation": -100
            //             }
            //         },
            //         {
            //             "featureType": "educationlabel",
            //             "elementType": "labels.text.fill",
            //             "stylers": {
            //                     "color": "#93c47dff"
            //             }
            //         },
            //         {
            //             "featureType": "education",
            //             "elementType": "all",
            //             "stylers": {
            //                   "color": "#e7f0e3ff"
            //         }
            //         },
            //         {
            //             "featureType": "poilabel",
            //             "elementType": "labels.text.fill",
            //             "stylers": {
            //                     "color": "#38761dff"
            //             }
            //         }
            //    ]
            styleJson:[
            {
                    "featureType": "building",
                    "elementType": "all",
                    "stylers": {
                              "color": "#ffe599ff",
                              "lightness": 2,
                              "saturation": 26
                    }
          },
          {
                    "featureType": "local",
                    "elementType": "geometry",
                    "stylers": {
                              "color": "#ffe599ff",
                              "lightness": 30,
                              "saturation": -21
                    }
          },
          {
                    "featureType": "green",
                    "elementType": "all",
                    "stylers": {
                              "color": "#79a168ff",
                              "lightness": 53,
                              "saturation": 15
                    }
          },
          {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": {
                              "lightness": 30,
                              "saturation": -5
                    }
          },
          {
                    "featureType": "land",
                    "elementType": "all",
                    "stylers": {
                              "color": "#ffffffff",
                              "lightness": 100,
                              "saturation": -100
                    }
          },
          {
                    "featureType": "educationlabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                              "color": "#93c47dff"
                    }
          },
          {
                    "featureType": "education",
                    "elementType": "all",
                    "stylers": {}
          }
            ]
            });
        },

        getStationInfo: function() {
            fetch('/api/station_info')
                .then((res) => res.json())
                .then((response) => {
                    //console.log(response)
                    if (response.code === 1000) {
                        let data = Object.freeze(response.data)
                        //console.log(data)
                        data = data.data
                        for (let i = 0; i < data.length; ++i) {
                            this.stations.push({
                                name:data[i].stationName,
                                lng:Number(data[i].lng),
                                lat:Number(data[i].lat),
                                departureTime:data[i].departureTime
                            })
                        }
                        //console.log(this.stations)
                    }
                    else {
                        ElMessage.error('response.code错误！')
                    }
                });
        },
        //获取路线时间
        getStationTime:function(){
            //http://1.13.169.31/api/departure_time
            fetch('/api/departure_time')
            .then((res) => res.json())
                .then((response) => {
                    //console.log(response)
                    if (response.code === 1000) {
                        let data = Object.freeze(response.data)
                        //console.log(data)
                        data = data.data
                        for (let i = 0; i < data.length; ++i) {
                            //遍历stations
                            let existStation= this.stations.find(station => station.name === data[i].stationName);
                            //console.log(existStation)
                                if (existStation) {
                                if (!existStation.stationTime) {
                                    let stationtime=[];
                                    stationtime.push({
                                        routeDesc:data[i].routeDesc,
                                        workDayTime:data[i].workDayTime,
                                        holidayTime:data[i].holidayTime,
                                    })
                                    existStation.stationTime=stationtime;
                                } else {
                                    existStation.stationTime.push({
                                        routeDesc:data[i].routeDesc,
                                        workDayTime:data[i].workDayTime,
                                        holidayTime:data[i].holidayTime,
                                    }
                                    )
                                }
                            }
                            //console.log(this.stations)
                            // for(let j=0;j<this.stations.length;++j){
                            //     if(data[i].stationName === this.stations[j].name){
                            //         this.stations[j].
                            //     }
                            // }
                            // this.stationsTime.push({
                            //     stationname:data[i].stationName,
                            //     routeDesc:data[i].routeDesc,
                            //     workDayTime:data[i].workDayTime,
                            //     holidayTime:data[i].holidayTime,
                            // })
                        }
                        //console.log(this.stations)
                    }
                    else {
                        ElMessage.error('response.code错误！')
                    }
                });
        },
        getRouteInfo: function() {
            fetch('/api/route_info')
                .then((res) => res.json())
                .then((response) => {
                    //console.log(response)
                    if (response.code === 1000) {
                        let data = Object.freeze(response.data)
                        //console.log(data)
                        data = data.data
                        for (let i = 0; i < data.length; ++i) {
                            this.routes[i].description = data[i].routeDesc
                            let route_new = []
                            for (let j = 0; j < data[i].lat.length; ++j) {
                                route_new.push({ lng:Number(data[i].lng[j]), lat:Number(data[i].lat[j])})
                            }
                            this.routes[i].route = route_new
                        }
                        //console.log(this.routes)
                    }
                    else {
                        ElMessage.error('response.code错误！')
                    }
                });
        },
        getShuttleInfo: function() {
            //var url = new URL("http://1.13.169.31/api/data/");
            //fetch('/api/data?t=${new Date().getTime()}')
            fetch('/api/data')
                .then((res) => res.json())
                .then((response) => {
                    //console.log(response)
                    if (response.code === 1000) {
                        /*ElMessage({
                            message: 'response.code === 1000',
                            type: 'success',
                        })*/
                        let data = Object.freeze(response.data)
                        //console.log(data)
                        data = data.data
                        let shuttleList_in = []
                        for (let i = 0; i < data.length; ++i) {
                            let shuttleIcon;
                            if (data[i].vehicleName === '兰台接驳车') {
                                shuttleIcon = this.shuttleLantaiIcon;
                            }
                            else if(data[i].vehicleName === '校内接驳车'){
                                shuttleIcon = this.shuttleXiaoneiIcon;
                            }
                            else if(data[i].vehicleName === '苏源接驳车'){
                                shuttleIcon = this.shuttleSuyuanIcon;
                            }
                            else {
                                shuttleIcon = this.shuttleLinshiIcon;
                            }
                            shuttleList_in.push({
                                index: i,
                                vehicleName: data[i].vehicleName,
                                plateNo: data[i].plateNo,
                                speed: data[i].speed,
                                lng: Number(data[i].lng),
                                lat: Number(data[i].lat),
                                direction: Number(data[i].direction),
                                icon: shuttleIcon,
                                show:false,
                            })
                        }
                        this.shuttleList = shuttleList_in
                        //console.log(this.shuttleList)
                    }
                    else {
                        ElMessage.error('response.code错误！')
                    }
                });
        },
        goBusNotice() {
            window.location.href = 'https://zwc.seu.edu.cn/2023/1110/c4297a471847/page.htm'
        },

        ready({ BMap, map}){
            //起点标注
            var point = new BMap.Point(118.823227,31.904503)
            var marker = new BMap.Marker(point)    
            //var myIcon = new BMap.Icon(qidian, new BMap.Size(48, 48)) 
            //var marker = new BMap.Marker(point, { icon: myIcon }) // 创建标注   
            map.addOverlay(marker) // 将标注添加到地图中


            //终点标注
            var point2 = new BMap.Point(118.820352,31.892516)
            var marker2 = new BMap.Marker(point2)   
            //var myIcon2 = new BMap.Icon(zhong, new BMap.Size(48, 48)) 
            //var marker2 = new BMap.Marker(point2, { icon: myIcon2 }) // 创建标注  

            map.addOverlay(marker2) // 将标注添加到地图中

            //设置轨迹样式
            var array=[];

            this.lineList.forEach(Element=>{
                array.push(new BMap.Point(Element.lng, Element.lat))
            })


            var polyline = new BMap.Polyline(array, 
            {strokeColor:"red", strokeWeight:5, strokeOpacity:0.5});
            map.addOverlay(polyline);

        },
    },
}
</script>

<style scoped>
#home-container {
    width: 100vw;
    height: 100vh;
    margin: 0%;
    padding: 0%;
}

.el-header{
    height: 45px;
    white-space: pre;
    background-color: #0e420e;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 8px;
    align-items: center;
}
#map-container {
    width: 100%;
    height: 100%;
    margin: 0%;
    padding: 0%;
}
.bm-view {
    width: 100%;
    height: 100%;
}

/*
.el-footer{
    height: 35px;
    display: flex;
    white-space: pre;
    justify-content: space-between;
    align-items: center;
    background-color: #0e420e;
    color: #fff;
    font-size: 15px;
    padding-left: 8px;
    padding-right: 8px;
}*/
#my-footer{
    background-color: #0e420e;
    color: #fff;
    font-size: 12px;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 2px;
    padding-bottom: 2px;
}
#desc{
    color:darkgreen;
    text-align: left;
}
#btn{
    position: relative;
    right: 10px;
    top: 10px;
}
.circle {
  width: 30px;
  height: 30px;
  background-color: #0e420e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.circle-container {
  position: fixed;
  top: 50px;
  left: 20px;
  display: flex;
  flex-direction: column;
  z-index: 999;
}
</style>