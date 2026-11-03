import { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import { Marker, type MapMarker } from "react-native-maps";

import { DroneIcon } from "@assets/icons";
import { styles } from "@components/ui/map/MapScreen/styles/CheckInMarker.styles";
import { CHECK_IN_STATUS_CONFIG } from "@features/tracking/constants/checkIn";
import type { CheckInMapMarker } from "@features/tracking/types/demoCheckIn";

export const CheckInMarker = ({ checkIn }: { checkIn: CheckInMapMarker }) => {
  const markerRef = useRef<MapMarker>(null);
  const { backgroundColor, iconColor, label } = CHECK_IN_STATUS_CONFIG[checkIn.properties.status];
  const redraw = useCallback(() => markerRef.current?.redraw(), []);

  useEffect(() => {
    const frame = requestAnimationFrame(redraw);
    return () => cancelAnimationFrame(frame);
  }, [backgroundColor, iconColor, redraw]);

  return (
    <Marker
      accessibilityLabel={`Drone check-in: ${label}`}
      coordinate={checkIn.coordinate}
      ref={markerRef}
      tracksViewChanges={false}
    >
      <View onLayout={redraw} style={[styles.pin, { backgroundColor }]}>
        <DroneIcon color={iconColor} height={24} width={25} />
      </View>
    </Marker>
  );
};
