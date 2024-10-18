// 此JavaScript的功能均作用於地圖上

import { bigData } from "../usefulData/stationName.js"
import { lineData } from "../usefulData/lineName.js"
import { calculateTimeDiff } from "../../script.js"
import { lineColor } from "../usefulData/lineColor.js"

const mapInfoContainer = document.getElementById('mapBtnInfoContainer')
const abc = document.querySelectorAll('.station-btn') // get all buttons with class 'station-btn'
let opened = false; // ContainerBox open/close 

function closeContainer() {
mapInfoContainer.style.display = 'none'
}

abc.forEach(item=>{ // change the color(s) of O
    let styleString = '' // string that being added to the O circle style
    const stationLineArray = [...item.classList].filter(item=>item != 'station-btn') // get line array
    const count = stationLineArray.length // number of lines that station has
    stationLineArray.map(item=> {
        styleString += `${lineColor[item]}, ` // use "lineColor" with the key(item) to get the HEXcolor (eg. return #FFF)
    })
    console.log (`stylestring: '${styleString.slice(0, -2)}' `) // chop the last2 elements

    if (count == 1) { // if the station has only 1 line, the 'O' will be using 1 color also.
        item.style['background'] = `${styleString.slice(0, -2)}`
        return
    }
    item.style['background'] = `conic-gradient(${styleString.slice(0, -2)})` // else if station has 2 or above lines, use gradient to display.
})

abc.forEach(item=>{ // add fetch trains-data for every O.
    item.addEventListener('click',async (e)=>{
        let msg = ''
        mapInfoContainer.innerHTML = ''
        const BtnOfStationName = item.id // getting the name of station -> this will be using in the api (2nd para)
        // console.log('Station:', bigData[BtnOfStationName]) // use "bigData" to get the chinese name of the station. (eg. 大圍) 

        const BtnOfStationLine = [...item.classList].filter(item=>item != 'station-btn') // filter the classList, remove 'station-btn', this class is uselss in this block.
        // console.log('BtnOfStationLine', BtnOfStationLine) // printing the classList, which should only show what line(s) the station has (eg. 觀塘線KTL/荃灣線TWL)
        BtnOfStationLine.map(async(item,index)=>{ // loop every line to fetch trains-data
            let url = `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${item}&sta=${BtnOfStationName}` // url from open-api, item(1st para) = line; StationName(2nd para) = station
            const res = await fetch(url).then(res=>res.json()).then(data=>data.data) // normal stuff to handle fetched items.
            const stationInfo = res[`${item}-${BtnOfStationName}`]  // getting the data that we need.('res' is object, so we have to [] also)
            console.log(`(${lineData[item]}) ${BtnOfStationName} station`,stationInfo) // printing the station, UP-DOWN list and time.

            // 終點站只有一個方向的車, 空白array保證輸出
            const downList = stationInfo.DOWN || []
            const upList = stationInfo.UP || [] 

             // print for checking the downList trains (data we need: [DEST](終點) and [time])
            console.log('downList',downList ? downList : null)
            console.log('upList',upList ? upList : null)

            // 每條線 一個 section, 裡面包括: [線路-站名; 月台的最新4班列車狀況(終點站, 到站/下一班列車的時間)]
            msg += `
            <section style="display:flex">
            <div class=${item}-${BtnOfStationName} style='display:block;width:550px;height:auto;'>
            <h2>${lineData[item]} - ${bigData[BtnOfStationName]}</h2>
            <div style="display:flex;flex-direction:row;justify-content:space-around">
                
                
                ${upList.length>0 ? `<span id='uplist-${item}'>` + upList.map((item,index)=>{ // 即使Line47預防空白資料, 進一步使用array.length檢查是否有資料, 避免版面不符合預期.
                    if (index > 3) { // 部分車站提供4個以上的數據組, 為一致性便忽略這些資料
                        return
                    }
                    let status;
                    status = calculateTimeDiff(item.time, stationInfo[`curr_time`])
                    return `<p style="width:260px;">終點站：<b>${bigData[item.dest]}</b> <br/> ${status}</p>`
                }) + "</span>":''
                }
                
            
            ${downList.length>0 ? `<span id='downlist-${item}'>` + downList.map((item,index)=>{ // 即使Line46預防空白資料, 進一步使用array.length檢查是否有資料, 避免版面不符合預期.
                if (index > 3) { // 部分車站提供4個以上的數據組, 為一致性便忽略這些資料
                    return
                }
                let status;
                status = calculateTimeDiff(item.time, stationInfo[`curr_time`])
                return `<p style="width:260px;">終點站：<b>${bigData[item.dest]}</b> <br/> ${status}</p>`
            }) + "</span>": ''
            }
            
            </div>
            </div>
            </section>
            <hr />
            `
            mapInfoContainer.style.display = 'block' // 由none改變成block, 展現出來.
            mapInfoContainer.innerHTML = msg.replaceAll(',','') // 減去不必要的符號
        })
        opened = true // container的狀況, 允許下面的function執行 關閉的工作 (Line10)
        setTimeout(()=>{ // timeout延遲 關閉按鈕 的出現, 避免fetch api過久而影響 關閉按鈕 的交互.
            mapInfoContainer.innerHTML += `<span id='container-closeBtn' style='position:absolute;top:1%;left:90%;color:red;'>X</span>`
            document.getElementById('container-closeBtn').addEventListener('click',closeContainer)
        },300)

        })

})