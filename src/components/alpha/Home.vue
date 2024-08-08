<template>
    <!--div id="container">
        <baidu-map
    class="bm-view"
    :center="{ lng: 116.404, lat: 39.915 }" 
    :zoom="1"
    enableWheelZoom
    >
    <div>QQQQQQQQQQQQQQQQQQQ</div>
    </baidu-map>
    </div--> 
    <div id="container">
    <baidu-map
        class="bm-view"
        :center="map.center" 
        :zoom="map.zoom"
        @ready="handler"
        enableWheelZoom>

        <bm-marker
            v-for="(shuttle, index) in shuttleList"
            :key="index"
            :top="true"
            :position="{ lng: shuttle.lng, lat: shuttle.lat }"
            :icon="{ url:imgSrc , size: { width: 50, height: 50 } }"
            @click="displayShuttleInfo(shuttle)">
            <!--bm-info-window
                :show="shuttle.show"
                title="校车详情"
                :position="{ lng: shuttle.lng, lat: shuttle.lat }"
                @close="infoWindowClose(shuttle)">
                <div>
                    <div style="margin-top:5px;height: 2px; width:100%;background-color: #1981E1 !important;"></div>
                    <div style="margin-top:10px;width:220px">  类型：{{ shuttle.vehicleName }}</div>
                    <div style="margin-top:5px;width:220px">  车牌号：{{ shuttle.plateNo }}</div>
                    <div style="margin-top:5px;width:220px">  速度：{{ shuttle.speed }}km/h</div>
                </div>
	        </bm-info-window-->
        </bm-marker>
        <el-drawer
            v-model="shuttleInfo.show"
            title="接驳车信息"
            direction="btt">
            <div>
                <!--div style="margin-top:5px;height: 2px; width:100%;background-color: #1981E1 !important;"></div-->
                <div>  类型：{{ shuttleInfo.vehicleName }}</div>
                <div>  车牌号：{{ shuttleInfo.plateNo }}</div>
                <div>  速度：{{ shuttleInfo.speed }}km/h</div>
            </div>
        </el-drawer>
        
        <!--路书-->
        <!--bml-lushu :path="lushuPath" :icon="icon" :speed="speed" :content="powerSips" :rotation="true">
        </bml-lushu-->
        <!--轨迹-->
        <!--new-polyline :path="polylinePath" :editing="false" :icons="icons" stroke-color="#8ba0fb" :stroke-opacity="1" :stroke-weight="8" @lineupdate="updatePolylinePath"></new-polyline-->
        
        <!--行驶路线没画完-->
        <bm-polyline
            :path="LanTaiLineList"
            stroke-color=#000080
            @click="displayLine=true"
            :stroke-opacity="0.5"
            :stroke-weight="5">
        </bm-polyline>
        <el-drawer
            v-model="displayLine"
            title="路线信息"
            direction="ltr">
            <div>
                <el-timeline mode="horizontal">
                    <el-timeline-item timestamp="">兰台</el-timeline-item>
                    <el-timeline-item timestamp="">北门转盘（西北角）</el-timeline-item>
                    <el-timeline-item timestamp="">图书馆北</el-timeline-item>
                    <el-timeline-item timestamp="">纪忠楼</el-timeline-item>
                    <el-timeline-item timestamp="">图书馆北（东侧）</el-timeline-item>
                    <el-timeline-item timestamp="">北门转盘（东南角）</el-timeline-item>
                    <el-timeline-item timestamp="">兰台</el-timeline-item>
                </el-timeline>
            </div>
        </el-drawer>
        <bm-polyline
            :path="SuYuanLineList"
            stroke-color=#1c6f29
            :stroke-opacity="0.5"
            :stroke-weight="5">
        </bm-polyline>
        <bm-polyline
            :path="XiaoNeiLineList"
            stroke-color=#EEAD0E
            :stroke-opacity="0.5"
            :stroke-weight="5">
        </bm-polyline>
        <!--绘制CSV线路:SUN-->
        <!--bm-polyline :path="CSVList" stroke-color="red" :stroke-opacity="0.5" :stroke-weight="5"></bm-polyline-->
        
        <!-- 起点终点 -->
        <!--bm-marker :position="startPoint" :dragging="true" @click="infoWindowOpen">
            <bm-label content="起点"
                    :labelStyle="{ color: 'black', fontSize: '16px' }"
                    :offset="{ width: -35, height: 30 }" 
            />
        </bm-marker>
        <bm-marker :position="endPoint" :dragging="true" @click="infoWindowOpen">
            <bm-label content="终点" 
                    :labelStyle="{ color: 'black', fontSize: '16px' }"
                    :offset="{ width: -35, height: 30 }" 
            />
        </bm-marker-->
        <!--div v-for="countryId in Object.keys(countryList)" :key="countryId">
            <div v-for="event in countryList[countryId]" :key="event.eventId">
                <bm-marker
                :point="{ lng: event.lng, lat: event.lat }"
                :enableDragging="false"
                @click="infoWindowOpen"
                ></bm-marker>
                <bm-label :content="event.eventName" :position="{ lng: event.lng, lat: event.lat }" :labelStyle="{color: 'red', fontSize : '24px'}" title="Hover me"/>
            </div>
        </div-->

        <!-- 显示站点信息 -->
        <bm-marker
            v-for="event in events"
            :key="event.id"
            :position="event.point"
            @click="display(event)">
        </bm-marker>
        <el-drawer
            v-model="drawer"
            title="站点信息"
            direction="btt">
            <span>{{drawer_event_name}}</span>
        </el-drawer>

    </baidu-map>
    </div>
    
