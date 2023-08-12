import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import "./Navigation.css"
import Cart from './Cart';
import { Menu,Divider } from '@material-ui/core';
import UserProfile from './UserProfile';
import CategoriesListView from './CategoriesListView'
import SharedCart from './SharedCart'
import * as config from '../config'
const helpers = require("../helpers")


class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            leftDrawerOpen:false,
            rightDrawerOpen:false,
            searchTerm:"",
            showUserProfile:false,
            userProfileAnchor:null
        }

    }

    showProfile(){
        if(helpers.getCookie("auth_token")){
            this.setState({userProfileAnchor:this.state.userProfileAnchor?null:document.getElementById('profile_button')})
        }else{
            this.props.authenticate()
        }
    }
    toggleLeft(){
        this.setState({leftDrawerOpen:!this.state.leftDrawerOpen,rightDrawerOpen:false})
    }

    toggleRight(){
        this.setState({rightDrawerOpen:!this.state.rightDrawerOpen,leftDrawerOpen:false})
    }

    componentDidMount(){



    }

    async updateProducts(url,category){
        await this.props.updateProducts(url,category)
        this.setState({leftDrawerOpen:false})
    }

    async search(){
        await this.props.updateProducts(config.base_url+"/api/shop/products/search?search="+this.state.searchTerm,"Search Results for '"+this.state.searchTerm+"'")
    }

    async updateCart(params){
        await this.props.updateCart(params)
    }

    render() {

        var url = new URL(window.location.href);
        var new_shareable_link=null
        if (url.searchParams.get("sharedcart")) {
            new_shareable_link = url.searchParams.get("sharedcart");
        }




        let cart_items_count=this.props.cart.order_items.length
        return (<div>
                    <AppBar className="appbar" elevation={0} position="static">
                        <Toolbar className="toolbar">
                            <div className="toolbarTop">
                                <div  style={{fontSize:50,color:'#00b050'}} onClick={this.toggleLeft.bind(this)} className="material-icons menuButton">
                                    menu
                                </div>
                                <a href="/" className="brand">
                                    <img className="brandImage" src="https://tengenetsarbeta.kipya-africa.com/static/images/brand.png" />
                                </a>
                                <div className="rightButtons d-flex align-items-center justify-content-between">
                                    <span id="profile_button"  aria-controls="simple-menu" aria-haspopup="true" style={{fontSize:70,color:'#00b050'}} className="material-icons m-3" onClick={this.showProfile.bind(this)}>
                                        how_to_reg
                                    </span>
                                    <Menu
                                        id="simple-menu"
                                        onClose={this.showProfile.bind(this)}
                                        keepMounted
                                        anchorEl={this.state.userProfileAnchor}
                                        open={Boolean(this.state.userProfileAnchor)}>
                                        <UserProfile/>
                                    </Menu>
                                    <Button className="p-2 mr-1 bg-success" onClick={this.toggleRight.bind(this)}>
                                        <span style={{fontSize:70,color:'#fcca0a'}}  className="material-icons">
                                            shopping_cart
                                        </span>
                                        <span className="text-white rounded" >{cart_items_count}</span>
                                    </Button>

                                </div>
                            </div>
                            <div className="searchbar">
                                <input value={this.state.searchTerm} onChange={e => this.setState({ searchTerm: e.target.value })} className="searchInput" placeholder="Search Product..."/>
                                <button className="searchButton material-icons" onClick={this.search.bind(this)} >search</button>
                            </div>
                        </Toolbar>
                    </AppBar>

                    {new_shareable_link?<SharedCart cart={this.props.cart} updateCart={this.updateCart.bind(this)} shareable_link={new_shareable_link}/>:null}

                    <div>
                        <Drawer className="leftDrawer" onClose={this.toggleLeft.bind(this)} anchor="left" open={this.state.leftDrawerOpen}>
                            <UserProfile/>
                            <Divider/>
                            <div className="leftDrawerCategories">
                                <CategoriesListView updateProducts={this.updateProducts.bind(this)}/>
                            </div>
                            <br/>
                            <br/>
                            <a href="/help">Help</a>
                            <a href="/terms">Terms</a>
                        </Drawer>
                        <Drawer className="rightDrawer" onClose={this.toggleRight.bind(this)} anchor="right" open={this.state.rightDrawerOpen}>
                            <div className="rightDrawerContent">
                                <Cart authenticate={this.props.authenticate} updateCart={this.updateCart.bind(this)} cart={this.props.cart}/>
                            </div>
                        </Drawer>
                    </div>
                </div>);
    }
}

export default Navigation;
