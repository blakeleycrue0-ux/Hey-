exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const { phone } = JSON.parse(event.body);

  if (!phone) {
    return { statusCode: 400, body: JSON.stringify({ error: "No phone number provided" }) };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  try {
    const callRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: phone,
          From: fromNumber,
          Url: "http://twimlets.com/holdmusic?Bucket=com.twilio.music.ambient",
          Timeout: "10",
        }),
      }
    );

    await new Promise((r) => setTimeout(r, 15000));

    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: phone,
          From: fromNumber,
          Body: `Hi — you just missed a call. This is CallCatch AI in action. This is exactly what we do for your business, automatically — so you never lose a lead again. Join the waitlist: https://callcatch.ai`,
        }),
      }
    );

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
