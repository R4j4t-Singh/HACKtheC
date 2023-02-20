import logo from './logo.svg'
import './App.css'
import Header from './Components/Header/header'
import Footer from './Components/Footer/footer'
import Home from './Components/LandingPage/Home'
import Cdash from './Components/ContractDash/Cdash'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route component={Home} element={<Home />} path="/" exact />
          <Route element={<Cdash />} path="/contract/:id" exact />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App
