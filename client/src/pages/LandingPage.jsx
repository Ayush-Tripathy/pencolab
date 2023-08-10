import React from 'react'
import "./LandingPage.css"
import Logo from '../components/Logo'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className='landing-page'>
            <Logo />
            <div className='content'>
                <p>
                    A simple canvas for <br />instant <span>collaboration.</span>
                </p>

                <div className='btns'>
                    <button
                        onClick={() => {
                            navigate('/create');
                        }}
                        className='btn-primary'>
                        Create
                    </button>
                    <button
                        onClick={() => {
                            navigate('/join');
                        }}
                        className='btn-secondary'>
                        Join
                    </button>
                </div>
            </div>
            <span className='foot-ref'>
                github/Ayush-Tripathy
            </span>
        </div>
    )
}

export default LandingPage