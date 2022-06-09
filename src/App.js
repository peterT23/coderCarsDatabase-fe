import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';
import ThemeProvider from './theme';
import './App.css';
import { Box, CssBaseline, Typography } from '@mui/material';
import Copyright from './components/Copyright';

function App() {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<CssBaseline />
				<Box className="hero-image" mb={2} display="flex" justifyContent="center" alignItems="center">
					<Typography variant="h1" color="white" className="title">
						CODERCAR DATABASE
					</Typography>
				</Box>
				<Router />
				<Copyright />
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
