const accountSid = process.env.IMPACT_ACCOUNT_SID;
const authToken = process.env.IMPACT_AUTH_TOKEN;
const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

async function testItemGlobal() {
  const res = await fetch(`https://api.impact.com/Mediapartners/${accountSid}/Items?PageSize=2`, {
    headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' }
  });
  console.log(res.status);
  if (res.ok) {
     const data = await res.json();
     console.log("Items:", JSON.stringify(data.Items, null, 2));
  } else {
     console.log(await res.text());
  }
}
testItemGlobal();
