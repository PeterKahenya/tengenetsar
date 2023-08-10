import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import "./Call.css"
import { AppBar, Toolbar, Tabs, Tab} from '@material-ui/core';
import PhoneIcon from '@material-ui/icons/Phone';
import ContactsRounded from "@material-ui/icons/ContactsRounded";
import CallingScreen from './calls/CallingScreen';
import ExpertsList from './calls/ExpertsList';
import CallsList from './calls/CallsList';
import * as config from '../config'
const helpers = require("../helpers")
const axios = require('axios').default



class Call extends Component {

  constructor(props) {
    super(props);
    this.state = {
      callingPageOpen: this.props.room?true:false,
      tab: 0,
      callDialogOpen: this.props.room?true:false,
      utype:this.props.utype,
      roomId:this.props.room,
      isCalling:this.props.isCalling
    }
  }

  handleStartCall(params) {
    console.log("params")
    console.log(params)
    this.props.handleStartCall(params)
    this.setState({isCalling:true})
  }

  handleChange(event, newValue) {
    this.setState({ tab: newValue })
  }
  handleClickOpen() {
    console.log("handleClickOpen")
    this.setState({ callingPageOpen: !this.state.callingPageOpen })
  }

  componentDidMount(){
    if (this.props.room) {
      this.setState({roomId:this.props.room,callDialogOpen:true,utype:'callee'})
    }
  }

  backToCall(){
     var call_screen = document.getElementById('call_screen')
     call_screen.style.display="block"
  }

  
  render() {
    return (<div>
              <div>
                <Dialog fullScreen open={this.state.callingPageOpen}>
                    <div>
                      <AppBar style={{ backgroundColor: '#00b050' }} position="static">
                        <Toolbar>
                          <button className="btn text-white material-icons" onClick={this.handleClickOpen.bind(this)}>arrow_back</button>
                        </Toolbar>
                        <Tabs centered  style={{ display: 'flex', width: '100vw !important', justifyContent: "center" }} value={this.state.tab} onChange={this.handleChange.bind(this)}>
                          <Tab icon={<PhoneIcon />} style={{ flexGrow: 1 }} label="Calls" id="simple-tab-1" aria-controls="simple-tabpane-1" />
                          <Tab icon={<ContactsRounded />} style={{ flexGrow: 1 }} label="Experts" id="simple-tab-2" aria-controls="simple-tabpane-3" />
                        </Tabs>
                      </AppBar>
                      <div>
                        {this.state.tab === 0 ? <CallsList handleStartCall={this.handleStartCall.bind(this)} /> : <ExpertsList handleStartCall={this.handleStartCall.bind(this)} />}
                      </div>
                    </div>
                </Dialog>
              </div>
              {!this.state.isCalling?
                <BottomNavigation className="bottomNav" >
                  <Button variant="outlined" className="m-2 p-4 btn-lg btn mdc-fab app-fab--absolute mdc-fab--extended text-white bg-danger" color="primary" onClick={this.handleClickOpen.bind(this)}>
                    <span className="mdc-fab__icon material-icons p-2">call</span>
                      <span>Free Consultation</span>
                    </Button>
                </BottomNavigation>
                :
                <BottomNavigation className="bottomNav" >
                  <Button variant="outlined" className="m-2 border-success text-white rounded-lg p-4 btn-lg btn mdc-fab app-fab--absolute mdc-fab--extended text-white bg-success" color="primary" onClick={this.backToCall.bind(this)}>
                    <span className="mdc-fab__icon material-icons p-2 text-white">graphic_eq</span>
                    <span className="text-white">Ongoing Call</span>
                  </Button>
                </BottomNavigation>

              }
              
            </div>

            );
  }
}

export default Call;