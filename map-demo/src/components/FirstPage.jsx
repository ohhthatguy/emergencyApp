import React,{useEffect, useRef, useContext, useState} from 'react'
import { Button, TextField,  } from '@mui/material'
import { GlobalContext } from '../context/Context'
import {io} from 'socket.io-client'
import { useNavigate } from 'react-router-dom'

const FirstPage = () => {

    const onlyOneTime = useRef(true);
    const {setSocket, socket, setLocalUser,localUser} = useContext(GlobalContext)
    const navigate = useNavigate()
    const tempNameVar = useRef('');

    const createASocket = (role)=>{

            if(onlyOneTime.current){

                const newSocket = io.connect('http://localhost:4000')
             
               

                console.log('hhhhee')
                

                setSocket(newSocket)
                // Log when the socket successfully connects
                newSocket.on("connect", () => {
                    console.log('Socket connected with ID:', newSocket.id);

                    const temp = { name: tempNameVar.current, role: role, socketID: newSocket.id }

                    newSocket.emit('save-local-user', (temp));
                    
                    setLocalUser(temp)
                });  

                onlyOneTime.current = false

                return ()=>{
                    newSocket.disconnect()
                }


        }
    }

    //this hits when rescuer is cliked
    const newRescuerAdded = ()=>{
       
        createASocket('rescuer')
            navigate('/RescuerPage')

    }

    //this hits when victim is added
    const newVictimAdded = ()=>{
        
       
            createASocket('victim')

         navigate('/map?role="victim"');


        // console.log('victim added')
    }

    // console.log(socket)
    // console.log(localUser)


  return (
    <div>

        This is where we enter as resccuer // victim.

        <form>
            <TextField onChange={(e)=>  tempNameVar.current=(e.target.value)}/>
            <Button onClick={newVictimAdded} variant="contained" >Victim</Button>
            <Button onClick={newRescuerAdded} variant='contained'>Rescure</Button>

            
        </form>

    </div>
  )
}

export default FirstPage