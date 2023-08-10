import React, { Component } from 'react';
import { TextField, Button,Paper,InputBase,Divider} from "@material-ui/core"
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MyLocationIcon from '@material-ui/icons/MyLocation';

const helpers = require("../helpers")
import * as config from '../config'

const axios = require('axios');

class ShippingAddressForm extends Component {
    constructor(props) {
        super(props);

        this.state = { 
                showNewLocationForm:'none', 
                previous_addresses: [], 
                custom: [], 
                county: "", 
                city: "", 
                longitude: 0.0, 
                latitude: 0.0, 
                full_name: "",
                phone:"",
                suggestions:[],
                enableNext:false,
                description:""
        }

        this.searchService = null;
        this.detailsService = null;
        this.chooseSuggestion = this.chooseSuggestion.bind(this)

    }

    async componentWillMount() {
        this.searchService = new window.google.maps.places.AutocompleteService();
        this.detailsService = new window.google.maps.places.PlacesService(new window.google.maps.Map(document.getElementById("map")));


        let response = await axios({
            url: config.base_url+"/api/shop/addresses",
            method: "GET",
            headers: {
                'Authorization': 'Token ' + helpers.getCookie("auth_token"),
                'X-CSRFToken':helpers.getCookie('csrftoken')
            }
        })
        // console.log(response)
        if (response.status = 200) {
            this.setState({ previous_addresses: response.data })
        }

    }

    changeAddress(addr) {
        this.props.setAddress(addr)
        this.setState({enableNext:true})

    }


    async suggestLocations(term) {
        console.log(term)
        if (term==="") {
            return;
        }
        if (this.searchService) {
            this.searchService.getQueryPredictions({ input: term }, (predictions,status)=>{
                    console.log(predictions,status)

                if (status==="OK") {
                    this.setState({suggestions:predictions})
                }else{
                    console.log(predictions,status)
                }

            });
        } else {

        }
    }

    async chooseSuggestion(location){
        const request = {
            placeId:location.place_id,
            fields:["name","formatted_address","place_id","geometry"]
        }
        this.detailsService.getDetails(request,async (place,status)=>{
            if (status === window.google.maps.places.PlacesServiceStatus.OK){
                console.log(place)
                let response = await axios({
                    url: config.base_url+"/api/shop/addresses",
                    method: "POST",
                    headers: {
                        'Authorization': 'Token ' + helpers.getCookie("auth_token"),
                        'X-CSRFToken':helpers.getCookie('csrftoken')
                    },
                    data:{
                        city:place.name,
                        county:place.name,
                        full_name:place.name,
                        longitude:place.geometry.location.lng(),
                        latitude:place.geometry.location.lat(),
                    }
                })

                if (response.status = 201) {
                    console.log(response.data)
                    this.props.setAddress(response.data)
                    this.setState({suggestions:[],enableNext:true})
                }
            }
        })
    }


    async addLocation() {
        console.log(this.state)
        let response = await axios({
            url: config.base_url+"/api/shop/addresses",
            method: "POST",
            headers: {
                'Authorization': 'Token ' + helpers.getCookie("auth_token"),
                'X-CSRFToken':helpers.getCookie('csrftoken')
            },
            data:{
                city:this.state.city,
                county:this.state.county,
                full_name:this.state.full_name,
                longitude:this.state.longitude,
                latitude:this.state.latitude,
                description:this.state.description
            }
        })

        if (response.status = 201) {
            this.props.setAddress(response.data)
            this.setState({showNewLocationForm:'none',enableNext:true})
        }
    }

    toggleNewLocationForm(){
        if (this.state.showNewLocationForm==='flex') {
            this.setState({showNewLocationForm:'none'})
        } else {
            this.setState({showNewLocationForm:'flex',suggestions:[]})
        }
    }

