import React, { Component } from 'react';
import {ListItem,Paper,Divider } from '@material-ui/core';
import "./CategoriesListView.css"
import * as config from '../config'
const axios = require('axios')

class CategoriesListView extends Component {
    constructor(props) {
        super(props);
        this.state = { categories_list:[],selected_category:"" }

        this.updateProducts = this.updateProducts.bind(this)
    }

    async componentDidMount(){
        let response=await axios({
            url:config.base_url+"/api/shop/categories",
            method:"GET"
        })
        // console.log(response)
        this.setState({categories_list:response.data})
    }

    updateProducts(id,category){
        this.setState({selected_category:id},()=>{
          this.props.updateProducts(config.base_url+"/api/shop/categories/"+id+"/products",category)
        })
    }

    allProducts(){
        this.props.updateProducts(config.base_url+"/api/shop/products","All Products")
    }

    render() {
        return ( <Paper elevation={0} className="categoriesList">
                <h5 className="text-center p-1 text-white bg-success">Categories</h5>
                <ListItem button style={{width:200,cursor:'pointer',padding:10,color:'#00b050'}} onClick={()=>this.allProducts()}>
                        <small className="material-icons category">category</small>
                        <small className="mr-2">All Products</small>
                </ListItem>
                <Divider/>
            {this.state.categories_list.map(category=>{
                return <div key={category.id} style={this.state.selected_category===category.id?{backgroundColor:'#fcca0a'}:{backgroundColor:'#ffffff'}}><ListItem button style={{width:200,cursor:'pointer',padding:10,color:'#555'}} key={category.id} onClick={()=>this.updateProducts(category.id,category.name)}>
                        <small className="material-icons category">category</small>
                        <small className="mr-2">{category.name}</small>
                        </ListItem>
                        <Divider/></div>
            })}
        </Paper> );
    }
}

export default CategoriesListView;
