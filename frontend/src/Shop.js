import React,{Component} from "react"
import Navigation from './components/Navigation'
import Call from './components/Call'
import ProductsList from './components/ProductsList'
import AuthenticateDialog from "./components/auth/Auth"
import CategoriesListView from "./components/CategoriesListView"
import CallingScreen from "./components/calls/CallingScreen"

import "./Shop.css";
import {Container} from "@material-ui/core"

const helpers = require("./helpers")
const config = require("./config")

const axios = require("axios")





class Shop extends Component{
	constructor(props){
		super(props)
		this.state={
			showAuthDialog:false,
			upateFlag:1,
			products:[],
			cart:{order_items:[]},
			renderCallScreen:false,
			category:"All Products"
		}

		this.authenticate=this.authenticate.bind(this)
		this.updateCart=this.updateCart.bind(this)
	}

	authenticate(){
		if(!helpers.getCookie("auth_token")){
			this.setState({showAuthDialog:true})
		}else{
			console.log("already loggedIn")
			this.setState({showAuthDialog:false})
		}
	}

	async updateCart(data){
        console.log("addToCart in Shop Component",data)

		let cart=await helpers.updateCart(data);
		this.setState({cart:cart})
	}

	toggleAuthDialog(){
		this.setState({showAuthDialog:!this.state.showAuthDialog})
	}

	async updateProducts(url,category){
		// console.log(url)
		let response=await axios({url:url, method:"GET" })
		if (response.status=200) {
			// console.log(Array.isArray(response.data))
			this.setState({
				products:response.data.results,category:category
			})
		}
	}


	async handleStartCall(params) {
	    console.log("usertype",params.utype)
	    console.log("handleStartCall",params)
	    const db = window.firebase.firestore();
	    var roomRef = await db.collection('rooms').add({});
	    console.log("room created ",roomRef.id)

	    var response = await axios({
	    	method:'POST',
	    	url:config.base_url+'/api/calls/start_call',
	    	headers:{
	    		'Authorization':'Token '+helpers.getCookie("auth_token"),
	    		"X-CSRFToken":helpers.getCookie('csrftoken')
	    	},
	    	data:{
	    		receiver:params.receiver.id,
	    		room:roomRef.id,
	    		utype:params.utype
	    	}
	    })

	    if (response.status===200 && response.data.status==="success") {
	    	this.setState({renderCallScreen:true, receiver:params.receiver,callDialogOpen: true,utype:params.utype,roomId:roomRef.id})
	    } else {
	      alert("something went wrong")
	    }
	}


	componentDidMount(){
		helpers.getOrCreateCookieCart()
		if (helpers.getCookie("cart")) {
            // console.log()
            this.setState({cart:JSON.parse(helpers.getCookie("cart"))})
        } else {
            this.setState({cart:{order_items:[]}})
        }
	}


	render(){
		var url = new URL(window.location.href);
		var room_id = url.searchParams.get("r");
		var showCallScreen=this.state.renderCallScreen?'flex':'none'
		if (room_id) {
			return (<div className="d-flex flex-column">
						<Navigation  cart={this.state.cart} updateProducts={this.updateProducts.bind(this)} updateCart={this.updateCart.bind(this)}  authenticate={this.authenticate} />
						<div style={{marginTop:150}}>
							<Container className="d-flex flex-row align-items-start ">
								<div className="desktopCategoriesList">
									<CategoriesListView updateProducts={this.updateProducts.bind(this)} />
								</div>
								<ProductsList cart={this.state.cart} updateCart={this.updateCart.bind(this)} updateProducts={this.updateProducts.bind(this)} products={this.state.products} category={this.state.category} />
							</Container>
						</div>
						<Call isCalling={true} room={room_id} authenticate={this.authenticate} utype="callee"/>
						<AuthenticateDialog
							authSuccess={this.authenticate}
							toggleAuthDialog={this.toggleAuthDialog.bind(this)}
							show={this.state.showAuthDialog}
						/>
						<div id="call_screen">
							<CallingScreen  room={room_id} utype="callee" />
						</div>
					</div>)
		}

		return (<div className="d-flex flex-column">
					<Navigation  cart={this.state.cart} updateProducts={this.updateProducts.bind(this)} updateCart={this.updateCart.bind(this)}  authenticate={this.authenticate} />
					<div style={{marginTop:10}}>
						<Container className="d-flex flex-row align-items-start ">
							<div className="desktopCategoriesList">
								<CategoriesListView updateProducts={this.updateProducts.bind(this)} />
							</div>
							<ProductsList cart={this.state.cart} updateCart={this.updateCart.bind(this)} updateProducts={this.updateProducts.bind(this)} products={this.state.products} category={this.state.category} />
						</Container>
					</div>
					{/*<Call isCalling={false} handleStartCall={this.handleStartCall.bind(this)} authenticate={this.authenticate} utype="callee"/>
					*/}
					<AuthenticateDialog
						authSuccess={this.authenticate}
						toggleAuthDialog={this.toggleAuthDialog.bind(this)}
						show={this.state.showAuthDialog}
					/>

					{/*
						{this.state.renderCallScreen?<div id="call_screen" style={{display:showCallScreen}}>
							<CallingScreen  room={this.state.roomId} utype={this.state.utype} />
						</div>:null}
					*/}

				</div>)
	}

}

export default Shop
