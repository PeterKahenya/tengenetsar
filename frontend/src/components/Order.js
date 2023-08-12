import React, { Component } from 'react';
import { Avatar, TextField, Button,Paper } from '@material-ui/core';
import * as config from '../config'
import "./Order.css"

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = { }
        this.updateCart=this.updateCart.bind(this)
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

    render() { 
        // console.log(this.props.cart.order_items)
        return ( 
            <div>
                {this.props.cart.order_items.map(oi=>{
                    let img_path=config.base_url+oi.product.image
                    return(<Paper className="orderItem d-flex bg-light p-2 m-1 align-items-center justify-content-between" key={oi.product.id}>
                            <Avatar className="orderProductImageAvatar">
                                <img className="orderProductImage" src={img_path} />
                            </Avatar>
                            <span className="orderProductName">{oi.product.name.toLowerCase()}</span>
                            <TextField className="orderQuantityInput" style={{width:30}} value={oi.quantity} onChange={(e)=>{this.updateCart(oi,e.target.value,false)}} type="Number"/>
                            <button className="orderDeleteItemButton material-icons" onClick={(e)=>{this.updateCart(oi,0,true)}}>delete</button>
                    </Paper>)
                })}
            </div>
         );
    }
}
 
export default Order;