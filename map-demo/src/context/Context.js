import {createContext, useState, useRef} from 'react'

//creating context
export const GlobalContext = createContext();

//creating context provider
export const GlobalProvider = ({children}) =>{

    const [socket, setSocket] = useState('')
    const [localUser, setLocalUser] = useState({
        name: '',
        socketID: '',
        role: ''
    })
    const [openMessage, setOpenMessage] = useState(false)

    return (<GlobalContext.Provider value={{socket, setSocket,localUser, setLocalUser,openMessage, setOpenMessage}} >

        {children}

    </GlobalContext.Provider>)
}