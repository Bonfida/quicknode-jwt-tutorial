import jwt from "@tsndr/cloudflare-worker-jwt";

/**
 * CORS Headers
 * Change this for production
 */
const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// CHANGE THIS FOR PRODUCTION
export function handleOptions(request: Request) {
  let headers = request.headers;
  const origin = headers.get("Origin") as string;
  if (
    origin !== null &&
    headers.get("Access-Control-Request-Method") !== null &&
    headers.get("Access-Control-Request-Headers") !== null
  ) {
    let respHeaders: HeadersInit = {
      ...corsHeaders,
      "Access-Control-Allow-Headers": request.headers.get(
        "Access-Control-Request-Headers"
      ) as string,
      "Access-Control-Allow-Origin": origin,
    };

    return new Response(null, {
      headers: respHeaders,
    });
  } else {
    return new Response(null, {
      headers: {
        Allow: "GET, OPTIONS",
      },
    });
  }
}

export async function handleRequest(request: Request) {
  const isHttps = request.url.startsWith("https:");

  let headers = request.headers;
  const origin = headers.get("Origin") as string;

  if (!isHttps) {
    return new Response("Please use a HTTPS connection.", { status: 403 });
  }

  try {
    const access_token = await jwt.sign(
      {
        exp: new Date().getTime() / 1_000 + 5 * 60, // JWT expires in 5min from now
      },
      // @ts-expect-error
      SECRET,
      { algorithm: "RS256" }
    );

    const response = new Response(
      JSON.stringify({ access_token }),
      // Headers
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "Access-Control-Allow-Origin": origin, // CHANGE THIS FOR PRODUCTION
        },
      }
    );

    return response;
  } catch (e) {
    return new Response("Error getting token.", { status: 400 });
  }
}
