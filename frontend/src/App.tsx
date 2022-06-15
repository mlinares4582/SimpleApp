import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [allPhotos, setAllPhotos] = useState([]);
  async function fetchPhotos(){
    const { data } = await axios.get(`${baseUri}getAllPhotos`,  {
      headers: {
        'Access-Control-Allow-Origin' :'*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Access-Control-Request-Headers':'Content-Type'
        }

    });
    setAllPhotos(data);
  }
  useEffect(() => {
    fetchPhotos();
  }, []);

  const baseUri :string = process.env.REACT_APP_API_URL!;
  // console.log(baseUri);

  function getCarouselImage(photo: any){
    return (
    <Carousel.Item interval={1000}>
      <img src={photo.url} alt={photo.filename} />
      <Carousel.Caption>
        <h3>{photo.filename}</h3>
      </Carousel.Caption>
    </Carousel.Item>
    );
  }

  return (
    <div className="App">
     <Carousel>{allPhotos.map((photo) => getCarouselImage(photo))}</Carousel>
    </div>
  );
}

export default App;
