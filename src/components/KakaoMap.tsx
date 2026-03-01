import { useGeo } from "@/hooks/useGeo";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const KakaoMap = ({ position, setPosition }: { position: { lat: number; lng: number } | null; setPosition: (position: { lat: number; lng: number }) => void }) => {


  const { location, error } = useGeo();
  const [first, setFirst] = useState(true);
  const [pinRecCount, setPinRecCount] = useState(0);

  const [isOpen, setIsOpen] = useState<boolean[] | null>(null);
  const handleMapClick = (_: any, mouseEvent: kakao.maps.event.MouseEvent) => {
    const latlng = mouseEvent.latLng;
    setPosition({ lat: latlng.getLat(), lng: latlng.getLng() });
    setIsOpen(null)
  };

  const [pins, setPins] = useState<any | null>(null);

  useEffect(() => {
    async function loadPins() {
      const response = await fetch("/api/ai/tour");
      const res = await response.json();
      setPins(res.message);
      setIsOpen(new Array(res.message.length).fill(false));
    }
    loadPins();
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude && first) {
      setPosition({ lat: location.latitude, lng: location.longitude });
      setFirst(false);
    }
  }, [location]);

  const handleMarkerClick = async (id: number, index: number) => {
    const res = await fetch("/api/ai/tour", {
      method: "POST",
      body: JSON.stringify({
        index: id,
        TYPE: "INDEX",
      }),
    });
    const data = await res.json();
    setPinRecCount(data.message);
    setIsOpen((prev) => {
      if (!prev) {
        return new Array(pins.length).fill(false);
      }
      return prev.map((_, i) => i === index);
    });
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!position || !location) {
    return <div>위치를 불러오는 중입니다...</div>;
  }

  return (
    <Map
      center={{
        lng: location.longitude,
        lat: location.latitude,
      }}
      style={{ width: "100%", height: "100%" }}
      level={3}
      onClick={handleMapClick}
    >
      {position && (
        <MapMarker position={position} />
      )}
      {pins?.map((pin: any, index: number) => (
        <>
          <MapMarker clickable={true} onClick={() => handleMarkerClick(pin.id, index)} title={pin.title} key={index} position={{ lat: pin.y, lng: pin.x }}>
            {isOpen && isOpen[index] && (
              <div style={{ backgroundColor: "white", padding: "8px", borderRadius: "10px" }}>
                <h3>장소 이름: {pin.title}</h3>
                <p>장소 설명: {pin.description}</p>
                <p>추천수: {pinRecCount}</p>
              </div>
            )}
          </MapMarker>
        </>
      ))}
    </Map>
  );
};

export default KakaoMap;