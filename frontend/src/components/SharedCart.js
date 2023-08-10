import React, { Component } from 'react';
import { Dialog, AppBar, Toolbar, Typography, Container,Drawer } from '@material-ui/core';
import { Avatar, TextField, Button,Paper } from '@material-ui/core';
import "./Order.css"
const config = require("../config")
const helpers = require("../helpers")
const axios = require("axios").default

class SharedCart extends Component{
	constructor(props){
		super(props)
		this.state={
			order_items:[],
			message:null,
            shareable_link:this.props.shareable_link
		}	
	}


	 updateCart(oi,quantity,is_delete){
        // console.log("updateCart in Order",oi,quantity)
        if (quantity==="") {
            return;
        }
        if (parseInt(quantity)<1 && !is_delete) {
            this.props.updateCart({
            product:oi.product,
            quantity:1
        })

        } else {
            this.props.updateCart({
            product:oi.product,
            quantity:quantity
        })
        }
        
    }


    addToCart(product){
        if (product) {
            this.props.updateCart({
            product:{
                id:product.id,
                name:product.name,
                image:product.image,
                price:product.price
            },
            quantity:1
        })
        }
    }


	async componentDidMount(){
		console.log(this.props)
        var response=await axios({
        				url:config.base_url+"/api/shop/get_shared_items",
        				method:"POST",
        				data:{
        					sharedcart:this.props.shareable_link
        				},
        				headers:{
        					"Authorization":"Token "+helpers.getCookie("auth_token"),
        					"X-CSRFToken": helpers.getCookie('csrftoken')
        				}
        			})
        if (response.data.status==="success") {
        	this.setState({order_items:response.data.shared_items})    
        } else {
        	this.setState({message:"Invalid Link"})
        }
    }


    toggleDrawer(){
        this.setState({shareable_link:null})
    }








	render(){
		return <Drawer  anchor="bottom" className="bg-light" onClose={this.toggleDrawer.bind(this)} open={Boolean(this.state.shareable_link)} >
                <h5 className="text-muted p-4 text-center">Shared Products</h5>
				{this.state.message?<div>{this.state.message}</div>:null}

				<div className="d-flex p-4 bg-light flex-column align-items-center justify-content-center">

					{this.state.order_items.map(oi=>{
                    let img_path=config.base_url+oi.product.image
                    let order_item_index=this.props.cart.order_items.findIndex(order_item=>{return order_item.product.id===oi.product.id})

                    return(<Paper style={{maxWidth:300,width:300}} className="orderItem d-flex bg-warning p-2 m-1 align-items-center justify-content-between" key={oi.product.id}>
                            <Avatar className="orderProductImageAvatar">
                                <img className="orderProductImage" src={img_path} />
                            </Avatar>
                            <span className="orderProductName">{oi.product.name.toLowerCase()}</span>
                            {order_item_index===-1?<Button onClick={()=>this.addToCart(oi.product)} style={{backgroundColor:'#fcca0a'}}>
                                Add To Cart
                                <span className="material-icons">shopping_cart</span>
                            </Button>:<Button style={{backgroundColor:'#00b050',color:'white'}}>
                                In Cart
                                <span className="material-icons">check_circle</span>
                            </Button>}

                            {/*<TextField className="orderQuantityInput" style={{width:30}} value={oi.quantity} onChange={(e)=>{this.updateCart(oi,e.target.value,false)}} type="Number"/>
                            <button className="orderDeleteItemButton material-icons" onClick={(e)=>{this.updateCart(oi,0,true)}}> delete</button> */}
                    </Paper>)
                })}
				</div>


		</Drawer>
	}

}


export default SharedCart