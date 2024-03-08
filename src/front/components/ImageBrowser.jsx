
import { useState, useEffect } from 'react';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup   from 'react-bootstrap/ButtonGroup';

import requests from '../requests';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Figure from 'react-bootstrap/Figure';
import BackIcon from '../icons/chevron-left.svg';
import PreviousIcon from '../icons/arrow-left-circle.svg';
import NextIcon from '../icons/arrow-right-circle.svg';

function ImageBrowser( { rows, onQuit }) {
    
    const [currentPage,  setCurrentPage] = useState(0);
    const [selected, setSelected] = useState([]);
    const [pages, setPages] = useState(rows);
    
    const items = currentPage in pages ? pages[currentPage] : [];
    
    const handlePreviousClick = e => {
        e.preventDefault();
        setCurrentPage(currentPage - 1);
    }
    
    const handleNextClick = e => {
        e.preventDefault();
        setCurrentPage(currentPage + 1);
    }
    
    const handleToggleSelect = (e, image) => {
        e.preventDefault();
        if (selected.includes(image)) {
            setSelected(selected.filter(t => t !== image));
        } else {
            setSelected([...selected, image]);
        }
    }
    
    const handleDelete = (e, image) => {
        if (confirm(`The file will be permanently deleted. Continue anyway ?`)) {
            deleteImage(image);
        }
    }
    
     async function deleteImage(image) {
        const { success } = await requests.post('/files/delete', image);
        
        console.log('success', success);
        
        if (success) {
            const updatedPages = pages
                .map(rows => rows.filter(i => i !== image))
                .filter(rows => rows.length > 1);
            setPages(updatedPages);
        } else {
            alert(`Failed to delete '${image.filename}'`);
        }
         
        
    }
    
    useEffect(() => {
        setSelected([]);
    }, [currentPage]);
    
    useEffect(() => {
        if (pages.length === 0) {
            onQuit();
        } else {
            setCurrentPage(Math.min(currentPage, pages.length - 1));
        }
    }, [pages]);
    
    return (
        <div className="ImageBrowser mt-3">
            
            <ButtonToolbar aria-label="Toolbar with button groups" className="justify-content-between">
                <div>
                    <Button variant="link"
                            onClick = { () => onQuit() }
                    >
                    &lt; &nbsp; Back
                    </Button>
                </div>
                
                <div>
                    { selected.length > 0 && (
                        <Button variant="danger">
                            Delete selected images
                        </Button>
                    )}
                </div>
                
                <div className="d-flex align-items-center">
                    <Button
                        disabled = { currentPage === 0 }
                        variant  = "link"
                        onClick = { handlePreviousClick }
                    >
                        <PreviousIcon />
                    </Button>
                    <div className="ms-4 me-4">
                        { currentPage + 1} / { pages.length }
                    </div>
                    <Button
                        disabled = { currentPage === pages.length - 1 }
                        variant  = "link"
                        onClick = { handleNextClick }
                    >
                        <NextIcon />
                    </Button>
                </div>
            </ButtonToolbar>
            
            <Row className="mt-3">
                { items.map(( image , k) => (
                    <Col xs md="4" 
                        key = { k } 
                        
                    >
                        <Card className="h-100" 
                            className = { selected.includes(image) ? 'border-primary': '' }
                        >
                            <div className="position-relative">
                                <Card.Img variant="top" src={ image.url } />
                                
                                <div className="ImageInfos">
                                    <div className="opacity-75 position-absolute top-0 start-0 bottom-0 end-0 bg-dark" />
                                    <div className="imageInfos position-absolute top-0 start-0 bottom-0 end-0 p-2 text-light">
                                        <small>
                                            <p>
                                                <strong>folder :</strong>
                                                <br/>
                                                { image.folder }
                                            </p>
                                            <p>
                                                <strong>dimensions ( width x height ) :</strong>
                                                <br/>
                                                { image.width } x { image.height }
                                            </p>
                                            <p>
                                                <strong>size :</strong>
                                                <br/>
                                                { image.size }
                                            </p>
                                        </small>
                                        
                                        <Button 
                                            className="position-absolute start-0 bottom-0 ms-2 mb-2"
                                            variant="danger" 
                                            size="sm"
                                            onClick = { e => handleDelete(e, image) }
                                        >
                                            Delete
                                        </Button>
                                        
                                        {/*
                                        <Button 
                                            className="position-absolute end-0 bottom-0 me-2 mb-2"
                                            variant="primary" 
                                            size="sm"
                                            onClick = { e => handleToggleSelect(e, image) }
                                        >
                                            { selected.includes(image) ? 'Unselect' : 'Select' }
                                        </Button>
                                          */ }
                                    </div>
                                </div>
                            </div>
                            <Card.Body>
                                <Card.Text>
                                    { image.filename }
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )) }
            </Row>
    
        </div>
    )
    
}

export default ImageBrowser