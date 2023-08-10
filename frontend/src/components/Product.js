import React, { Component } from 'react';
import { Card, CardActionArea,CardContent, CardActions, Button } from '@material-ui/core';
import ProductDetails from './ProductDetails';
const helpers = require("../helpers")
import * as config from '../config'


class Product extends Component {
    constructor(props) {
        super(props);
        this.state = { product:this.props.product,showDetails:false }
    }


    showProductDetails(){
        this.setState({showDetails:!this.state.showDetails})
    }

    addToCart(product){
        console.log("addToCart in Product Component",product)
        if (product) {
            this.props.addToCart({
            product:{
                id:product.id,
                name:product.name,
                image:product.image,
                price:product.price
            },
            quantity:1
        })
        }else{
            this.props.addToCart({
                product:{
                    id:this.props.product.id,
                    name:this.props.product.name,
                    image:this.props.product.image,
                    price:this.props.product.price
                },
                quantity:1
            })
    }
    }

    render() {
        // console.log("product props",this.props.cart)
        String.prototype.toProperCase = function () {
          return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };


        let order_item_index=this.props.cart.order_items.findIndex(order_item=>{return order_item.product.id===this.state.product.id})

        // console.log("product index in cart",order_item_index)


        return ( <div>
            <Card style={{minWidth: 250,minHeight: 330,margin:5,padding:5,boxShadow:'none',width:250,height:250,display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
                <CardActionArea onClick={this.showProductDetails.bind(this)}>
                    <img style={{maxWidth:150,maxHeight:150}} src={this.state.product.image}/>
                    <CardContent>
                        {this.state.product.name.toProperCase()}
                    </CardContent>
                    <CardContent className="text-danger font-weight-bold">
                        KES. {this.state.product.price}
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {order_item_index===-1?<Button onClick={()=>this.addToCart(this.state.product)} style={{backgroundColor:'#fcca0a'}}>
                        Add To Cart
                        <span className="material-icons">shopping_cart</span>
                    </Button>:<Button style={{backgroundColor:'#00b050',color:'white'}}>
                        In Cart
                        <span className="material-icons">check_circle</span>
                    </Button>}
                </CardActions>
            </Card>
            <ProductDetails cart={this.props.cart} showProductDetails={this.showProductDetails.bind(this)} addToCart={this.addToCart.bind(this)} product={this.state.product} open={this.state.showDetails}/>

            </div> );
    }
}

export default Product;
