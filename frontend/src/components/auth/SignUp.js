import React, { Component } from 'react';
import { Button, TextField, Tab, Tabs } from '@material-ui/core';
import { ContactsRounded, ContactSupport } from "@material-ui/icons";
import './SignUp.css'
const helpers = require("../../helpers")
const config = require("../../config")



class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            phone_number: "",
            email: "",
            password: "",
            cpassword: "",
            tab: 0,
            specialty: "",
            is_loading:false,
            message:""
        }
    }

    async getToken() {
        if (this.state.first_name===""||this.state.phone_number===""||this.state.email===""||this.state.password===""||this.state.cpassword==="") {
            this.setState({message:"You cannot have blank fields!"})
            return;
        }


        this.setState({is_loading:true,message:""},()=>{

        const messaging = window.firebase.messaging()
        messaging.requestPermission()
            .then(async () => { return await messaging.getToken() })
            .then(async token => {
                var response=await helpers.signup({ 'gcm_token': token, ...this.state })

                if (response.status === 201) {


                    this.setState({messaging:"Sign Up Success"},()=>{
                        this.props.authSuccess()
                    })


                } else {
                   this.setState({is_loading:false,message:response.data.message})
                }
            }).catch((err)=> {
                console.log(err)
                this.setState({is_loading:false,message:err})
            })


        })
        
    }

    handleChange(event, newValue) {
        this.setState({ tab: newValue })
    }

    render() {
        return (<div className="signUpContainer card">
                {this.state.message?

                    <div class="alert alert-warning" role="alert">
                      {this.state.message}
                    </div>

                    :null}


            <h4 className="text-muted p-2 text-center">Tengenetsar|SignUp</h4>
            <Tabs centered style={{ display: 'flex', width: '100vw !important', justifyContent: "center" }} value={this.state.tab} onChange={this.handleChange.bind(this)}>
                <Tab icon={<ContactSupport />} style={{ flexGrow: 1 }} label="Customers" id="simple-tab-1" aria-controls="simple-tabpane-1" />
                <Tab icon={<ContactsRounded />} style={{ flexGrow: 1 }} label="Experts" id="simple-tab-2" aria-controls="simple-tabpane-3" />
            </Tabs>
            {this.state.tab === 0 ? <div className="signUpForm p-1" >
                <TextField  className="inputField" onChange={e => this.setState({ first_name: e.target.value })} value={this.state.first_name} id="" label="Your Name" placeholder="Your Name" variant="outlined" />
                <br/>
                <TextField     inputProps={{ maxLength: 15 }}  className="inputField" onChange={e => this.setState({ phone_number: e.target.value })} value={this.state.phone_number} label="Phone Number" placeholder="Phone Phone" variant="outlined" />
                <br/>
                <TextField  className="inputField" onChange={e => this.setState({ email: e.target.value })} value={this.state.email} label="Email Address" placeholder="Email Address" variant="outlined" />
                <br/>
                <TextField  className="inputField" onChange={e => this.setState({ password: e.target.value })} value={this.state.password} type="password" label="Password" placeholder="Password" variant="outlined" />
                <br/>
                <TextField  className="inputField" onChange={e => this.setState({ cpassword: e.target.value })} value={this.state.cpassword} id="outlined-basic" type="password" label="Confirm Password" placeholder="Confirm Password" variant="outlined" />
                <br/>
                <br/>
                <div className="d-flex align-items-center justify-content-start">
                    <button disabled={this.state.is_loading} className="btn btn-success m-1" onClick={this.getToken.bind(this)}>
                        {this.state.is_loading?<span>Signing Up...</span>:<span>Sign Up</span>}
                    </button>
                    <button disabled={this.state.is_loading} className="btn btn-warning m-1" onClick={this.props.switchForms.bind(this)}>
                        Login
                    </button>
                </div>

            </div> : 
            <div className="signUpForm p-2" >
                    <TextField  className="inputField" onChange={e => this.setState({ first_name: e.target.value })} value={this.state.first_name} id="" label="Your Name" placeholder="Your Name" variant="outlined" />
                    <br/>
                    <TextField  className="inputField" onChange={e => this.setState({ phone_number: e.target.value })} value={this.state.phone_number} label="Phone Number" placeholder="Phone Phone" variant="outlined" />
                    <br/>
                    <TextField  className="inputField" onChange={e => this.setState({ email: e.target.value })} value={this.state.email} label="Email Address" placeholder="Email Address" variant="outlined" />
                    <br/>
                    <TextField  className="inputField" onChange={e => this.setState({ specialty: e.target.value })} value={this.state.specialty} label="Specialty" placeholder="Specialty" variant="outlined" />
                    <br/>
                    <TextField  className="inputField" onChange={e => this.setState({ password: e.target.value })} value={this.state.password} type="password" label="Password" placeholder="Password" variant="outlined" />
                    <br/>
                    <TextField  className="inputField" onChange={e => this.setState({ cpassword: e.target.value })} value={this.state.cpassword} id="outlined-basic" type="password" label="Confirm Password" placeholder="Confirm Password" variant="outlined" />
                    <br/>
                    <br/>
                    <div className="d-flex align-items-center justify-content-start">
                        <button disabled={this.state.is_loading} className="btn btn-success m-1" onClick={this.getToken.bind(this)}>
                            {this.state.is_loading?<span>Signing Up...</span>:<span>Sign Up</span>}
                        </button>
                        <button disabled={this.state.is_loading} className="btn btn-warning m-1" onClick={this.props.switchForms.bind(this)}>Login</button>
                    </div>

            </div>

            }
                <div className="container">
                </div>
            

        </div>);
    }
}

export default SignUp;