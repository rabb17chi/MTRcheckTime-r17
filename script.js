// 此JavaScript 作用於 輸入欄的區域

import { bigData } from "./scripts/usefulData/stationName.js"

const checkFun = async () => {
    console.clear()
    console.log('--- new check ---')

    const lineInput = document.getElementById('line-selection').value
    const stationInput = document.getElementById('station-selection').value
    if (lineInput=='' || stationInput=='') {
        console.log('please enter both information.')
        return
    }
    let url = `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${lineInput}&sta=${stationInput}`
    const res = await fetch(url)
    .then(res=>res.json())
    .then(data=>data.data)
    if (res.status == 0 ) {
        console.log('please check ur input again!')
        return
    }

    const infoContainer = document.getElementById('trains-info-container')
    infoContainer.innerHTML = ''

    const stationInfo = res[`${lineInput}-${stationInput}`] 
    console.log(`${stationInput} station`,stationInfo)

    const downList = stationInfo.DOWN || []
    const upList = stationInfo.UP || []

    infoContainer.innerHTML+= `<div id='down-end-list'></div>`
    downList.map((item,index)=>{
        const status = calculateTimeDiff(item.time,stationInfo['curr_time'])
        
        const DEL = document.getElementById('down-end-list')
        DEL.innerHTML += `<p>${index+1}: 終點站：<b>${bigData[item.dest]}</b>, ${status}</p>`
    })

    infoContainer.innerHTML+=`<hr /> <div id='up-end-list'></div>`
    upList.map((item,index)=>{
        const status = calculateTimeDiff(item.time,stationInfo['curr_time'])

        const UEL = document.getElementById('up-end-list')
        UEL.innerHTML += `<p>${index+1}: 終點站：<b>${bigData[item.dest]}</b>, ${status}</p>`
    })
}
document.getElementById('checkBtn').addEventListener('click',checkFun)


// 此函數用於計算 現時 - 列車到站 的時間差, 從而改變status輸出
export function calculateTimeDiff(trainTime,currentTime) {
     const trainMin = new Date(trainTime).getMinutes()
        const currTime = new Date(currentTime).getMinutes()
        let status;
        if (trainMin === currTime) {
             status = '已到站，請等候下一班列車。'
        }
        if (trainMin > currTime) {
             status = `將於 ${trainMin-currTime} 分鐘後到達。`
        } else if (trainMin < currTime) {
             status = `將於 ${trainMin+60-currTime} 分鐘後到達。`
        }
        return status
}