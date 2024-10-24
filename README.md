The project URL: https://rabb17chi.github.io/MTRcheckTime-r17/
---
 Involve: JavaScript(API fetching, JSON Objects, Date(Time such as minutes) )
---
Map Search:
1. SVG used. (SVG does have a better user-experience that when the user zoom-in the map / scale the webpage won't lead the 'image' to be 'pixel')
===

2. Buttons/Circles set for every station. (You would see it when you mouse-hover on the station circle.)
 2.1 Functions are also set for button
   2.1.1 Layout-color: the color(s) of the circle depends on the LINEs that the station belongs (Check 'ADMIRALTY', it has 4-lines, so we used 'conic-gradient' and set the angle for each station without fade.)
   ===
   2.1.2 Layout-Position: the pos of each circle may not be exactly on/perfect around the original map's station. (I should use mobile-device to set the pos but i used 1920*1080 and 100% scale of PC chrome. Sorry to mobile users)
   ===
   2.1.3 Functions: every circle has a function that called the MTR-Open-API from HKGovernment; [SourceHere](https://data.gov.hk/en-data/dataset/mtr-data2-nexttrain-data) ; the parameters we have to post to the API (line and stationName), where we already set:
   line- from button's classList(filter 'station-btn'), stationName- from button's id(3 letters length *MUST*); Map the classList to send the lines with the station-name to API and get JSON object back.
---
Data Explain:
Once we called the API with `status=1`, means that we connected the API-service and got the data successfully. Now, let's see the data-format and how we use it:
The Object {DOWN,UP,curr_time,sys_time}: 
1. sys_time-> System time, I guess it is the time of the API server/MTR server, we never used it for our checker-app.
2. curr_time-> Current Time, I guess it is the time we called the API service. We use this curr_time to get the time-difference between the trains and users.
3. DOWN/UP-> Incoming 4-trains' data { dest, time, valid } (listing the things we need only. 'Valid' is never used in the app, but by this we can check/get-know is the station in problem(港鐵塞車／故障))
 3.1 dest: 終點站 destination, showing the train's end-point(_LOL, endpoint_) eg. KTL(to HO MAN TIN / WHAMPOA) 觀塘線－何文田／黃埔 ; TKL(to LOHAS Park / PO LAM) 將軍澳線－康城／寶琳
 3.2 time: time, showing the time that train arrvied to the station(should be accurate but depends on any passenger(s) trolling/do fck-thngs). Using this 'time' and curr_time to calculate the time-gap(how many mins left for train arrival)


Map: MTR System Map, circles for buttons(function inside also) [btw, they may be at wrong pos if u scale the webpage, especially if u use mobile.]
Clicked 1 of the buttons would show the info of the station(Name of the station, 4trains of both sides.)

---

SearchBox:
===============
Default Input1 - AEL (Airport Line) ; 
Default Input2 - AEL's stations
===
Disadvantages/Diffuculties of 'SearchBox':
1. Too many stations (it seems that MTR has 99stations - editing at 24/10/2024). Making the Input2 too big and hard to find the STATION that we actually need.
2. Single output only (Eg. Station-'ADMIRALTY', it has 4 lines in this station-EAL TWL ISL SIL. The limits of SearchBox that only inputing 1 LINE input which leads the information a bit slower.)
3. Not really user-friendly. (As the above mentioned-s, the speed/effciency of using SearchBox is really really slow as F. As the API updates per 10seconds, we should find a quicker way for this function)
