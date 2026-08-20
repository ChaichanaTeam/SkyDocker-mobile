import type { MapStyleElement } from "react-native-maps";

export const blackGoogleMapStyle: MapStyleElement[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#16181D" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#D9E2F2" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#16181D" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#2F3541" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#1B1E25" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#20242C" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#18251F" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2A303A" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#111318" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#B9C4D6" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#202631" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#081D33" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#89A8C6" }],
  },
];
