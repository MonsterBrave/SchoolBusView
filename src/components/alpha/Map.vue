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
export default {
    name: 'Map',
    data() {
        return {
            map: {
                center: { lng:118.82565, lat:31.893575 },
                zoom: 17,
                show: true,
                dragging: true
            },
        }
    },
};  
</script>
