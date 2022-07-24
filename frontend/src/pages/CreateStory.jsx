import React from 'react';
import { useState } from 'react';
import { Form, Card, FloatingLabel, Row, Col } from 'react-bootstrap';
function CreateStory() {
  const [sources, setSources] = useState(['']);
  const [locations, setLocations] = useState([
    { address: '', description: '', latitude: 0, longitude: 0 },
    { address: '', description: '', latitude: 0, longitude: 0 },
  ]);
  //images,locations
  const handleSources = (e) => {
    let newSources = [...sources];
    newSources[e.target.dataset.id] = e.target.value;
    newSources = newSources.filter((source, idx) => source.length || idx === 0);
    if (e.target.value) {
      newSources.push('');
    }
    setSources(newSources);
  };
  const objectHasValues = (obj) => {
    return Object.keys(obj).some((key) => obj[key]);
  };
  const handleLocations = (e) => {
    let newLocations = [...locations];
    newLocations[e.target.closest('.row').dataset.id][e.target.name] =
      e.target.value;
    newLocations = newLocations.filter(
      (location, idx) => objectHasValues(location) || idx === 0
    );
    if (e.target.value) {
      newLocations.push({
        address: '',
        description: '',
        latitude: 0,
        longitude: 0,
      });
    }
    setLocations(newLocations);
  };
  return (
    <Form>
      <Form.Group>
        <FloatingLabel label="Title" className="mb-3 fs-5 fw-bold">
          <Form.Control type="text" placeholder="Title" />
        </FloatingLabel>
      </Form.Group>
      <Form.Group>
        <FloatingLabel label="Summary" className="mb-3 fw-bold">
          <Form.Control
            type="text"
            as="textarea"
            placeholder="summary"
            style={{ height: '100px' }}
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Control
          //   plaintext
          as="textarea"
          placeholder="Tell Your Story"
          rows={10}
        />
      </Form.Group>
      <Card style={{ textAlign: 'left' }} className="mb-3" border="primary">
        <Card.Header>Sources</Card.Header>
        <Card.Body>
          <Form.Group>
            {sources.map((source, i) => {
              return (
                <Form.Control
                  onChange={handleSources}
                  key={i}
                  data-id={i}
                  value={source}
                  className="mb-2"
                  placeholder="for example: https://www.bbc.com/news/some-article"
                />
              );
            })}
          </Form.Group>

          <Card.Text className="text-muted">
            Specify the links to the sources you used to let readers know Where
            your information came from
          </Card.Text>
        </Card.Body>
      </Card>
      <Card style={{ textAlign: 'left' }} className="mb-3" border="info">
        <Card.Header>Locations</Card.Header>
        <Card.Body>
          <Form.Group>
            {locations.map((location, i) => {
              return (
                <Row data-id={i} key={i} className="mb-1">
                  <Col xs={7}>
                    <Form.Control
                      placeholder="Address"
                      name="address"
                      onChange={handleLocations}
                      value={location.address}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      placeholder="description"
                      name="description"
                      onChange={handleLocations}
                      value={location.description}
                    />
                  </Col>
                </Row>
              );
            })}
          </Form.Group>

          <Card.Text className="text-muted">
            Specify the Locations where the story takes place
          </Card.Text>
        </Card.Body>
      </Card>
      <Form.Group></Form.Group>
      <Form.Group className="mb-3" style={{ textAlign: 'left' }}>
        <Form.Label className="fw-bold">Images</Form.Label>
        <p className="text-muted">The first image will be the cover (max 6).</p>
        <Form.Control
          type="file"
          id="images"
          // onChange={onMutate}
          max="6"
          accept=".jpg,.png,.jfif,.jpeg"
          multiple
          required
        />
      </Form.Group>
      {/*  
          /> */}
    </Form>
  );
}

export default CreateStory;
