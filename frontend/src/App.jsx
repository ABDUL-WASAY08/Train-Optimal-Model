import './App.css'
import AuthScreen from './Screen/AuthScreen'
import MainScreen from './Screen/MainScreen'
import PageNotFound from './Screen/pageNotFound'
import SplashScreen from './Screen/SplashScreen'
import {BrowserRouter,Route,Routes} from "react-router-dom"
import {Toaster} from "sonner"
function App() {


  return (
    <>
    <Toaster theme="dark" position="top-right" richColors />
    <BrowserRouter>
    <Routes>
    <Route  path='/' element={<SplashScreen />}/>
    <Route  path='/Autorization' element={<AuthScreen />}/>
    <Route  path='/dashboard' element={<MainScreen />}/>
    <Route path="*" element={<PageNotFound />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
