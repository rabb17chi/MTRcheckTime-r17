The project URL:[ https://rabb17chi.github.io/](https://rabb17chi.github.io/MTRcheckTime-r17/)
---
 Involve: JavaScript(API fetching, JSON Objects, Date(Time such as minutes) )
---

Map: MTR System Map, circles for buttons(function inside also) [btw, they may be at wrong pos if u scale the webpage, especially if u use mobile.]
Clicked 1 of the buttons would show the info of the station(Name of the station, 4trains of both sides.)

---

SearchBox:
---
Default Input1 - AEL (Airport Line)
Default Input2 - AEL's stations
//
Disadvantages/Diffuculties of 'SearchBox':
1. Too many stations (it seems that MTR has 99stations - editing at 24/10/2024). Making the Input2 too big and hard to find the STATION that we actually need.
2. Single output only (Eg. Station-'ADMIRALTY', it has 4 lines in this station-EAL TWL ISL SIL. The limits of SearchBox that only inputing 1 LINE input which leads the information a bit slower.)
3. Not really user-friendly. (As the above mentioned-s, the speed/effciency of using SearchBox is really really slow as F. As the API updates per 10seconds, we should find a quicker way for this function)
