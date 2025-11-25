import React from 'react';
import { Link } from 'react-router-dom';

export default function Header(){
	return (
		<header>
			<div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
				<div>
					<Link to="/" style={{color:'white',textDecoration:'none'}}><strong>Community Events</strong></Link>
				</div>
				<nav>
					<Link to="/login" className="btn btn-sm btn-secondary" aria-label="Login">Login</Link>
					<Link to="/signup" className="btn btn-sm btn-primary" aria-label="Sign up" style={{ marginLeft: 10 }}>Signup</Link>
				</nav>
			</div>
		</header>
	);
}
