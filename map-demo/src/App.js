import { Route, Routes } from "react-router-dom";
import FirstPage from "./components/FirstPage";
import Map from "./components/Map";
import RescuerPage from "./components/RescuerPage";

const App = ()=>{

  return(<>

    <Routes>

      <Route path='/' element={<FirstPage/>} />
      <Route path='/Map' element={<Map />} />
      <Route path='/RescuerPage' element={<RescuerPage/>} />

    </Routes>

  </>)

  
}

export default App;
