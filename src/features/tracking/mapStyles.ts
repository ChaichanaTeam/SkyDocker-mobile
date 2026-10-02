import type { MapStyleElement } from "react-native-maps";

export const blackGoogleMapStyle: MapStyleElement[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1F2430" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#E4ECF8" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#10141B" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#3A465B" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#F1F5FF" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#1C222A" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#223126" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#2A2F39" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1F332C" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#394559" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#171D28" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#E7EEF9" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2A2F3D" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0B1F31" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9DC6E3" }],
  },
];
