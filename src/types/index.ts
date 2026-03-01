export interface ImageResponse {
  artifacts: Array<{
    base64: string;
    seed: number;
    finishReason: string;
  }>;
}

export interface TourCodeRequest {
  numOfRows: number;
  pageNo: number;
  listYN: string;
  arrange: string;
  contentTypeId?: number;
  cat1?: string;
  cat2?: string;
  cat3?: string;
}

export interface TourEventRequest {
  numOfRows: number;
  pageNo: number;
  listYN: string;
  arrange: string;
  contentTypeId: number;
  eventStartDate: string;
}

export interface TourPlaceBasedRequest {
  numOfRows: number;
  pageNo: number;
  listYN: string;
  arrange: string;
  contentTypeId: number;
  mapX: number;
  mapY: number;
  radius: number;
}

export interface TourEventResponse {
  response: {
    body: {
      numOfRows: number; // 한페이지결과수
      pageNo: number; // 현재페이지번호
      totalCount: number; // 전체결과수
      items: {
        item: TourEventItem[];
      };
    };
    header: {
      resultCode: string;
      resultMsg: string;
    };
  };
}

export interface TourEventItem {
  addr1?: string; // 주소(예, 서울중구다동)를응답
  addr2?: string; // 상세주소
  areacode?: string; // 지역코드
  booktour?: number; // 교과서속여행지여부 (1=여행지, 0=해당없음)
  cat1?: string; // 대분류코드
  cat2?: string; // 중분류코드
  cat3?: string; // 소분류코드
  contentid: number; // 콘텐츠ID
  contenttypeid: number; // 관광타입(관광지, 숙박등) ID
  createdtime: string; // 콘텐츠최초등록일
  eventstartdate: string; // 행사시작일 (형식 : YYYYMMDD)
  eventenddate: string; // 행사종료일 (형식 : YYYYMMDD)
  firstimage?: string; // 원본대표이미지 (약 500*333 size) URL 응답
  firstimage2?: string; // 썸네일대표이미지 (약 150*100 size) URL 응답
  cpyrhtDivCd?: string; // 저작권 유형
  mapx?: number; // GPS X좌표 (WGS84 경도좌표) 응답
  mapy?: number; // GPS Y좌표 (WGS84 위도좌표) 응답
  mlevel?: number; // Map Level 응답
  modifiedtime: string; // 콘텐츠수정일
  sigungucode?: number; // 시군구코드
  tel?: string; // 전화번호
  title: string; // 콘텐츠제목
}

export interface TourPlaceBasedItem {
  addr1: string; // 주소
  addr2: string | null; // 상세주소
  areacode: number; // 지역코드
  booktour: number | null; // 교과서속여행지 여부
  cat1: string; // 대분류코드
  cat2: string; // 중분류코드
  cat3: string; // 소분류코드
  contentid: number; // 콘텐츠ID
  contenttypeid: number; // 콘텐츠타입ID
  createdtime: string; // 콘텐츠최초등록일
  dist: number; // 중심좌표로부터 거리 (단위:m)
  firstimage: string | null; // 원본대표이미지 URL
  firstimage2: string | null; // 썸네일대표이미지 URL
  cpyrhtDivCd: string; // 저작권 유형
  mapx: number; // GPS X좌표 (WGS84 경도좌표)
  mapy: number; // GPS Y좌표 (WGS84 위도좌표)
  mlevel: number; // Map Level
  modifiedtime: string; // 콘텐츠수정일
  sigungucode: number; // 시군구코드
  tel: string | null; // 전화번호
  title: string; // 콘텐츠제목
}

export interface TourPlaceBasedResponse {
  response: {
    body: {
      items: {
        item: TourPlaceBasedItem[];
      };
      numOfRows: number; // 페이지당 출력 항목 수
      pageNo: number; // 현재 페이지 번호
      totalCount: number; // 총 결과 개수
    };
    header: {
      resultCode: string;
      resultMsg: string;
    };
  };
}

/** KakaoMap pin data from PlaceForRec */
export interface PlacePin {
  id: number;
  title: string;
  description: string;
  x: number;
  y: number;
}

/** Tour recommendation item used in the recommend algorithm */
export interface TourRecommendItem {
  isHotplace: boolean | null;
  isAdvertisement: boolean | null;
  title: string;
  description: string;
  contentTypeId: number;
  contentId: number;
  x: number;
  y: number;
  overview?: string;
}
