// 此JavaScript的功能均作用於地圖上

import { bigData } from "../usefulData/stationName.js"
import { lineData } from "../usefulData/lineName.js"
import { calculateTimeDiff } from "../../script.js"
import { lineColor } from "../usefulData/lineColor.js"
import { stationFullName } from "../usefulData/stationFullName.js"

const mapInfoContainer = document.getElementById('mapBtnInfoContainer')
const circlesOptions = document.querySelectorAll('.station-btn')
let modeSelection = document.querySelectorAll("input[name='MapFunction']")
let mapFunction = 'checkTime' // map default function-> time checking
let opened = false;

let startStation = '';
let endStation = '';

let adultFare = ''
let childFare = ''

const CSV_URL = '../../resources/MTR_LINES-fares.csv'

document.getElementById('resetButton').addEventListener('click',()=>{
        startStation =''
        endStation =''
        console.log('Station selects are reset, please select 2 stations again.')
        document.getElementById('priceHolder').style.display = 'none'
        return false
})

modeSelection.forEach(item=>{
    item.addEventListener('click',()=>{
        mapFunction = item.value
        document.getElementById('now-method').textContent = (mapFunction === 'checkTime' ? 'Check Train Time' : 'Check Price')
        console.log('clicked, Mode is:', mapFunction)
    })
})

function closeContainer() {
    mapInfoContainer.style.display ='none'
mapInfoContainer.innerHTML=''
}

circlesOptions.forEach(item=>{ 
    let styleArr = []
    const stationLineArray = [...item.classList].filter(item=>item != 'station-btn') // get lines array
    const count = stationLineArray.length // number of lines that station has
    stationLineArray.map(item=> {
        styleArr.push(lineColor[item])
    })

    if (count == 1) {
        item.style['background'] = styleArr[0]
        return
    }
    if (count == 2) {
        item.style['background'] = `conic-gradient(${styleArr[0]} 0deg, ${styleArr[0]} 180deg,
                                                   ${styleArr[1]} 180deg, ${styleArr[1]} 360deg)`
        return
    }
    if (count == 3) {
        item.style['background'] = `conic-gradient(${styleArr[0]} 0deg, ${styleArr[0]} 120deg,
                                                     ${styleArr[1]} 120deg, ${styleArr[1]} 240deg,
                                                      ${styleArr[2]} 240deg, ${styleArr[2]} 360deg)`
        return
    }
    if (count == 4) {
        item.style['background'] = `conic-gradient(${styleArr[0]} 0deg, ${styleArr[0]} 90deg,
                                                     ${styleArr[1]} 90deg, ${styleArr[1]} 180deg,
                                                     ${styleArr[2]} 180deg,${styleArr[2]} 270deg,
                                                      ${styleArr[3]} 270deg, ${styleArr[3]} 360deg)`
        return
    }
    }
)

async function loadCSV(url) {
    try {
        const res = await fetch(url);
        let data = await res.blob();
        Papa.parse(data, {
            complete: result => {
                getFares(result.data)
            }
        });
    } catch (error) {
        console.error('Message:',error)
    }
}
function getFares(dataSet) {
    dataSet.map( item =>{
        if (item[0] === stationFullName[startStation] && item[2] === stationFullName[endStation]) {
            console.log(`${bigData[startStation]} --> ${bigData[endStation]}\nAdult with Octopus', $${item[4]}; Child with Octopus, $${item[6]}`)
            return item
        }
        return false
    })
}

circlesOptions.forEach(item=>{
    item.addEventListener('click',async () => {

        let msg = ''
        mapInfoContainer.innerHTML = ''
        const BtnOfStationName = item.id

        // Check Train Time function [1 button only]
        if (mapFunction === 'checkTime') {
            const BtnOfStationLine = [...item.classList].filter(item=>item != 'station-btn') // filter the classList, remove 'station-btn', this class is uselss in this block.
            BtnOfStationLine.map(async(item,index)=>{ // loop every line to fetch trains-data
                let url = `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${item}&sta=${BtnOfStationName}` // url from open-api, item(1st para) = line; StationName(2nd para) = station
                const res = await fetch(url).then(res=>res.json()).then(data=>data.data)
                const stationInfo = res[`${item}-${BtnOfStationName}`]  // getting the data that we need.('res' is object, so we have to [] also)
                console.log(`(${lineData[item]}) ${BtnOfStationName} station`,stationInfo) // printing the station, UP-DOWN list and time.
    
                // 終點站只有一個方向的車, 空白array保證輸出
                const downList = stationInfo.DOWN || []
                const upList = stationInfo.UP || [] 
    
                // 每條線 一個 section, 裡面包括: [線路-站名; 月台的最新4班列車狀況(終點站, 到站/下一班列車的時間)]
                msg += `
                <section style="display:flex">
                <div class=${item}-${BtnOfStationName} id=${item}-${BtnOfStationName}-${index}
                    style="
                    width: 420px;
                    height: auto;
                    background-color: ${lineColor[item]}65;
                    "
                    >
                <h2>${lineData[item]} - ${bigData[BtnOfStationName]}</h2>
                <div style="display:flex;flex-direction:row;justify-content:space-around">
                    
                    
                    ${upList.length>0 ? `<span id='uplist-${item}'>` + upList.map((item,index)=>{
                        if (index > 3) { // 部分車站提供4個以上的數據組, 為一致性便忽略這些資料
                            return
                        }
                        let status;
                        status = calculateTimeDiff(item.time, stationInfo[`curr_time`])
                        return `<p style="width:210px;">終點站：<b>${bigData[item.dest]}</b> <br/> ${status}</p>`
                    }) + "</span>":''
                    }
                    
                
                ${downList.length>0 ? `<span id='downlist-${item}'>` + 
                downList.map((item,index)=>{
                    if (index > 3) { // 部分車站提供4個以上的數據組, 為一致性便忽略這些資料
                        return
                    }
                    let status;
                    status = calculateTimeDiff(item.time, stationInfo[`curr_time`])
                    return `<p style="width:210px;">終點站：<b>${bigData[item.dest]}</b><br/> ${status} </p>`
                }) + "</span>": ''
                }
                
                </div>
                </div>
                </section>
                <hr />
                `
                mapInfoContainer.style.display = 'block' 
                mapInfoContainer.innerHTML = msg.replaceAll(',','')
            })
            opened = true
            mapInfoContainer.style.display = 'block'
            mapInfoContainer.style.overflowY = 'scroll'
            setTimeout(()=>{ // timeout延遲 關閉按鈕 的出現, 避免fetch api過久而影響 關閉按鈕 的交互.
                mapInfoContainer.innerHTML += `<span id='container-closeBtn' style='position:sticky;top:10%;color:red;'>X</span>`
                document.getElementById('container-closeBtn').addEventListener('click',closeContainer)
            },500)
            return
        }
        
        // Check Price function [2 buttons required]
        if (startStation && endStation) {
            console.log('please reset inputs first!')
            return false
        }
        if (!startStation) {
            console.log('1st',bigData[BtnOfStationName])
            return startStation = BtnOfStationName
        }
        endStation = BtnOfStationName
        console.log('2nd',bigData[BtnOfStationName])
        loadCSV(CSV_URL)
        document.getElementById('priceHolder').style.display = 'block'
        })
})