</template>
    
<script>
import { ElMessage } from 'element-plus'
import iconBus from '../../assets/bus.png'
export default {
    name: 'Home',
    data() {
        return {
            displayLine: false,
            CSVList:[],
            imgSrc: new URL('../../assets/bus.png', import.meta.url).href,
            map: {
                center: { lng: 118.82565,lat: 31.893575 },
                zoom: 17,
                show: true,
                dragging: true
            },
            LanTaiLineList:[
                { lng:118.823609, lat: 31.905576},
                { lng:118.823285, lat: 31.904357},
                { lng:118.823294, lat: 31.903353},
                { lng:118.823743, lat: 31.902012},
                { lng:118.824561, lat: 31.900794},
                { lng:118.824961, lat:31.900129},
                { lng:118.829434, lat:31.900397},
                { lng: 118.829645, lat: 31.899714 },
                { lng: 118.830341, lat: 31.897697 },
                {lng:118.830422,lat:31.897544},
                {lng:118.830134 ,lat: 31.897582},
                {lng:118.82841 ,lat:31.89726 },
                {lng:118.825814,lat:31.897138  },
                {lng:118.826011 ,lat:31.895191  },
                {lng:118.826011 ,lat: 31.895191},
                {lng:118.826918 ,lat:31.894777 },
                {lng: 118.82743,lat: 31.894516},
                {lng: 118.827951,lat: 31.894003},
                {lng: 118.828239,lat: 31.893528},
                {lng:118.828383,lat: 31.893183},
                {lng:118.828437 ,lat:31.892876 },
                {lng:118.828455,lat:31.892493 , },
                {lng:118.828392,lat: 31.892209 },
                {lng: 118.828302,lat:31.891987, },
                {lng: 118.828203,lat: 31.891796},
                {lng: 118.828032,lat:31.891489 },
                {lng: 118.827763,lat:31.89119 },
                {lng: 118.827511,lat:31.890975, },
                {lng: 118.827179,lat:31.890761 },
                {lng:118.826676,lat: 31.8906 },
                {lng:118.82585 ,lat:31.890439 },
                {lng:118.825068,lat: 31.890516 ,},
                {lng:118.824484,lat:31.890715 , },
                {lng:118.824134,lat:31.890914 , },
                {lng: 118.824134,lat: 31.890914,},
                {lng: 118.823289,lat:31.891842, },
                {lng:118.822975 ,lat: 31.892646},
                {lng:118.822921 ,lat: 31.892731},
                {lng: 118.821592,lat:31.892646, },
                {lng: 118.820693,lat:31.892639, },
            ],
            SuYuanLineList:[
                { lng:118.831172, lat:31.875283,},
                { lng:118.828275, lat:31.875314, },
                { lng:118.824934, lat:31.875341 },
                { lng:118.824058, lat:31.876743},
                { lng:118.821565, lat:31.8804 },
                { lng:118.819638, lat:31.884999 },
                { lng:118.818102, lat:31.889498 },
                { lng:118.817626, lat:31.892549,},

                { lng:118.818663, lat:31.892553 },
                { lng:118.81887,  lat:31.892507 },
                { lng:118.820276, lat:31.892534 },
                { lng:118.820307, lat:31.89143 },
                { lng:118.820343, lat:31.890629,},
                { lng:118.820478, lat:31.889954,},
            ],
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
            shuttleList: [],
            /*shuttleList:[
                { index:0, plateNo:"苏A01140D", vehicleName:"", speed:Number, lng:Number, lat:Number, show:false },
                { index:1, plateNo:"苏A01977D", vehicleName:"", speed:Number, lng:Number, lat:Number, show:false },
                { index:2, plateNo:"苏A04508D", vehicleName:"", speed:Number, lng:Number, lat:Number, show:false },
                { index:3, plateNo:"苏A06517D", vehicleName:"", speed:Number, lng:Number, lat:Number, show:false },
            ],*/
            infoWindow:{
                name: "",
                lng: Number,
                lat: Number,
                show: false,
            },
            countryList:{
                "SuYuanSation":[
                    {
                        "eventId":1,
                        "eventName":"紫金山实验室",
                        "lng":118.82042,
                        "lat":31.883249
                    },
                    {
                        "eventId":2,
                        "eventName":"苏源公寓",
                        "lng":118.831172,
                        "lat":31.87548
                    },
                    {
                        "eventId":3,
                        "eventName":"橘园食堂",
                        "lng":118.820438,
                        "lat":31.889933
                    }
                ],
                "LanTaiStation":[
                    {
                        "eventId":1,
                        "eventName":"兰台公寓",
                        "lng":118.823609,
                        "lat":31.905576
                    }
                ]
                
            },
            events: [
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
            drawer: false,
            drawer_event_name: "",
            iconBus,
            shuttleInfo: { show:false, vehicleName:'', plateNo:'', speed:Number },
        }
    },
    created: function() {
        console.log("created")
        console.log(this.shuttleList)
        this.getOneBusInfo()
        //CSV数据:SUN
        //this.csvGet()
    
        //this.shuttleList = []
        this.interval = setInterval(() =>{ this.getOneBusInfo() },5000)
        
    },
    mounted: function() {
        console.log("mounted")

        //this.interval = setInterval(() =>{ this.getOneBusInfo() }, 5000)
    },
    destroyed(){
        clearInterval(this.interval)
    },
    methods: {
        handler({ BMap, map }) {
            map.setMapStyle({
                styleJson:[[{
                    "featureType": "road",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#000000ff"
                    }
                }]]
            });
        },
        getOneBusInfo: function() {
            //var url = new URL("http://1.13.169.31/api/data/");
            fetch('/api/data')
                .then((res) => res.json())
                .then((response) => {
                    //console.log(response)
                    if (response.code === 1000) {
                        ElMessage({
                            message: 'response.code === 1000',
                            type: 'success',
                        })
                        let data = Object.freeze(response.data)
                        //console.log(data)
                        data = data.data
                        let shuttleList_in = []
                        for (let i = 0; i < data.length; ++i) {
                             shuttleList_in.push({ index:i, vehicleName:data[i].vehicleName, plateNo:data[i].plateNo, speed:data[i].speed, lng:Number(data[i].lng), lat:Number(data[i].lat), show:false })
                        }
                        this.shuttleList = shuttleList_in
                        /*for (let i = 0; i < data.length; ++i) {
                            this.shuttleList[i].lng = data[i].lng
                            this.shuttleList[i].lng = Number(data[i].lng)
                            this.shuttleList[i].lat = Number(data[i].lat)
                            this.shuttleList[i].speed = Number(data[i].speed)
                        }*/
                        console.log(this.shuttleList)
                    }
                    else {
                        ElMessage.error('response.code错误！')
                    }
                });
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

        // 测试bm-detail
        // 点击点坐标赋值
        lookDetail(index){
            console.log("lookDetail")
            //this.infoWindow.name = '测试校车'
            //this.infoWindow.lng = Number(shuttle.lng)
            //this.infoWindow.lat = Number(shuttle.lat)
            //this.infoWindow.show = true
            //console.log(this.infoWindow.lng)
            //console.log(this.infoWindow.lat)
            //
            //shuttle.show = true
            this.shuttleList.forEach((s) => (s.show = false));
            this.shuttleList[index].show = true
            console.log(this.shuttleList[index].plateNo)
        },
        // 关闭弹窗
        infoWindowClose(index) {
            console.log("infoWindowClose")
            //shuttle.show = false
            //console.log(shuttle.plateNo)
            this.shuttleList[index].show = false
            console.log(this.shuttleList[index].plateNo)
        },
        // 打开弹窗
        infoWindowOpen(index) {
            console.log("infoWindowOpen")
            this.shuttleList[index].show = true
            console.log(this.shuttleList[index].plateNo)
        },
        
        toggleInfo(event) {
            console.log(event)
            //this.events.forEach((e) => (e.show = false));
            setTimeout(() => (event.show = true), 100);
        },
        closeInfo(event) {
            event.show = false;
        },
        display: function(event) {
            console.log(event)
            /*ElMessage({
                message: event.name,
                type: 'success',
            })*/
            this.drawer_event_name = event.name
            this.drawer = true
        },
        displayShuttleInfo: function(shuttle) {
            this.shuttleInfo.plateNo = shuttle.plateNo
            this.shuttleInfo.vehicleName = shuttle.vehicleName
            this.shuttleInfo.speed = Number(shuttle.speed)
            this.shuttleInfo.show = true
        },
        //csv数据绘制：SUN
        csvGet(){
            let record=JSON.parse(localStorage.getItem("lineCSV"))
            for (let i = 0; i < record.length; ++i) {
                console.log('get')
                //纠偏：SUN
                // let x_PI=3.14159265358979324 * 3000.0 / 180.0;
                // let datalng = Number(record[i].lng);
                // let datalat = Number(record[i].lat);
                // let z = Math.sqrt(datalng * datalng + datalat * datalat) + 0.00002 * Math.sin(datalat * x_PI)
                // let theta = Math.atan2(datalat, datalng) + 0.000003 * Math.cos(datalng * x_PI)
                // let bd_lng = z * Math.cos(theta) + 0.0065
                // let bd_lat = z * Math.sin(theta) + 0.006
                // console.log('lng:',bd_lng)
                // console.log('lat:',bd_lat)

                //this.CSVList.push({ lng:bd_lng, lat:bd_lat });
                //未纠偏
                this.CSVList.push({ lng:Number(record[i].lng), lat:Number(record[i].lat) });
            }
        }

    },
}
</script>


<style scoped>
#container {
  width: 75vw;
  height: 100vh;
}
.bm-view {
  width: 100%;
  height: 100%;
}
#fontleft{
    text-align: left;
    font-size: medium;
}
</style>