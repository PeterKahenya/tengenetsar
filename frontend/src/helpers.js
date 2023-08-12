import * as config from './config'
const axios = require("axios")

var getOrCreateCookieCart=()=>{
    let cart = null

    if (!getCookie("cart")) { cart = { order_items: [] }} 
    else {cart = JSON.parse(getCookie("cart"))}
    document.cookie = "cart=" + JSON.stringify(cart) + ";domain;path=/"

    return cart
}


var updateCartCookie=(data) =>{
    let cart = getOrCreateCookieCart()
    let order_item_index=cart.order_items.findIndex(order_item=>{return order_item.product.id===data.product.id})
    if (order_item_index===-1) {
        cart.order_items.push({
            product:data.product,
            quantity:data.quantity
        })
    }else{
        if (data.quantity===0) {cart.order_items.splice(order_item_index,1)} 
        else {cart.order_items[order_item_index].quantity=data.quantity}
    }

    document.cookie = "cart=" + JSON.stringify(cart) + ";domain;path=/"

    return cart
}

var updateCart=(data)=> {
    console.log("addToCart in helpers.js",data)
    
    
    let cart=updateCartCookie(data)
    console.log("Current Cart",cart)

/*
    if (getCookie("auth_token")) {
        var response = await axios({
            method: "POST",
            url: "http://127.0.0.1:8000/api/shop/cart",
            data: {
                "action": data.action,
                "product": data.product,
                "quantity": data.quantity
            },
            headers: { 'Authorization': 'Token ' + getCookie("auth_token") }
        })
        console.log(response)
        return response.status === 200 ? true : false;
    }
*/
    return cart
    
}

var login= async (credentials)=> {
    console.log(credentials)
    var response = await axios({
        method: "POST",
        url: config.base_url+"/api/shop/login",
        headers:{
            "X-CSRFToken":getCookie('csrftoken')
        },
        data: {
            "email": credentials.email,
            "password": credentials.password,
            "gcm_token": credentials.gcm_token
        }
    })

    console.log(response)
    console.log(response.status === 200 && response.data.success)

    if (response.status === 200 && response.data.success) {
        console.log("adding auth_token")
        document.cookie = "auth_token=" + response.data.token +";domain;path=/;expires=Sat, 01 Aug 2037 00:00:00 UTC;"
        document.cookie = "user=" + JSON.stringify({"first_name":response.data.user.user.first_name}) + ";domain;path=/"
        console.log("added auth_token")

        window.location.reload()

        return true
    } else {
        return false
    }
}

var signup= async (credentials)=> {
    var utype = credentials.tab === 0 ? "customers" : "experts"
    var response = await axios({
        method: "POST",
        url: config.base_url+"/api/" + utype + "/signup",
        data: credentials,
        headers:{
            "X-CSRFToken":getCookie('csrftoken')
        }
    })

    console.log(response)

    if (response.status === 201 && response.data.success) {
        document.cookie = "auth_token=" + response.data.token + ";domain;path=/"
        document.cookie = "user=" + JSON.stringify({"first_name":response.data.user.user.first_name}) + ";domain;path=/"
        window.location.reload()

        
    } 

    return response
}


var logout=()=>{
    document.cookie="auth_token=;domain;path=/;expires=Sat, 01 Aug 1970 00:00:00 UTC;"
    window.location.reload()
}


var getCookie=(name)=> {
    var cookieArray = document.cookie.split(";");

    for (let index = 0; index < cookieArray.length; index++) {
        const cookiePair = cookieArray[index].split("=");
        if (name === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}



export { getCookie, login,logout, signup, getOrCreateCookieCart, updateCart }