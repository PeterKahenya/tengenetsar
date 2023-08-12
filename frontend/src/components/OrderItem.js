import React, { Component } from 'react';
import { ListItem } from "@material-ui/core";

class OrderItem extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <ListItem>
            Order Item
        </ListItem> );
    }
}
 
export default OrderItem;