import React from 'react';
import { useState, useEffect } from 'react';
import { Carousel, Card, ListGroup, Image, Stack } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { getStory } from '../features/stories/storiesSlice';
import Spinner from '../components/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { reset, setLoading } from '../features/stories/storiesSlice';

const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
};

function Story() {
  const { story, isLoading, isError, message } = useSelector(
    (state) => state.stories
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();
  useEffect(() => {
    if (isError) toast.error(message);
    dispatch(getStory(slug));
    return () => dispatch(reset());
  }, [dispatch, isError, message]);

  if (isLoading || Object.keys(story).length === 0) return <Spinner />;
  return (
    <div style={{ textAlign: 'left' }}>
      <h2 className="fw-bold">{story.title}</h2>
      <p className="text-muted fs-3">{story.summary}</p>
      <hr />
      <Carousel
        style={{ aspectRatio: '18.5/9' }}
        interval={2000}
        className=" d-flex mb-2"
      >
        <Carousel.Item>
          <img className="w-100" src={story.imageCoverUrl} alt="First slide" />
        </Carousel.Item>
        {story.imageUrls.map((img, i) => {
          return (
            <Carousel.Item key={i}>
              <img className="w-100" src={img} alt="First slide" />
            </Carousel.Item>
          );
        })}
      </Carousel>
      <hr />
      <Stack gap={2} direction="vertical">
        <div style={{ alignContent: 'center' }}>
          <Image
            roundedCircle
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            src={
              story.author.profileUrl ||
              'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60'
            }
            alt="user"
            className="me-2"
          />
          <span className="fw-bold fs-4">By {story.author?.name}</span>
        </div>
        {new Date(story.createdAt).toLocaleDateString('en-US', options)}
      </Stack>
      <hr />
      <div style={{ whiteSpace: 'pre-wrap' }} className="fs-4">
        {story.text}
      </div>
      <hr />
      <Card>
        <Card.Header>Sources</Card.Header>
        <ListGroup variant="flush">
          {story.sources.map((source) => (
            <ListGroup.Item>
              {new URL(source).hostname} :{' '}
              <Card.Link key={source} href={source}>
                {source}
              </Card.Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
      <hr />
      <div>
        <MapContainer
          center={story.locations[0].coordinates.slice().reverse()}
          className="mb-3"
          scrollWheelZoom={false}
          style={{ height: '400px' }}
        >
          <TileLayer
            attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors'
            url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${process.env.REACT_APP_GEOCODE_API_KEY}`}
          />
          {story.locations.map((location, i) => (
            <Marker
              key={location._id}
              position={location.coordinates.slice().reverse()}
            >
              <Popup>{location.description}</Popup>
            </Marker>
          ))}
          <CenterMap locations={story.locations} />
        </MapContainer>
      </div>
    </div>
  );
}
function CenterMap({ locations }) {
  const map = useMap();
  const bounds = new L.latLngBounds(
    locations.map((loc) => loc.coordinates.slice().reverse())
  );
  map.fitBounds(bounds);
  if (locations.length === 1) map.setZoom(13);
  return null;
}

export default Story;
