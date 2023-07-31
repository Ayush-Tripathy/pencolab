import React from 'react'
import "./LandingPage.css"
import Logo from '../components/Logo'

const LandingPage = () => {
    return (
        <div className='landing-page'>
            <Logo />
            <div className='content'>
                <p>
                    A simple canvas for <br />instant <span>collaboration.</span>
                </p>

                <div className='btns'>
                    <button className='btn-primary'>Create</button>
                    <button className='btn-secondary'>Join</button>
                </div>
            </div>
            <span className='foot-ref'>
                github/Ayush-Tripathy
            </span>
        </div>
    )
}

export default LandingPage