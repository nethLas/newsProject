import React from 'react';
import { useState } from 'react';
import { Form, Card, FloatingLabel, Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import getLocation from '../utils/getLocation';
import axios from 'axios';

const defaultLocation = {
  address: '',
  description: '',
  latitude: '',
  longitude: '',
};
function CreateStory() {
  // const geolocationEnabled = process.env.REACT_APP_GEOLOCATIONENABLED;
  const geolocationEnabled = true;
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    text: '',
    images: {},
  });
  const { title, summary, text } = formData;
  const [sources, setSources] = useState(['']);
  const [locations, setLocations] = useState([{ ...defaultLocation }]);
  const onMutate = function (e) {
    //files
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: e.target.files,
      }));
      //text/bools/nums
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
    }
  };
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
    const current = newLocations[e.target.closest('.row').dataset.id];
    current[e.target.name] = e.target.value;
    newLocations = newLocations.filter(
      (location, idx) => objectHasValues(location) || idx === 0
    );
    if (e.target.value) newLocations.push({ ...defaultLocation });

    setLocations(newLocations);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedLocations = await checkAllValidLocations(locations);
      const form = new FormData();
      form.append('imageCover', formData.images[0]);
      form.append('images', formData.images[1]);
      const data = {
        locations: formattedLocations,
        ...formData,
        sources: [sources[0]],
        images: undefined,
      };
      form.append('data', JSON.stringify(data));
      for (var pair of form.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      await axios.post('/api/v1/stories', form);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
    // const start = Date.now();
    // console.log(
    //   await Promise.all([
    //     getLocation(locations[0].address),
    //     getLocation(locations[1].address),
    //   ])
    // console.log(await getLocation(locations[0].address));
    // console.log(await getLocation(locations[0].address));
    // console.log(`finished in: ${Date.now() - start}`);
  };
  const checkAllValidLocations = async (locations) => {
    const checkDescription = (description) =>
      description.length < 10 || description.length > 60;
    const checkFields = (...fields) => fields.some((field) => !field);

    if (!(locations instanceof Array)) throw new TypeError('Expected an Array');
    let validLocations = [];
    if (!geolocationEnabled) {
      locations.forEach((location) => {
        if (!objectHasValues(location)) return; //if empty object just skip it
        const { description, latitude, longitude } = location;
        const [lat, lng] = [+latitude, +longitude]; //Convert to numbers
        if (checkFields(description, lat, lng))
          throw new Error('Missing one or more Location fields');
        if (checkDescription(description))
          throw new Error(
            'Description should be between 10 and 60 characters long'
          );
        if (lat > 90 || lat < -90 || lng > 180 || lng < -180)
          throw new Error(
            'PLease Provide valid coordinates: Latitude must be between -90° and 90° and longitude must be between -180° and 180°'
          );
        validLocations.push({
          type: 'Point',
          description,
          coordinates: [lat, lng],
        });
      });
      return validLocations;
    } else {
      locations.forEach((location) => {
        if (!objectHasValues(location)) return; //if empty object just skip it
        const { address, description } = location;
        if (checkFields(description, address))
          throw new Error('Missing one or more Location fields');
        if (checkDescription(description))
          throw new Error(
            'Description should be between 10 and 60 characters long'
          );
        if (address.length < 15)
          throw new Error(
            'Address must be longer than 15 chars for us to find it'
          );
        validLocations.push({ address, description });
      });
      let locationPromises = await Promise.all(
        validLocations.map((loc) => getLocation(loc.address))
      );
      console.log(validLocations);
      locationPromises.forEach((location, idx) => {
        location.description = validLocations[idx].description;
        location.coordinates = [location.lng, location.lat];
        location.address = location.formatted;
        location.type = 'Point';
        delete location.lat;
        delete location.lng;
        delete location.formatted;
      });
      console.log(locationPromises);
      return locationPromises;
    }
    // console.log(validLocations);
  };
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group>
        <FloatingLabel label="Title" className="mb-3 fs-5 fw-bold">
          <Form.Control
            type="text"
            placeholder="Title"
            id="title"
            value={title}
            onChange={onMutate}
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group>
        <FloatingLabel label="Summary" className="mb-3 fw-bold">
          <Form.Control
            type="text"
            as="textarea"
            id="summary"
            value={summary}
            onChange={onMutate}
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
          id="text"
          onChange={onMutate}
          value={text}
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
                  type="url"
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
                  {geolocationEnabled && (
                    <Col xs={5}>
                      <Form.Control
                        placeholder="Address"
                        name="address"
                        minLength={15}
                        onChange={handleLocations}
                        value={location.address}
                      />
                    </Col>
                  )}
                  <Col>
                    <Form.Control
                      placeholder="description"
                      name="description"
                      minLength={10}
                      maxLength={60}
                      onChange={handleLocations}
                      value={location.description}
                    />
                  </Col>
                  {!geolocationEnabled && (
                    <>
                      <Col>
                        <Form.Control
                          placeholder="latitude"
                          name="latitude"
                          onChange={handleLocations}
                          value={location.latitude}
                          type="number"
                          max={90}
                          step="any"
                          min={-90}
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          placeholder="longitude"
                          name="longitude"
                          onChange={handleLocations}
                          value={location.longitude}
                          type="number"
                          max={180}
                          step="any"
                          min={-180}
                        />
                      </Col>
                    </>
                  )}
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
          onChange={onMutate}
        />
      </Form.Group>
      <div className="d-grid gap-2">
        <Button type="submit" size="lg">
          Create Story
        </Button>
      </div>
    </Form>
  );
}

export default CreateStory;
