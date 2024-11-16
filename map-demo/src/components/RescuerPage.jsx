import React, { useEffect, useContext, useState } from 'react'
import useGeolocation from '../hooks/useGeolocation'
import { GlobalContext } from '../context/Context'
import { Button } from '@mui/material'

const RescuerPage = () => {

    const {position, error} = useGeolocation() 
    const {socket, localUser} = useContext(GlobalContext)
    const [showMessage, setShowMessage] = useState([])
    let resPosition;


    useEffect(()=>{

        if(error.length > 0){
            alert(error)
            return 
        }

        if(position.lat && position.long ){
           

            // console.log(position.lat, position.long)
            // const lat = parseFloat(position.lat)
            resPosition = {
                //slightly changing the value so that they dont cramp in same palce
                lat: ((parseFloat(position.lat))+(Math.random()*1.5)).toString(),
                long: ((parseFloat(position.long))+(Math.random()*1.9)).toString(),
                victim: false
            }

            console.log(localUser)
            let rescuer = {...localUser, resPosition}
            console.log(rescuer)

            socket.emit('rescuer-position', rescuer)

            
            
            //we have the latitude and longitude of recuer send it to socket server


        }

        socket.on('take-this-message', (messageFromVictim)=>{
            setShowMessage(prev=> ([...prev, messageFromVictim]))
        })

        return (()=>{
            socket.off('take-this-message')
        })


    },[position, error])

    console.log(showMessage)

    const handleClick=(both)=>{
        console.log(both)
        console.log('rescuer is in his way. tell this to victim. sednign to sever')

        socket.emit('rescuer-on-its-way', both)

    }
  return (
    <div>
        Resuce to be made!
        {
            showMessage.length > 0 && showMessage.map((e, index)=>(
                <div style={{border: '1px solid black'}} key={index}>
                    
                    <div>{`message: ${e.message}`}</div>
                    <div>{`from(victim): ${e.victim.name}`}</div>
                    <div>{`to(selected rescuer): ${e.selectedRescuer.name}`}</div>

                    <Button variant='contained' onClick={()=> handleClick(e)}>On My Way!</Button>

                </div>
            ))
        }
    </div>
  )
}

export default RescuerPage