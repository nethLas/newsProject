import React from 'react';
import { Placeholder, Stack } from 'react-bootstrap';
function StoryCardPlaceholder() {
  return (
    <>
      <>
        <hr />
        <Stack direction="horizontal">
          {' '}
          <Placeholder
            className="w-100"
            animation="glow"
            style={{ textAlign: 'left' }}
          >
            <Placeholder xs={5} />
            <Placeholder xs={11} />
            <Placeholder xs={9} />
            <Placeholder xs={4} />
          </Placeholder>
          <Placeholder //change image size based on screen size
            animation="wave"
            style={{
              height: '136px',
              width: '200px',
              backgroundColor: 'gray',
            }}
            className="ms-auto d-none d-sm-block"
            // loading="lazy"
          />
          <Placeholder
            animation="wave"
            className="d-sm-none ms-auto"
            style={{ height: '100px', width: '100px', backgroundColor: 'gray' }}
          />
        </Stack>
      </>
    </>
  );
}

export default StoryCardPlaceholder;
