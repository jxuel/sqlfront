import { useState, useContext } from "react";
import {Context} from "../store/Store"
import {
    useHistory,
  } from "react-router-dom";
import "./SignIn.css"

function SignIn (props) {
    const [signIn, setSignIn] = useState(true)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [state, dispatch] = useContext(Context)
    const history = useHistory();


    const handleForm = (event) =>{
        event.preventDefault();
        const data = {"username":username, "password":password }
        console.log()
        fetch(`https://www.plusoperation.ga/auth/${signIn? 'signin' : "signup"}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body:JSON.stringify(data)
        })
        .then(res=>{
            if(res.ok) {
                return res.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(obj=>{
            if(signIn) {
                console.log(obj)
                dispatch({type:'SIGN_IN', payload:obj})
                history.push('/dashboard');
            } else {
                alert("Created an account for "+obj.username)
            }
            
        })  
        .catch(error=>{
            console.log(error)
        })      
    }
    const handleUsername = (event)=>{
        setUsername(event.target.value)
    }
    const handlePassword = (event)=>{
        setPassword(event.target.value)
    }

    const handleChangeForm = ()=>{
        setSignIn(!signIn)
        setUsername("")
        setPassword("")
    }

    return (
        <div className="signin-container">
                <form onSubmit={handleForm}>
                    <label htmlFor="username">Username</label><br/>
                    <input type="text" id="username" name="username" value={username} onChange={handleUsername} /><br/>
                    <label htmlFor="password">Password</label><br/>
                    <input type="text" id="password" name="password" value={password} onChange={handlePassword}/><br/>
                    <input type="submit" value={signIn? "Sign In":"Sign Up"}/>
                </form> 
                <input type="button" onClick={handleChangeForm} value={signIn? "Create an account" : "Have an account"}/>            
        </div>   
    )
}



export default SignIn;