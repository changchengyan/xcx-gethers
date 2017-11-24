// pages/word/write/map/map.js
Page({
  data: {
    markers: [{
      iconPath: "/pages/images/marker.png",
      id: 0,
      latitude: 30.522,
      longitude: 114.348,
      width: 30,
      height: 30
    }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})