import React, { Component } from 'react';
import { Dialog,Button,AppBar,Toolbar,Typography } from "@material-ui/core";
import * as config from '../config'
import "./ProductDetails.css"
import Product from './Product';



class ProductDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    closeDialog(){
        this.props.showProductDetails()
    }
    addToCart(product){
        if (product) {
            this.props.addToCart(product)
        } else {
            this.props.addToCart()
        }
    }
    render() {

        let order_item_index=this.props.cart.order_items.findIndex(order_item=>{
          return order_item.product.id===this.props.product.id
        })

        let associated_tools=this.props.product.associated.map(product=><Product cart={this.props.cart} addToCart={()=>this.addToCart(product)} key={product.id} product={product}/>)


        return ( <Dialog fullScreen onClose={this.closeDialog.bind(this)} open={this.props.open}>
                    <AppBar className="bg-success shadow-lg text-white" position="static">
                        <Toolbar style={{ backgroundColor: '#00b050' }}>
                            <button className="btn text-white material-icons" onClick={this.closeDialog.bind(this)}>
                                arrow_back
                            </button>
                            <Typography>
                                {this.props.product.name}
                            </Typography>
                            {/*<img alt={this.props.product.name} style={{width:50,float:'right'}}  src="https://tengenetsar.kipya-africa.com/static/images/icon.png"/> */}

                        </Toolbar>
                    </AppBar>
                <div className="container mt-3">
                    <div className="row mt-3">
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <img alt={this.props.product.name} className="productImage"  src={this.props.product.image}/>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <h2>{this.props.product.name}</h2>
                            <hr/>
                            <h3 className="mt-1 text-warning">KES. {this.props.product.price}</h3>
                            <hr/>
                            <p className="text-muted">
                                {this.props.product.description}
                            </p>
                            <hr/>
                            {order_item_index===-1?<Button onClick={()=>this.addToCart(this.props.product)} style={{backgroundColor:'#fcca0a'}}>
                                Add To Cart
                                <span className="material-icons">shopping_cart</span>
                            </Button>:<Button style={{backgroundColor:'#00b050',color:'white'}}>
                                In Cart
                                <span className="material-icons">check_circle</span>
                            </Button>}

                        </div>
                    </div>
                    <hr/>
                    <h3 className="text-center text-muted mt-2 mb-2"> Associated Tools</h3>
                    {this.props.product.associated.length?<div className="d-flex justify-content-center text-center flex-wrap">{associated_tools}</div>:<div>No associated tools</div>}
                </div>
        </Dialog> );
    }
}

export default ProductDetails;
