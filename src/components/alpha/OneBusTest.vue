<template>
    <h1>测试！</h1>
    
    <el-button plain class="button" v-on:click="getLineInfo()">路线信息</el-button>
    <el-button plain class="button" v-on:click="getOneBusInfo()">单个校车信息</el-button>
    <input type="file" @change="handleFileUpload">
</template>

<script>
import { ElMessage } from 'element-plus';
import {ref} from 'vue';
import Papa from 'papaparse'
export default {
    name: 'OneBusInfo',
    data() {
        return {
            stationMapList:[],
            //线路点从csv获取
            linePoint:[],

        }
    },
    methods: {
        handleFileUpload(event) {
            //清除localStorage:SUN
            //localStorage.clear();
            window.localStorage.removeItem("lineCSV")

            // 获取用户选择的文件
            const file = event.target.files[0];

            // 创建一个新的FileReader对象
            const reader = new FileReader();

            // 监听文件读取完成事件
            reader.onload = () => {
                // 将读取的文件内容传递给处理CSV数据的函数
                this.parseCSVData(reader.result);
            };

            // 读取文件内容
            reader.readAsText(file);
        },

        parseCSVData(data) {
            // 解析CSV文件内容，并将其转换为对应的数据结构
            // 例如，将CSV中的每一行转换为一个对象

            console.log("data")
            console.log(data)

            const rows = data.split('\n');
            const headers = rows[0].split(',');
            const csvData = [];

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i].split(',');
                const rowData = {};

                for (let j = 2; j < headers.length; j++) {
                    rowData[headers[j]] = row[j];
                }

                csvData.push(rowData);
            }

            // 在控制台中打印CSV数据
            //console.log(csvData);
            window.localStorage.removeItem("lineCSV")
            window.localStorage.setItem("lineCSV", JSON.stringify(csvData))
            console.log("lineCSV")
            console.log(JSON.parse(window.localStorage.getItem("lineCSV")))
        },
        getOneBusInfo: function() {
            //var url = new URL("http://1.13.169.31/api/data/");
            fetch('/api/data')
                .then((res) => res.json())
                .then((response) => {
                    console.log(response)
                    if (response.code === 1000) {
                        ElMessage({
                            message: 'response.code === 1000',
                            type: 'success',
                        })
                        let data = response.data
                        console.log(data)
                        if (data.code === 100) {
                            ElMessage({
                                message: 'response.data.code === 100',
                                type: 'success',
                            })
                            data = data.data
                            for (let i = 0; i < data.length; ++i) {
                                
                                this.stationMapList.push({ lng:data[i].lng, lat:data[i].lat });
                            }
                            console.log(this.stationMapList)
                        }
                        else {
                            ElMessage.error('response.data.code错误！')
                        }
                    }
                    else {
                        ElMessage.error('response.code错误！')
                    }
                });
        },
        getLineInfo: function(){
            console.log("getin");
            const csvData=ref([]);
            Papa.parse('.\\data.csv',{
                download:true,
                header:true,
                complete:(results)=>{
                   console.log("getin");
                   this.linePoint=results.data;
                }
            });
            console.log(this.linePoint);
        }   
    },
}
</script>

<style scoped>

</style>