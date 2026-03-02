
const useKakaoLoaderOrigin = require("react-kakao-maps-sdk").useKakaoLoader

export default function useKakaoLoader() {
  useKakaoLoaderOrigin({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY as string,
    libraries: ["clusterer", "drawing", "services"],
  })
}