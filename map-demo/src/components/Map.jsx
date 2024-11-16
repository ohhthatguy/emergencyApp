import React,{useRef, useEffect, useContext} from 'react'
import leaflet from 'leaflet'
import useGeolocation from '../hooks/useGeolocation'
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { GlobalContext } from '../context/Context';
import MessagePopup from './MessagePopup';

const Map = () => {

    const mapRef = useRef() //to get dom element of id map
    const selectedRescuer = useRef()
    const {socket, localUser,setOpenMessage, openMessage} = useContext(GlobalContext)


    let rescuerMarker=[];

    // useEffect(()=>{
        

    // },[])


    let ambulanceIcon = leaflet.icon({
        iconUrl: 'https://png.pngtree.com/png-clipart/20220728/original/pngtree-ambulance-clipart-5-png-image_8421606.png',
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowUrl: 'https://png.pngtree.com/png-clipart/20220728/original/pngtree-ambulance-clipart-5-png-image_8421606.png',
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });
    
    const {position, error} = useGeolocation() 



    useEffect(()=>{

        
        if(error.length > 0){
            alert(error)
            return 
        }

        if(position.lat && position.long ){
            console.log('victim')
            console.log(position.lat)
            console.log(position.long)

            mapRef.current = leaflet.map('map').setView([position.lat, position.long], 10);

            leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(mapRef.current);

            leaflet.marker([position.lat, position.long]).addTo(mapRef.current);
           
            

            // console.log(localUser)
        socket.emit('get-all-available-rescuer-for-first-time', localUser)


        }



        // if(onlyFirstTime.current){
       

        //         // var markers = leaflet.marker([53.5, -0.09]).addTo(mapRef.current);

        //         // var markere = leaflet.marker([45.5, -0.09]).addTo(mapRef.current);

        //         marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

        //     //     var popup = leaflet.popup()
        //     // .setLatLng([51.513, -0.09])
        //     // .setContent("I am a standalone popup.")
        //     // .openOn(mapRef.current);

        // //     var popup = leaflet.popup();

        // // function onMapClick(e) {
        // //     popup
        // //         .setLatLng(e.latlng)
        // //         .setContent("You clicked the map at " + e.latlng.toString())
        // //         .openOn(mapRef.current);
        // // }

        // // mapRef.current.on('click', onMapClick);
        // }

        // onlyFirstTime.current = true

    },[position, error])

    //shows the marker and posiiton of rescuer on map and 
    useEffect(()=>{

        
        socket.on('show-rescuer-position-on-map', (rescuer)=>{
            
            console.log('herer12')
            console.log(rescuer)
            console.log(rescuer.resPosition.lat)
            console.log(rescuer.resPosition.long)

            let temp = leaflet.marker([rescuer.resPosition.lat, rescuer.resPosition.long], {icon: ambulanceIcon}).addTo(mapRef.current);

            rescuerMarker.push(temp)

            temp.on('click', ()=>{
                ambulanceMarkerIsClicked(temp,rescuer)
            })

        })

        socket.on('remove-rescuer-marker', (rescuerToRemove)=>{
            // rescuerMarker.map((e)=>{
            //     if(e.socketID === localUserServer)
            // })
            console.log(rescuerToRemove)
            const marker = rescuerMarker.find((e)=>
                    (e._latlng.lat == rescuerToRemove.resPosition.lat && e._latlng.lng == rescuerToRemove.resPosition.long)
                )

            marker.remove()
        })

        socket.on('tell-rescuer-on-way', (both)=>{
            console.log('this rescuer down me is commnig for help. this is the help thats comming')
            console.log(both.selectedRescuer)
            //after this we remove all the rescuer from map except the one rescuer that is seelected and a path is highlighted between user and the rescuer adn real time location is given. same is done at rescuer side
        })






        return ()=>{
            socket.off('show-rescuer-position-on-map')
        }

    },[])


    const ambulanceMarkerIsClicked = (ambulanceMarker, rescuer) =>{
        console.log('marker is cliked')
        console.log(ambulanceMarker)
        console.log(ambulanceMarker._latlng)
        console.log(ambulanceMarker._latlng.lat)

        console.log(ambulanceMarker._latlng.lng)


        console.log(rescuer)
        selectedRescuer.current = rescuer

        setOpenMessage(true)


    }


  return (<>
   
     <div id="map" style={{height: '100vh', border: '1px solid red'}} ref={mapRef}></div>
    
     { openMessage && <MessagePopup selectedRescuer={selectedRescuer.current} victim={localUser}/> }

     </>
    )
}

export default Map