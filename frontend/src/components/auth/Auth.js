import React, { Component } from 'react';
import Login from './Login';
import SignUp from './SignUp';
import './Auth.css'
import { Dialog,Button,AppBar,Toolbar,Typography } from "@material-ui/core";



class AuthenticateDialog extends Component {
    constructor(props) {
        super(props);
        this.state = { formtype: 'login' }
    }

    authSuccess(){
        console.log("authSuccess in AuthenticateDialog")
        this.props.authSuccess()
    }

    toggleAuthDialog(){
        this.props.toggleAuthDialog()
    }

    switchForms(){
        this.setState({formtype:this.state.formtype==='login'?'signup':'login'})
    }


    render() {
        const { classes, theme } = this.props
        return (
            <Dialog fullScreen onClose={this.toggleAuthDialog.bind(this)} className="authContainer" open={this.props.show}>
                <AppBar className="bg-success shadow-lg text-white" position="static">
                    <Toolbar style={{ backgroundColor: '#00b050' }}>
                        <button className="btn text-white material-icons" onClick={this.toggleAuthDialog.bind(this)}>
                            arrow_back
                        </button>
                        <Typography>
                            {this.state.formtype}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className="authContainer d-flex align-items-center justify-content-center">
                {this.state.formtype === "login" ? 
                <Login switchForms={this.switchForms.bind(this)} authSuccess={this.authSuccess.bind(this)}/>: 
                <SignUp switchForms={this.switchForms.bind(this)} authSuccess={this.authSuccess.bind(this)}/>
                }
                </div>
            </Dialog>
        );
    }
}

export default AuthenticateDialog;