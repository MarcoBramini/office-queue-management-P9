import React from 'react';
import { Container, Row } from 'react-bootstrap';
// import {Link} from 'react-router-dom';
import './CustomSidebar.css'

class CustomSidebar extends React.Component{
  constructor(props){
    super(props);

    this.state = {
        filter:this.props.filter
    };
  }

  setFilterService = async (name)=>{//Onclick del form
    this.state.filter[name]===true ? await this.setState({filter:{...this.state.filter, [name]:false}}) 
                                      : await this.setState({filter:{...this.state.filter, [name]:true}})
    this.props.sidebarSelector(this.state);
  }
  
  render(){

    return (
        <>
        <nav className="nav-menu">
            <Container fluid>
                <Row>
                    <h1 >Service Type</h1>
                </Row>
                <Row>
                <ul className="nav-menu-items">
                    {Object.keys(this.state.filter).map((service) =>{
                        return <li  className="navbar-toggle">
                            <input onClick={(event)=>this.setFilterService(event.target.name)} type='checkbox' name={service} checked={this.state.filter[service]}></input>
                            <label style={{fontSize:"large"}}htmlFor={service}>{service}</label>
                            </li>
                    })}
                </ul>
                </Row>
            </Container>
        </nav>
        </>

    );
  }
}

export default CustomSidebar;