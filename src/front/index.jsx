
import React from 'react';
import { createRoot } from 'react-dom/client';
import { useState } from 'react';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import '@mdbootstrap/bootstrap-dark-mode/css/bootstrap-dark-mode.dark.min.css';
import './styles.scss'

import Container      from 'react-bootstrap/Container';
import FolderSelector from './components/FolderSelector';
import ImageBrowser   from './components/ImageBrowser';

import requests from './requests';

const wait = (delay) => new Promise(resolve => {
    setTimeout(() => resolve(), delay)
})

function App() 
{
    
    const [results, setResults] = useState([]);
    
    function reset() {
        window.location.reload();
    }
    
    return (
        <Container fluid>

            { results.length === 0 && (
                <FolderSelector onResultsFound = { setResults } />
            ) }
            
            { results.length > 0 && (
                <ImageBrowser rows = { results} onQuit = { reset } />
            ) }
        </Container>
    )
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);