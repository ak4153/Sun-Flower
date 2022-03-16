/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
const defaultGeoLocation = { latitude: 32.109333, longitude: 34.855499 };
import { CircularProgress } from '@mui/material';
import {
  GoogleMap,
  LoadScript,
  StandaloneSearchBox,
} from '@react-google-maps/api';
import dynamicSSR from '../utils/dynamicFunction';
import useStyles from '../utils/styles';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';

const libs = ['places'];
function Map() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { user } = state;
  const [googleKey, setGoogleKey] = useState();
  const [alert, setAlert] = useState({});
  const [center, setCenter] = useState(defaultGeoLocation);
  const [location, setLocation] = useState(center);
  const classess = useStyles();

  useEffect(() => {
    const fetchGoogleApi = async () => {
      try {
        const { data } = await axios.get('api/keys/googleapi', {
          headers: { authorization: `Bearer ${user.token}` },
        });
        setGoogleKey(data);
        getUserLocation();
      } catch (err) {
        console.log(err);
      }
    };
    fetchGoogleApi();
  }, []);

  const mapRef = useRef(null);
  const placeRef = useRef(null);

  const onLoad = (map) => {
    //current

    mapRef.current = map;
    console.log(mapRef.current);
  };

  const onIdle = () => {
    setLocation({
      latitude: mapRef.current.lat(),
      longitude: mapRef.current.lng(),
    });
  };
  const onLoadPlaces = (place) => {
    placeRef.current = place;
  };
  const onPlacesChanged = () => {
    const place = placeRef.current.getPlaces()[0].geometry.location;
    setCenter({ latitude: place.lat(), longitude: place.lng() });
    setLocation({ latitude: place.lat(), longitude: place.lng() });
  };
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setAlert({
        message: "geolocation isn't supported by this browser",
        severity: 'error',
      });
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  };
  const onConfirm = () => {
    const places = placeRef.current.getPlace();
    if (places && places.length === 1) {
      dispatch({
        type: 'SAVE_SHIPING_ADDRESS',
        payload: {
          lat: location.latitude,
          lng: location.longitude,
          address: places[0].formatted_address,
          name: places[0].name,
          vicinity: places[0].vicinity,
          googleAddressId: places[0].id,
        },
      });
      setAlert({ message: 'location selected successfully', severity: 'info' });
      router.push('/shipping');
    }
  };
  return googleKey ? (
    <div className={classess.fullContainer}>
      <LoadScript libraries={libs} googleMapsApiKey={googleKey}>
        <GoogleMap
          id="google_map"
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={13}
          //   onLoad={onLoad}
          //   onIdle={onIdle}
        >
          <StandaloneSearchBox
            onLoad={onLoadPlaces}
            onPlacesChanged={onPlacesChanged}
          >
            <div className={classess.mapInputBox}>
              <input type="text" placeholder="enter your address" />
              <button type="button" className="primary" onClick={onConfirm}>
                confirm
              </button>
            </div>
          </StandaloneSearchBox>
        </GoogleMap>
      </LoadScript>
    </div>
  ) : (
    <CircularProgress />
  );
}
export default dynamicSSR(Map);
