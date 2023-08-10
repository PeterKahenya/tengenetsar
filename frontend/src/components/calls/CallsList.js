import React, { Component } from 'react';
import { Container, AppBar, Toolbar, Tabs, Tab, List, ListItem, ListItemAvatar, Avatar, Typography, ListItemText, Divider, Paper } from '@material-ui/core';
import * as config from '../../config'
const axios = require('axios').default
const helpers = require("../../helpers")



class CallsList extends Component {
  constructor(props) {
    super(props);
    this.state = {utype:"caller",history:[]}
    this.startCall=this.startCall.bind(this)
  }

  startCall(receiver) {
    this.props.handleStartCall({utype:this.state.utype,receiver:receiver})
  }

  async componentDidMount(){
    var response = await axios({
      method: 'get',
      url: config.base_url+'/api/calls/history',
      headers:{
        'Authorization': 'Token '+helpers.getCookie("auth_token")
      }
    });
    if (response.status===200 && response.data.success) {
        this.setState({history:response.data.results})
    }    
  }

  render() {
    return (<Container maxWidth="sm">
      <List color="default">
        {this.state.history.map(hist=>{
          console.log(hist)
          if (hist.callee.first_name===JSON.parse(helpers.getCookie("user")).first_name) {


            return(
            <div key={hist.id} >
               <ListItem button onClick={()=>this.startCall(hist.caller)}>
                <ListItemAvatar>
                  <Avatar style={{backgroundColor:"#00b050"}}>
                    <Typography>
                      {hist.caller.user.first_name.charAt(0)}
                    </Typography>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={hist.caller.user.first_name} secondary="incoming" />
              </ListItem>
              <Divider />
            </div>
          )



          } else {

          return(
            <div key={hist.id} >
               <ListItem button onClick={()=>this.startCall(hist.callee)}>
                <ListItemAvatar>
                  <Avatar style={{backgroundColor:"#00b050"}}>
                    <Typography>
                      {hist.callee.user.first_name.charAt(0)}
                    </Typography>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={hist.callee.user.first_name} secondary="outgoing" />
              </ListItem>
              <Divider />
            </div>
          )

          }
                  

        })}
      </List>
    </Container>);
  }
}

export default CallsList