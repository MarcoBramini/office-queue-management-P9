import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBarComponentCSS.css';
import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function MyNavBar(props) {
    return (
        <Navbar id="customNavBar" bg="light" variant="light" className="w-100" expand="sm" fixed="top" sticky="top" >
            <Navbar.Brand href="/">
                <img alt="application_logo" src="logo_queue.png" className="px-2" width={60} />
                Office Queue Management
            </Navbar.Brand>
            <Navbar.Toggle />

            <Navbar.Collapse className="d-flex justify-content-end">
                {/* se sono loggato vedo il mio nome sulla navbar, se clicko su LOGOUT faccio logout. 
                Se non sono loggato posso clickare sul bottone LOGIN per fare il login (verrò reinderizzato a /login)*/}
                {props.loggedIn ?
                    <>
                        <Navbar.Text style={{fontWeight: "750"}}className="font-italic mx-3 font-weight-bold">Welcome {props.user.role}, {props.user.username}!</Navbar.Text>
                        <Link to="/" className="link-button" onClick={props.logout}>Log out</Link>
                        <Link disabled className="link-button" onClick={e => e.preventDefault()}>Help?</Link>
                        {/* 
                        <Link to="/">
                            <Button variant="outline-light" className=" mx-2" type="submit" onClick={props.logout}>LOG OUT</Button></Link>
                        */}
                    </>
                    :
                    <Link to="/login" className="link-button">Log in</Link>
                    /* 
                    <Link to="/login">
                        <Button variant="outline-light" className="mx-3 mx-2 " type="submit">LOG IN</Button></Link>
                    */
                }
            </Navbar.Collapse>
        </Navbar >
    )
}

export { MyNavBar };