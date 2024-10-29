import { stationFullName } from "../scripts/usefulData/stationFullName.js"

window.onload = () =>{
    console.log('-- Welcome to price-check page. --')

}
let startStation;
let endStation;
const CSV_URL = '../resources/MTR_LINES-fares.csv'

document.getElementById('submit-btn').addEventListener('click',async (e)=>{
    e.preventDefault()
    startStation = document.getElementById('StartStationInput').value;
    endStation = document.getElementById('EndStationInput').value
    if (startStation.length && endStation.length) {
        loadCSV(CSV_URL)
        return
    }
    console.log('please input')
    return 
})

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
    dataSet.map((item,index)=>{
        if (item[0] === stationFullName[startStation] && item[2] === stationFullName[endStation]) {
            document.getElementById('adult-price').textContent = Number(item[3]).toFixed(1)
            document.getElementById('child-price').textContent = Number(item[4]).toFixed(1)
            console.log(item)
            return item
        }
        return false
    })
}