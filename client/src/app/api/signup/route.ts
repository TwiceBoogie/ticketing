export async function POST(req: Request) {
  try {
    const data = await req.json();
    const res = await fetch("http://localhost:3001/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await res.json();

    if (!res.ok) {
      // If there's an error, keep the original response body structure
      const newHeaders: Record<string, string> = {
        "Content-Type": "application/json", // Include other headers as needed
      };
      const setCookieHeader = res.headers.get("Set-Cookie");
      if (setCookieHeader) {
        newHeaders["Set-Cookie"] = setCookieHeader;
      }

      return new Response(
        JSON.stringify({
          status: res.status,
          message: responseData,
          errors: responseData.errors,
        }),
        {
          headers: newHeaders,
          status: res.status,
        }
      );
    }

    // If the response is successful, create a new response with the same body structure
    const newHeaders: Record<string, string> = {
      "Content-Type": "application/json", // Include other headers as needed
    };
    const setCookieHeader = res.headers.get("Set-Cookie");
    if (setCookieHeader) {
      newHeaders["Set-Cookie"] = setCookieHeader;
    }

    return new Response(
      JSON.stringify({
        status: res.status,
        message: responseData,
        errors: [],
      }),
      {
        headers: newHeaders,
        status: res.status,
      }
    );
  } catch (error) {
    console.log(error);
  }
}
