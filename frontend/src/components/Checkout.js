import React, { Component } from 'react';
import ShippingAddressForm from './ShippingAddressForm';
import { Stepper,Step, StepLabel, StepContent, Button, Divider } from "@material-ui/core";
import ConfirmOrder from './ConfirmOrder';
import Order from './Order';
import MPESAPayment from './MPESAPayment';
import * as config from '../config'
const helpers = require("../helpers")

const axios =require("axios")


class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = { activeStep:0,payment:null,addr:{},cart:this.props.cart,orderFullfilled:false,checkoutMessage:"" }
        this.total=0.00

    }

    nextStep(){
        this.setState({activeStep:this.state.activeStep+1})
    }

    prevStep(){
        this.setState({activeStep:this.state.activeStep-1})
    }

    async finishOrder(){
        const response=await axios({
            url:config.base_url+'/api/shop/checkout',
            method:"POST",
            data:{
                shipping_address_id:this.state.addr.id,
                mpesa_payment_id:this.state.payment.id,
                cart:helpers.getCookie("cart")
            },
            headers:{
                
                "Authorization":'Token '+helpers.getCookie("auth_token"),
                "X-CSRFToken": helpers.getCookie('csrftoken')
            }

        })
        if (response.status=201) {
            document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            this.setState({orderFullfilled:true})
        } else {
            this.setState({checkoutMessage:response.data.message})
        }
    }

    updateCart(params){
        this.props.updateCart(params)
    }
    setAddress(addr){
        console.log(addr)
        this.setState({addr:addr})
    }
    setPayment(payment){
        this.setState({payment:payment})
    }


    render() { 
        this.total=0.00
        
        this.props.cart.order_items.map(oi=>{
            var price=oi.product.price
            var quantity=oi.quantity
            this.total=this.total+(price*quantity)
        })

        return ( <div>
            {this.state.orderFullfilled?<div class="p-4 alert alert-success alert-dismissible fade show" role="alert">
                  <strong>Success!</strong> Your Order has been received. Delivery has started.
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                :
                <div class="p-4 alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>Notice!</strong> {this.state.checkoutMessage}
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
            }
            <Stepper activeStep={this.state.activeStep} orientation="vertical">
                <Step key={0}>
                    <StepLabel>Cart</StepLabel>
                    <StepContent>
                        <h2 className="text-warning p-3 font-weight-bold">KES. {this.total} </h2>
                        <Order cart={this.props.cart} updateCart={this.updateCart.bind(this)}/>
                        <button onClick={this.nextStep.bind(this)} className="btn btn-primary">Next</button>
                    </StepContent>
                </Step>
                <Step key={0}>
                    <StepLabel>Delivery Address</StepLabel>
                    <StepContent>
                        <div className="alert alert-success" role="alert">

                        {this.state.addr.city}

                        </div>
                        <ShippingAddressForm nextStep={this.nextStep.bind(this)} address={this.state.addr} setAddress={this.setAddress.bind(this)}/>
                        <Button onClick={this.prevStep.bind(this)} className="btn btn-primary">Back</Button>

                    </StepContent>
                </Step>
                <Step key={1}>
                    <StepLabel>Payment</StepLabel>
                    <StepContent>
                        <MPESAPayment cart={this.props.cart} nextStep={this.finishOrder.bind(this)} setPayment={this.setPayment.bind(this)}/>
                    </StepContent>
                </Step>
            </Stepper>
        </div> );
    }
}
 
export default Checkout;