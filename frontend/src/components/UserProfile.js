import React, { Component } from 'react';
import { Avatar, Typography, Paper } from '@material-ui/core';
const helpers = require("../helpers")
import * as config from '../config'


const axios = require('axios')
class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            user:{
                first_name:"",
                last_name:"",
                email:""
            } 
        }
    }

    async componentDidMount(){
        // console.log("componentDidMount")
        if (helpers.getCookie("auth_token")) {
            // console.log("componentDidMount")

            let response = await axios({
                url:config.base_url+"/api/get_user_details/",
                method:"GET",
                headers:{
                    'Authorization':"Token "+helpers.getCookie("auth_token"),
                    "X-CSRFToken":helpers.getCookie('csrftoken')
                }
            })
            // console.log("User details ",response)
            if (response.status === 200) {

                this.setState({user:response.data})
            }
        } else {

        }
    }

    logout(){
        helpers.logout()
    }



    render() { 
        return ( <Paper className="p-4 text-muted">
                    <Avatar className="bg-success"> 
                        <Typography>{this.state.user.first_name.substring(0,1)}</Typography>
                    </Avatar>
                    <div>{this.state.user.first_name} {this.state.user.last_name}</div>
                    <div>{this.state.user.email}</div>
                    <button className="btn btn-primary" onClick={this.logout.bind(this)}>Logout</button>
                    {/*<div>Update Profile</div> */}    
                </Paper> );
    }
}
 
export default UserProfile;