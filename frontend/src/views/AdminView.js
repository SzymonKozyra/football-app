import React, { useState } from 'react';
import AddAdminOrModerator from '../components/AddAdminOrModerator';
import AdminPanel from '../components/AdminPanel';
import { Container, Row, Col, Accordion, ListGroup } from 'react-bootstrap';

const AdminView = ({ setIsLoggedIn }) => {
    const [selectedComponent, setSelectedComponent] = useState(null);

    const renderSelectedComponent = () => {
        switch (selectedComponent) {
            case 'AddUserRole': return <AddAdminOrModerator />;
            case 'AdminPanel': return <AdminPanel setIsLoggedIn={setIsLoggedIn} />;
            default: return <p>Please select an option from the sidebar.</p>;
        }
    };

    return (
        <Container fluid className="my-5">
            <Row>
                <Col md={3}>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Admin Functions</Accordion.Header>
                            <Accordion.Body>
                                <ListGroup>
                                    <ListGroup.Item action onClick={() => setSelectedComponent('AddUserRole')}>
                                        Add Admin/Moderator
                                    </ListGroup.Item>
                                    <ListGroup.Item action onClick={() => setSelectedComponent('AdminPanel')}>
                                        Administration Panel
                                    </ListGroup.Item>
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
                <Col md={9}>
                    <div className="p-4 border rounded shadow-sm bg-light">
                        {renderSelectedComponent()}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminView;
