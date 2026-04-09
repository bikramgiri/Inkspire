import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import Layout from './layout/Layout'
import NotFound from './components/NotFound'

function App() {

  return ( 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
            <Route 
            index 
            element={ 
            <Home /> 
            } />
            <Route 
            path="*" 
            element={
              <NotFound />
              } 
            />
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
