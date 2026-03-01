import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import OpenAI from "openai";
import { currentUser, auth } from "@clerk/nextjs/server";

const openai = new OpenAI();

// A01 - 자연
// A02 - 인문(문화/예술/역사)
// A03 - 레포츠
// A04 - 쇼핑
// A05 - 음식
// B02 - 숙박
// C01 - 추천코스

export async function POST(req: Request) {
  const body = await req.json();

  const user = await currentUser();

  const userExists = await prisma?.user.findUnique({
    where: { email: user?.emailAddresses[0]?.emailAddress! },
  });
  // Perform your Route Handler's logic with the returned user object

  const {
    TYPE,
    arrange,
    eventStartDate,
    listYN,
    numOfRows = 10,
    pageNo = 1,
    contentTypeId,
    mapX,
    mapY,
    radius = 5000,
    index,
  } = body as TourEventRequest &
    TourPlaceBasedRequest & {
      TYPE: string;
      index: number;
    };

  if (TYPE === "INDEX") {
    const r = await prisma?.placeForRec.findFirst({
      where: {
        id: index,
      },
    });

    const recommends = await prisma?.placeForRec.count({
      where: {
        // userId: userExists?.id as number,
        title: r?.title,
      },
    });

    return NextResponse.json({
      message: recommends,
    });
  }
  if (TYPE === "event") {
    const event = await fetch(
      `http://apis.data.go.kr/B551011/KorService1/searchFestival1?serviceKey=${process.env.TOUR_API_KEY}&MobileOS=AND&MobileApp=Photoisk&_type=json&listYN=${listYN}&arrange=${arrange}&eventStartDate=${eventStartDate}&numOfRows=${numOfRows}&pageNo=${pageNo}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = (await event.json()) as TourEventResponse;

    return NextResponse.json({
      message: response,
    });
  }

  if (TYPE === "place") {
    const place = await fetch(
      `http://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${process.env.TOUR_API_KEY}&MobileOS=AND&MobileApp=Photoisk&_type=json&listYN=${listYN}&arrange=${arrange}&eventStartDate=${eventStartDate}&numOfRows=${numOfRows}&pageNo=${pageNo}&contentTypeId=${contentTypeId}&mapX=${mapX}&mapY=${mapY}&radius=${radius}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const response = (await place.json()) as TourPlaceBasedResponse;

    return NextResponse.json({
      message: response,
    });
  }

  if (TYPE === "recommend") {
    const recommends: any[] = []; // await prisma?.placeForRec.findMany({
    // where: {
    //   x: {
    //     gte: mapX - radius,
    //     lte: mapX + radius,
    //   },
    //   y: {
    //     gte: mapY - radius,
    //     lte: mapY + radius,
    //   },
    // },
    // });

    // const pageNo = Math.floor(Math.random() * 10) + 1;
    let data = null;

    try {
      const response = await fetch(
        `http://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${process.env.TOUR_API_KEY}&MobileOS=AND&MobileApp=Photoisk&_type=json&listYN=Y&arrange=S&numOfRows=10&pageNo=${pageNo}&contentTypeId=${contentTypeId}&mapX=${mapX}&mapY=${mapY}&radius=${radius}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      data = (await response.json()) as TourPlaceBasedResponse;
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        message: [],
      });
    }
    console.log("data", data);

    let tour = null;

    if (data.response?.body.items?.item) {
      tour = data.response?.body.items?.item?.map((item) => {
        return {
          isHotplace: false as boolean | null,
          isAdvertisement: false as boolean | null,
          title: item.title || "",
          description: item.addr1 || "",
          contentTypeId: item.contenttypeid || 0,
          contentId: item.contentid || 0,
          x: item.mapx || 0,
          y: item.mapy || 0,
        };
      });
    }

    console.log("tour", tour);

    const listForSort = tour?.concat(recommends || []) || recommends || [];

    console.log("listForSort", listForSort);

    // 우선순위 결정 알고리즘

    const primaryList = listForSort.filter((item) => {
      return item.isHotplace === true && item.isAdvertisement === true;
    });

    const secondaryList = listForSort.filter((item) => {
      return item.isHotplace === false && item.isAdvertisement === true;
    });

    const tertiaryList = listForSort.filter((item) => {
      return item.isHotplace === true && item.isAdvertisement === false;
    });

    const quaternaryList = listForSort.filter((item) => {
      return item.isHotplace === false && item.isAdvertisement === false;
    });

    const sortedList = primaryList.concat(
      secondaryList,
      tertiaryList,
      quaternaryList
    );

    console.log("sortedList", sortedList);

    const handler = async (item: any) => {
      const responseForOverview = await fetch(
        `http://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${process.env.TOUR_API_KEY}&MobileOS=AND&MobileApp=Photoisk&_type=json&numOfRows=10&pageNo=${pageNo}&contentId=${item.contentId}&overviewYN=Y`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await responseForOverview.json();

      return {
        title: item.title,
        description: item.description,
        contentTypeId: item.contentTypeId,
        contentId: item.contentId,
        x: item.x,
        y: item.y,
        isHotplace: item.isHotplace,
        isAdvertisement: item.isAdvertisement,
        overview: data.response?.body.items.item[0].overview || "",
      };
    };

    const promptForGPT = [];

    for (const item of sortedList) {
      const data = await handler(item);
      promptForGPT.push(data);
    }

    console.log("promptForGPT", promptForGPT);

    if (promptForGPT.length === 0) {
      return NextResponse.json({
        message: [],
      });
    }

    const responseGPT = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
  
          <context>
            You are required to recommend ONLY ONE place to the user.
            !IMPORTANT: THE RECOMMENDATION SHOULD BE BASED ON THE GIVEN DATA. 
            !MOST IMPORTANT: ONLY ONE NUMBER SHOULD BE RETURNED AS THE RESULT.
          </context>
              
          <instruction>
            The recommendation should depend on the following rules:
              1. Advertisement should be recommended first.
              2. Hotplace should be recommended second.
              3. Select the place that is suitable for taking pictures and MZ generation.

            With the input data, you should give the index of the place you want to recommend.
          </instruction>
          `,
        },
        {
          role: "user",
          content: `
            DATA_LENGTH: ${promptForGPT.length}
            INPUT: ${promptForGPT.join("\n")}
          `,
        },
      ],
      // tools: [
      //   {
      //     type: "function",
      //     function: {
      //       name: "recommendationForTouristAttractions",
      //       parameters: {
      //         type: "object",
      //         properties: {
      //           isHotplace: {
      //             type: "boolean",
      //           },
      //           isAdvertisement: {
      //             type: "boolean",
      //           },
      //           title: {
      //             type: "string",
      //           },
      //           description: {
      //             type: "string",
      //           },
      //           contentTypeId: {
      //             type: "number",
      //           },
      //           x: {
      //             type: "number",
      //           },
      //           y: {
      //             type: "number",
      //           },
      //         },
      //       },
      //     },
      //   },
      // ],
    });

    const result = responseGPT.choices[0].message.content as string;

    console.log("result", result);

    const idx = parseInt(result);

    const ret = promptForGPT[idx] || promptForGPT[0];

    console.log("ret", ret);

    const responseForImg = await fetch(
      `http://apis.data.go.kr/B551011/KorService1/detailImage1?serviceKey=${process.env.TOUR_API_KEY}&MobileOS=AND&MobileApp=Photoisk&_type=json&numOfRows=10&pageNo=1&contentId=${ret.contentId}&imageYN=Y&subImageYN=Y`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const dataForImg = await responseForImg.json();

    console.log("dataForImg", dataForImg);

    const url =
      dataForImg.response?.body.items.item[0].originimgurl ||
      dataForImg.response?.body.items.item[0].smallimageurl;

    console.log("url", url);

    const pfr = await prisma.placeForRec.create({
      data: {
        x: parseFloat(ret.x),
        y: parseFloat(ret.y),
        isHotplace: ret.isHotplace,
        isAdvertisement: ret.isAdvertisement,
        title: ret.title,
        description: ret.description,
        contentTypeId: parseInt(ret.contentTypeId),
        contentId: parseInt(ret.contentId),
        userId: userExists?.id as number,
      },
    });

    return NextResponse.json({
      message: {
        ...pfr,
        overview: ret.overview,
        url: url,
      },
    });
  }

  return NextResponse.json({
    message: "Bad Request",
  });
}

export async function GET() {
  const user = await currentUser();

  const userExists = await prisma?.user.findUnique({
    where: { email: user?.emailAddresses[0]?.emailAddress! },
  });

  const recommends = await prisma?.placeForRec.findMany({
    where: {
      userId: userExists?.id as number,
    },
  });

  return NextResponse.json({
    message: recommends,
  });
}