    async useCurrentLocation(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position)=> {

            var lat= position.coords.latitude 
            var long= position.coords.longitude
            let response = await axios({
                url: config.base_url+"/api/shop/addresses",
                method: "POST",
                headers: {
                    'Authorization': 'Token ' + helpers.getCookie("auth_token"),
                    'X-CSRFToken':helpers.getCookie('csrftoken')
                },
                data:{
                    city:'Your Location',
                    county:'',
                    full_name:'',
                    longitude:long,
                    latitude:lat,
                }
            })

            if (response.status = 201) {
                this.props.setAddress(response.data)
                this.setState({enableNext:true})
            }
        });
        } else {

          alert("Geolocation is not supported by this device.");

        }
    }

    finishAddress(){
        this.props.nextStep()
    }


    render() {
        let showNewLocationForm=this.state.showNewLocationForm==='flex'?'flex':'none'
        console.log(this.state.enableNext)
        return (<div>
                    <span id="map"></span>
                    <Paper component="form" style={{padding:'2px 4px',display:'flex',alignItems: 'center',width: 300}}>
                        <IconButton style={{padding:10}} aria-label="menu">
                            <LocationOnIcon />
                        </IconButton>
                        <InputBase
                            style={{marginLeft: 3,flex: 1,}}
                            id="pac-input"
                            placeholder="Search Google Maps"
                            inputProps={{ 'aria-label': 'search google maps' }}
                            onChange={(e)=>this.suggestLocations(e.target.value)}
                        />
                        <IconButton type="submit" style={{padding:10}} aria-label="menu">
                            <SearchIcon />
                        </IconButton>
                        <Divider style={{height:28,margin:4}} orientation="vertical" />
                        <IconButton onClick={this.toggleNewLocationForm.bind(this)} color="primary" style={{padding:10}} aria-label="directions">
                            <AddIcon />
                        </IconButton>
                    </Paper>
                    <Paper component="form" style={{padding:'10px 10px',display:this.state.showNewLocationForm,flexDirection:'column',alignItems: 'stretch',width: 300,marginTop:'2px'}}>
                        <h6 className="text-center text-success">New Address</h6>
                        <TextField onChange={(e)=>this.setState({county:e.target.value})} className="m-2" variant="outlined" value={this.state.county} placeholder="County" label="County" />
                        <TextField onChange={(e)=>this.setState({city:e.target.value})} className="m-2" variant="outlined" value={this.state.city} placeholder="Nearest Town" label="Nearest Town" />
                        <TextField onChange={(e)=>this.setState({full_name:e.target.value})} className="m-2" variant="outlined" value={this.state.full_name} placeholder="Full Names" label="Full Names" />
                        <TextField onChange={(e)=>this.setState({phone:e.target.value})} className="m-2" variant="outlined" value={this.state.phone} placeholder="Phone Number" label="Phone Number" />
                        <TextField onChange={(e)=>this.setState({description:e.target.value})} className="m-2" variant="outlined" value={this.state.description} placeholder="Descibe Your Location" label="Description" />
                        
                        <div className="d-flex justify-content-around ">
                            <Button className="btn bg-success text-white" onClick={this.addLocation.bind(this)}>Save</Button>
                            <Button className="btn bg-danger text-white" onClick={this.toggleNewLocationForm.bind(this)}>Cancel</Button>
                        </div>
                    </Paper>
                    <Paper style={{width:300}}>
                        {this.state.suggestions.map(location=>{
                            return  <div key={location.place_id}>
                                        <Divider orientation="horizontal" />
                                        <div className="d-flex p-3" style={{width:300,cursor:'pointer'}} onClick={()=>this.chooseSuggestion(location)}>
                                            <LocationOnIcon className="text-muted"/>
                                            <div className="ml-3 text-muted">
                                                <div>{location.description}</div>
                                            </div>
                                        </div>
                                </div>
                        })}
                        <Divider orientation="horizontal" />

                        <div className="d-flex p-3" style={{width:300,cursor:'pointer'}} onClick={this.useCurrentLocation.bind(this)}>
                            <MyLocationIcon className="text-primary"/><span className="ml-5 text-muted">Your Location</span>
                        </div>
                        {this.state.previous_addresses.map(addr=>{
                            let address=addr.county+","+addr.city+","+addr.full_name
                            return <div key={addr.id}>
                                        <Divider orientation="horizontal" />
                                        <div className="d-flex p-3" style={{width:300,cursor:'pointer'}} onClick={()=>this.changeAddress(addr)}>
                                            <LocationOnIcon className="text-muted"/>
                                            <div className="ml-5 text-muted">
                                                <div>{address}</div>

                                            </div>
                                        </div>
                                </div>
                        })}
                    </Paper>
                    {this.state.enableNext?
                        <button className="btn btn-lg btn-primary" onClick={this.finishAddress.bind(this)}>Next</button>:
                        null

                    }


        </div>);
    }
}

export default ShippingAddressForm;
