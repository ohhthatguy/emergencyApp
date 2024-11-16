import {useState, useEffect} from 'react'

const useGeolocation = ()=>{

    const [position, setPosition] = useState({
        lat: '',
        long: ''
    })

    const [error, setError] = useState('')

    const givePosition = (pos)=>{
        // console.log(pos)
        setPosition({
            lat: pos.coords.latitude,
            long: pos.coords.longitude
        })
    }

    const giveError = (err)=>{
        setError(err.message)
    }

    useEffect(()=>{

    
            if(navigator.geolocation){
                console.log('here')
                navigator.geolocation.getCurrentPosition(givePosition, giveError,{enableHighAccuracy: true})
            }else{
                setError('geolocation is not activated / supported')
            }
        


    },[])

    return {position, error}
    

}

export default useGeolocation;