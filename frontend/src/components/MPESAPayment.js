import React, { Component } from 'react';
import { TextField,Paper } from '@material-ui/core';
import * as config from '../config'
const helpers = require("../helpers")
const axios = require('axios')

class MPESAPayment extends Component {
    constructor(props) {
        super(props);
        this.state = { mpesa_code:"",payment:null,message:"",enableNext:false,account_no:JSON.parse(helpers.getCookie("user")).first_name }
    }

    async confirmMpesaPayment(){
        let response=await axios({
            url:config.base_url+"/api/shop/payment/payment-method-one/check",
            method:"POST",
            headers:{
                "Authorization": 'Token ' + helpers.getCookie("auth_token"),
                "X-CSRFToken":helpers.getCookie('csrftoken')

            },
            data:{
                code:this.state.mpesa_code
            },
        })
        if (response.status===200 && !response.data.NF) {
            this.props.setPayment(response.data)
            this.setState({payment:response.data,message:"",enableNext:true},() => {
                        this.finishPayment();
            });

        }else{
            this.setState({message:response.data.message,enableNext:false})
        }
    }

    finishPayment(){

        this.props.nextStep()


    }

    render() { 
        let total=parseFloat(0)

        this.props.cart.order_items.map(oi=>{
            console.log(total,parseFloat(oi.product.price),oi.quantity)
            return total=parseFloat(total+parseFloat(oi.product.price)*parseFloat(oi.quantity))
        })

        return ( <div style={{maxWidth:400}}>
                {this.state.payment?
                    <Paper className="bg-success text-white p-4" style={{maxWidth:300}}>
                        Confirmed Payment of KES. {this.state.payment.amount} transaction code {this.state.payment.code}
                         for account number {this.state.payment.account_no} by {this.state.payment.payment_by}
                    </Paper>

                    :null}
                    {this.state.message?
                    <Paper className="bg-warning p-4" style={{maxWidth:400}}>
                        {this.state.message}
                    </Paper>

                    :null}
                <Paper style={{maxWidth:300}}>
                    <img style={{maxWidth:280}}  src={config.base_url+"/static/images/lipanampesa.png"}/>
                </Paper>

                <Paper className="p-3 mt-1">
                    <h4 className="text-muted">Payment Details</h4>
                    <h5>Pay Bill:<strong className="text-success">{config.paybill_no}</strong>  </h5>
                    <h5>Account Number:<strong className="text-success"><i>{this.state.account_no}</i></strong></h5>
                    <h4>Amount :<strong className="text-warning"> KES. {total}</strong></h4>

                </Paper>
                {this.payment?
                    null
                    :
                <Paper style={{maxWidth:280}} className="p-4 mt-1 d-flex flex-column">
                    <TextField id="outlined-basic" label="MPESA Code" variant="outlined" value={this.state.mpesa_code} onChange={(e)=>this.setState({mpesa_code:e.target.value})} />
                    <button className="btn btn-primary mt-1" onClick={this.confirmMpesaPayment.bind(this)}>Confirm & Finish</button>
                </Paper>

                }

        </div> );
    }
}
 
export default MPESAPayment;