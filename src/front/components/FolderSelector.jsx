import { useState, useEffect, Fragment } from 'react';

import ProgressBar  from 'react-bootstrap/ProgressBar';
import Button       from 'react-bootstrap/Button';
import Row          from 'react-bootstrap/Row';
import Col          from 'react-bootstrap/Col';
import Alert        from 'react-bootstrap/Alert';
import Card         from 'react-bootstrap/Card';

import requests from '../requests';


function FolderSelector( { onResultsFound }) 
{
    
    const [progress, setProgress] = useState(null);
    const [results,  setResults] = useState([]);
    const [message,  setMessage] = useState(
        'Supported extensions are : .jpg, .jpeg, .bmp, .gif, .png'
    );
    const [btnLabel, setBtnLabel] = useState(
        'Select folder containing images'
    );
    
    const handleClickSelectFolder = async (e) => {
        e.preventDefault();
        
        const [ folder ] =  await requests.trigger('select-folder');
        
        if (folder) {
            let progress = 0, values = {};
            while (progress < 100) {

                values = await requests.post('/folders/scan', { folder });

                progress = values.progress;

                setProgress(values.progress)

                await wait(250);
            }
            
            const results = values.output || [];
            
            if (results.length > 0) {
                setResults(values.output || []);
            } else {
                setMessage(`No duplicates images found in "${folder}"`);
                setBtnLabel("Select another folder");
            }
            
            setProgress(null);
        }
        
    }
    
    useEffect(() => {
        if (results.length > 0) {
            onResultsFound(results);
        }
    }, [results]);
    
    return (
        <div>
            <Card className="text-center position-absolute top-50 start-50 translate-middle">
                <Card.Body>
                  <Card.Title className="mb-4">Duplicate Image Remover</Card.Title>

                    { (progress === null) && (
                        <Fragment>        
                        
                            <Card.Text>
                                { message }
                            </Card.Text>
                
                            <Button onClick= { handleClickSelectFolder } >
                                { btnLabel }
                            </Button>
                        </Fragment>
                    ) }

                    { ( progress !== null ) && (
                        <div> 
                            <p>Scanning folder ...</p>
                            <ProgressBar now={progress} label={`${Math.round(progress * 100) / 100}%`} />
                        </div>
                    ) }
            
                </Card.Body>
            </Card>
        </div>
    )
}

const wait = (delay) => new Promise(resolve => {
    setTimeout(() => resolve(), delay)
})


export default FolderSelector;