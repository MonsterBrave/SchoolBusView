<template>
<div id="container">
    <baidu-map
        class="bm-view"
        :center="map.center" 
        :zoom="map.zoom"
        @ready="handler"
        enableWheelZoom>
    </baidu-map>
</div>
</template>
    
<script>
//import { Edit, Picture, Upload } from '@element-plus/icons-vue'
export default {
    name: 'Home',
    data() {
        return {
            map: {
                center: { lng:118.82565, lat:31.893575 },
                zoom: 16,
                show: true,
                dragging: true
            },
        }
    },
    methods: {
        handler({ BMap, map }) {
            /*
            map.setMapStyleV2({
                styleJson:[[{
                    "featureType": "road",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#000000ff"
                    }
                }]]
            });*/
        },
    },
}
</script>


<style scoped>
#container {
  width: 100vw;
  height: 100vh;
}
.bm-view {
  width: 100%;
  height: 100%;
}
</style>