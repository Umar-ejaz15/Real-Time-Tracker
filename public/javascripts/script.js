const socket = io();
console.log("hello");

if (navigator.geolocation) {
    navigator.geolocation.watchPosition
        (
            (position) => {
                const { latitude, longitude } = position.coords;
                socket.emit('send-locaion', { latitude, longitude });
            },
            (error) => {
                console.log(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        )
}
const map = L.map('map').setView([0, 0], 10)
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)

const markers = {}
socket.on("reacive-location", (data) => {
    const { id, latitude, longitude } = data
    map.setView([latitude, longitude], 16)
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude])
    }
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map)
    }
})
socket.on("user-disconnect", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id])
        delete markers[id]
    }
})