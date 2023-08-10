import React, { Component } from 'react';
import { Dialog, AppBar, Toolbar, Typography, Container } from '@material-ui/core';
import Checkout from './Checkout';
import Order from './Order';
const helpers = require("../helpers")
const config = require("../config")
const axios=require("axios")
import { Button, TextField, Tab, Tabs } from '@material-ui/core';




class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = { openCheckout:false,shareable_link:null }

        this.total=0.00
    }

    handleOpenCheckout(){
        if (helpers.getCookie("auth_token")) {
        this.setState({openCheckout:!this.state.openCheckout})
        } else {
            this.props.authenticate()
        }
    }

    updateCart(params){
        // console.log("updateCart in Cart Component")

        this.props.updateCart(params)
    }

    async showLink(){
        if (helpers.getCookie("auth_token")) {
        this.setState({preparing_link:true},async ()=>{
            var response=await axios({url:config.base_url+'/api/shop/get_shareable_link',
            method:"POST",
            data:{
                cart:helpers.getCookie("cart")
            },
            headers:{
                "Authorization":'Token '+helpers.getCookie("auth_token"),
                "X-CSRFToken": helpers.getCookie('csrftoken')
            }})

            if (response.data.status==="success") {
                this.setState({shareable_link:config.base_url+response.data.shareable_link})
            }
        })
    }else{
        this.props.authenticate()
    }
    }


    componentDidMount(){
    }

    render() {
        this.total=0.00
        
        this.props.cart.order_items.map(oi=>{
            var price=oi.product.price
            var quantity=oi.quantity
            this.total=this.total+(price*quantity)
        })


        return ( <div className="m-4 p-4">
            <h3 className="text-warning p-2">KES. {this.total} </h3>
            <button onClick={this.showLink.bind(this)} class="btn btn-primary material-icons">
                share
            </button>
            <br/>
            <br/>

            <div>
            {this.state.shareable_link? <TextField autoFocus={true} style={{width:'90%'}} label="Copy Link and Share" variant="outlined" value={this.state.shareable_link} /> :null}
            </div>

            <hr/>
            <Order updateCart={this.updateCart.bind(this)} cart={this.props.cart} />

            <Dialog open={this.state.openCheckout} fullScreen>
                <AppBar className="bg-success text-white" position="static">
                    <Toolbar style={{ backgroundColor: '#00b050' }}>
                        <button className="btn text-white material-icons" onClick={this.handleOpenCheckout.bind(this)}>
                            arrow_back
                        </button>
                        <Typography>
                            Checkout
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container>
                    <Checkout updateCart={this.updateCart.bind(this)} cart={this.props.cart} />
                </Container>
                <br/>
                <hr/>
                <Container>
                    <h3>Minimum Order & Delivery</h3>
                    <p class="text-muted">
                        The minimum total order is KES 3,000. Delivery is free for total orders more than KES 10,000. 
                        Orders less than KES 10,000 attract delivery charges of KES 350 within Nairobi and KES 500 outside Nairobi.
                    </p>
                </Container>
            </Dialog>
            <hr/>
            

            <button className="btn btn-lg btn-primary" onClick={this.handleOpenCheckout.bind(this)}>Proceed to Checkout</button>
        </div> );
    }
}
 
export default Cart;