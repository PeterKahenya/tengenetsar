import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import './Login.css'
import { Button } from '@material-ui/core';
const helpers = require("../../helpers")
const config = require("../../config")

// window.firebase.initializeApp(config.firebaseConfig)

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { email: "", password: "",message:"",is_loading:false }
    }

    getToken() {
        if (this.state.email==="" || this.state.password==="") {
            this.setState({message:"Fill all fields"})
        }

        this.setState({is_loading:true},()=>{


        const messaging = window.firebase.messaging()
        messaging.requestPermission()
            .then(async () =>{ return messaging.getToken() })
            .then(async token=> {
                var status= await helpers.login({'gcm_token':token, 'email': this.state.email, password: this.state.password })
                console.log(status)
                if (status) {
                    console.log(status)
                    this.props.authSuccess()
                } else {
                    console.log("did not log in")
                   this.setState({message:"Something Went wrong!",is_loading:false}) 
                }
            }).catch((err) =>{
                    console.log("err",this)

                this.setState({message:"Error Occurred"+err,is_loading:false})
            })




        })
        
    }

    useGoogle(){
        
    }

    render() {
        return (<div className="loginContainer d-flex justify-content-center align-items-center card">
            <h4 className="text-muted text-center p-2">Tengenetsar | Login</h4>
            <div className="alert alert-danger" role="alert">
              {this.state.message}
            </div>
            <div className="loginForm d-flex flex-column align-items-center justify-content-center" noValidate autoComplete="off">
                <TextField disabled={this.state.is_loading} className="inputField mt-1" onChange={e => this.setState({ email: e.target.value })} value={this.state.email} variant="outlined" type="email" label="Email Address" placeholder="Email Address"  />
                <br/>
                <TextField disabled={this.state.is_loading} className="inputField mt-1" onChange={e => this.setState({ password: e.target.value })} value={this.state.password} variant="outlined" type="password" label="Password" placeholder="Password" />
                {/* <Button className="bg-danger text-white" onClick={this.useGoogle.bind(this)}>Use Google Account</Button> */}
                <hr/>
                <div className="d-flex justify-content-center">
                <button disabled={this.state.is_loading} className="btn m-1 btn-success" onClick={this.getToken.bind(this)}>Login</button>

                <button disabled={this.state.is_loading} className="btn m-1 btn-warning" onClick={this.props.switchForms.bind(this)}>Signup</button>

                </div>
                

            </div>
        </div>);
    }
}

export default Login;