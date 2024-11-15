import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import FavoriteItems from "../components/FavoriteItems";

const UserView = () => {
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="text-center">
                        <Card.Body>
                            <FavoriteItems />

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserView;
