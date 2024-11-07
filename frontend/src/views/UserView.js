import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const UserView = () => {
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Page Under Construction</Card.Title>
                            <Card.Text>
                                This section is currently being developed. Please check back later for more features and content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserView;
