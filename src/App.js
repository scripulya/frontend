import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "react-leaflet-markercluster/dist/styles.min.css";
import axios from "axios";
import "./css/controls.css";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Text,
  Flex,
  CheckboxGroup,
  Checkbox,
  FormControl,
  FormLabel,
  Switch,
  Spinner,
} from "@chakra-ui/react";
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker1x from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

function App() {
  const { toggleColorMode, colorMode } = useColorMode();
  const node = useRef(null);
  const [rents, setRents] = useState();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const buttonStyle = useColorModeValue(
    "white",
    "var(--chakra-colors-gray-800)"
  );
  const iconsStyle = useColorModeValue(
    "var(--chakra-colors-gray-800)",
    "white"
  );

  useEffect(() => {
    axios
      .get("https://azulrent.info/get_locations/")
      .then((response) => {
        setRents(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: marker2x,
      iconUrl: marker1x,
      shadowUrl: markerShadow,
    });
  }, []);
  return (
    <>
      {rents ? (
        <div>
          <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            finalFocusRef={node}
            size={"xs"}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton size={"lg"} />
              <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>

              <DrawerBody>
                <Flex
                  flexGrow={1}
                  borderBottomWidth={"1px"}
                  flexDirection={"column"}
                  marginBottom={"10px"}
                >
                  <CheckboxGroup
                    colorScheme="blue"
                    defaultValue={["coords", "shit"]}
                  >
                    <Checkbox
                      size={"lg"}
                      marginBottom={"1rem"}
                      spacing={"3rem"}
                      value="coords"
                    >
                      Coords layer
                    </Checkbox>
                    <Checkbox
                      size={"lg"}
                      marginBottom={"1rem"}
                      spacing={"3rem"}
                      value="heatmaps"
                    >
                      Heatmaps layer
                    </Checkbox>
                    <Checkbox
                      size={"lg"}
                      marginBottom={"1rem"}
                      spacing={"3rem"}
                      value="shit"
                    >
                      Strange shit
                    </Checkbox>
                  </CheckboxGroup>
                </Flex>
                <FormControl display="flex" alignItems="center">
                  <Switch
                    defaultChecked={colorMode === "dark"}
                    isChecked={colorMode === "dark"}
                    onChange={toggleColorMode}
                    size={"md"}
                    mr={"2rem"}
                  />
                  <FormLabel fontSize={"var(--chakra-fontSizes-md)"} mb="0">
                    Enable Dark Mode
                  </FormLabel>
                </FormControl>
              </DrawerBody>
              <Flex
                alignItems={"center"}
                justifyContent={"flex-end"}
                flexDirection={"column"}
                flexGrow={1}
              >
                <Text fontSize="md">Estonian Rent Explorer</Text>
                <Text fontSize="sm">azulrent.info © 2021</Text>
              </Flex>
            </DrawerContent>
          </Drawer>
          <MapContainer
            style={{ height: "100vh", padding: "0", margin: "0" }}
            center={[59.4745283067, 26.1]}
            zoom={11}
            minZoom={7}
            scrollWheelZoom={true}
            maxBounds={[
              [57, 21.3397953631],
              [60.6110903998, 29.1316992531],
            ]}
            bounceAtZoomLimits={false}
          >
            <LayersControl style={{ zIndex: 0 }} position={"bottomright"}>
              <LayersControl.BaseLayer
                checked={colorMode === "light"}
                name="OpenStreetMap.Mapnik"
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer
                checked={colorMode === "dark"}
                name="OpenStreetMap.BlackAndWhite"
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlYmFrZXJjYXQiLCJhIjoiY2t1cjI5Y21mMHRidzJuczc4c3FwNWJlZyJ9.YMZP306NHJ68i68MEqnoww"
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            <MarkerClusterGroup>
              <GeoJSON
                data={rents}
                onEachFeature={(feature, layer) => {
                  layer.bindPopup(feature.properties.address);
                }}
              />
            </MarkerClusterGroup>
            <div className={"leaflet-top leaflet-left"} style={{ zIndex: 400 }}>
              <div className="leaflet-control" style={{ zIndex: 1 }}>
                <div>
                  <Button
                    ref={node}
                    style={{ zIndex: 1, backgroundColor: buttonStyle }}
                    variant="solid"
                    onClick={onOpen}
                    leftIcon={
                      <svg
                        fill={iconsStyle}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="24px"
                        height="24px"
                      >
                        <path d="M 5.5 9 A 1.50015 1.50015 0 1 0 5.5 12 L 42.5 12 A 1.50015 1.50015 0 1 0 42.5 9 L 5.5 9 z M 5.5 22.5 A 1.50015 1.50015 0 1 0 5.5 25.5 L 42.5 25.5 A 1.50015 1.50015 0 1 0 42.5 22.5 L 5.5 22.5 z M 5.5 36 A 1.50015 1.50015 0 1 0 5.5 39 L 42.5 39 A 1.50015 1.50015 0 1 0 42.5 36 L 5.5 36 z" />
                      </svg>
                    }
                  >
                    Menu
                  </Button>
                </div>
              </div>
            </div>
          </MapContainer>
        </div>
      ) : (
        <Flex
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          h="100vh"
          w="100vw"
        >
          <Spinner color={"blue"} thickness="4px" size={"xl"} />
          <Text mt={"30px"} fontSize={"3xl"}>
            Map is loading...
          </Text>
        </Flex>
      )}
    </>
  );
}

export default App;
