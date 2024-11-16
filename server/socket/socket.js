//socket configuration

const express = require('express')
const app = express()
const cors = require('cors')

const {createServer} = require('http')
const { Server } = require('socket.io');

const server = createServer(app)

const io = new Server(server,{cors: {
    origin: '*',
  
  }})

app.use(cors())
app.use(express.json())

//socket logic starts

let localUserServer;
let usersInHomeRoom=[];
let allVictims = [];
let allRescuer = [];

  const socket = ()=>{

    io.on('connection', (socket) => {
        console.log('a user connected with id: ', socket.id);

        socket.on('save-local-user', (localUser)=>{
          
          // console.log('localuser: ')
          localUserServer = {...localUser}
          // console.log(localUserServer)

          if(localUser.role == 'victim'){
            allVictims = [...allVictims, localUser]
          }

          // if(localUser.role == 'rescuer'){
          //   allRescuer = [...allRescuer, localUser]
          // }

          socket.join('home'); //in room:home, everyone is present.


          // console.log('home: ')
          usersInHomeRoom = [...usersInHomeRoom, localUserServer] //all users that are going to be in home room in the room:home
          // console.log(usersInHomeRoom)
       
        })

        socket.on('get-all-available-rescuer-for-first-time',(localUser)=>{
          console.log('in socket for first time rescuers')
          console.log(localUser)
          console.log(allRescuer)

          allRescuer && allRescuer.map((e)=>{
            io.to(localUser.socketID).emit('show-rescuer-position-on-map', e)
          })

        })


        socket.on('rescuer-position', (rescuer)=>{
          console.log('in socket')

          console.log(rescuer)
          allRescuer = [...allRescuer, rescuer]


          allVictims && allVictims.map((e)=>{ //if rescuer joins first then there will be no victim and this will not run
            socket.to(e.socketID).emit('show-rescuer-position-on-map', rescuer)
          })

        })

        socket.on('message-to-rescuer', (messageFromVictim)=>{

        //   let messageFromVictim = {
        //     message: tempNameVar.current,
        //     victim: victim,
        //     selectedRescuer: selectedRescuer
        // }

        console.log('message is in server')

        io.to(messageFromVictim.selectedRescuer.socketID).emit('take-this-message', messageFromVictim)


        })

        socket.on('rescuer-on-its-way', (both)=>{
          console.log('on my waymmessage recahed server')

          io.to(both.victim.socketID).emit('tell-rescuer-on-way', both)

        })
        
        







        socket.on('disconnect', () => {

          console.log('socket disconnected: ')
          console.log(localUserServer)


          if(localUserServer.role == 'rescuer'){
            let rescuerToRemove =  allRescuer.filter((e)=> e.socketID == localUserServer.socketID)
            console.log(rescuerToRemove[0])

            allRescuer.filter((e)=> e.socketID !== localUserServer.socketID) //removing rescuer from allrescuer array

            allVictims && allVictims.map((e)=>{
              io.to(e.socketID).emit('remove-rescuer-marker', rescuerToRemove[0])

            })

          }

          
            
            console.log(`User disconnected with ID: ${socket.id}`);
        });
        
      });

  }

  server.listen(4000, () => {
    usersInHomeRoom=[]
     allVictims = [];
     allRescuer = [];
    console.log('socket server running at 4000');
  });

  
module.exports = socket

