
export async function POST(req: Request) {
    const body = await req.json();
    const { url } = body;

    const link = `https://${process.env.STORAGE_DOMAIN}/${url}`
    
    const shareData = await fetch(link).then(res => res.blob());

    return new Response(shareData)

}