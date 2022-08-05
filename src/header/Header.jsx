import React from 'react'
import logo from "../constants/logo.svg"
import person from "../constants/person.png"
import "./Header.css"

function Header() {
  return (
    <div className='header-container'>
        <img className='header-logo' src={logo} />
        <img className='header-person-pic' src={person} /> 
    </div>
  )
}

export default Header