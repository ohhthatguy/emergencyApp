import React,{useContext, useEffect, useRef} from 'react'
import { Box, Button, Dialog, DialogActions, DialogTitle, DialogContent, TextField} from '@mui/material';
import { GlobalContext } from '../context/Context';




const MessagePopup = ({selectedRescuer, victim}) => {

    const { openMessage, setOpenMessage, socket } = useContext(GlobalContext)

    // const [peopleICanCall, setPeopleICanCall] = useState([])
    const tempNameVar = useRef()

    useEffect(()=>{

        // socket.on('take-people-in-room-excpet-me', (clients,userInPrivateRoom)=>{
        //     //clients means all the user in the socketIO private room excpet me
        //     //userInPrivateRoom has an arry of object where each object is {id: '', name: ''} of conncetd user including me

        //     let temp = userInPrivateRoom.filter((e)=> clients.includes(e.id)) // returns array of object of id and name of user that is not me and is in the room

        //     // console.log(temp)
        //     setPeopleICanCall(temp)

        // })


        // console.log(peopleICanCall)
        return (()=>{
            // socket.disconnect()
            // socket.off('take-people-in-room-excpet-me');
          })
    },[])


    const closeMessageDialouge = ()=>{
        setOpenMessage(false)
    }

    const sendMessage = ()=>{
        console.log(`message: ${tempNameVar.current}`)

        let messageFromVictim = {
            message: tempNameVar.current,
            victim: victim,
            selectedRescuer: selectedRescuer
        }

        socket.emit('message-to-rescuer', messageFromVictim)
        

    }

   


  return (
    
      

        <Dialog open={openMessage} onClose={closeMessageDialouge}>
            <DialogTitle>Give a Message </DialogTitle>

            <DialogContent>
                
                      <Box>
                        <TextField onChange={(e)=>  tempNameVar.current=(e.target.value)} />
                      </Box>
                
              
            </DialogContent>

            <DialogActions>
                <Button onClick={closeMessageDialouge} variant='contained'>Close</Button>
                <Button onClick={sendMessage} variant='contained'>Send</Button>

            </DialogActions>

        </Dialog>
        
 
  )
}

export default MessagePopup