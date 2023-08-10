import React, { Component } from 'react';
import { Container } from '@material-ui/core';
import Product from './Product';
import * as config from '../config'


class ProductsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products:[],
            products_is_fetched:false
         }
    }

    async componentDidMount(){
        await this.props.updateProducts(config.base_url+"/api/shop/products","All Products")
        this.setState({products_is_fetched:true})
    }


    addToCart(data){
        console.log("addToCart in ProductList Component",data)

        this.props.updateCart(data)
    }

    render() {


        let products_list=this.props.products.map(product=>{
            return <Product cart={this.props.cart} addToCart={this.addToCart.bind(this)} key={product.id} product={product} />
        })

        return ( <div>
            <Container className="d-flex flex-column ">
                <h5 className="p-2 text-secondary font-weight-bold">{this.props.category}</h5>
                <div style={{display:'flex',alignItems:'center',justifyContent:'start',flexWrap:'wrap',marginBottom:100}}>
                    {this.state.products_is_fetched?products_list:"Fetching Products..."}
                </div>
            </Container>
            </div> );
    }
}

export default ProductsList;
