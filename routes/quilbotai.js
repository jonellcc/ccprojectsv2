const axios = require('axios');

module.exports.routes = {
  name: "Quillbot AI",
  desc: "Access the Quillbot AI Chat",
  category: "AI",
  query: "?prompt=",
  usages: "/api/ai/quillbotai",
  method: "GET", 
};

module.exports.onAPI = async (req, res) => {
  const userPrompt = req.query.prompt;

  if (!userPrompt) {
    return res.status(400).json({
      error: "Prompt parameter is required"
    });
  }

  try {
    const messageId = Math.random().toString(36).substring(2, 12);
    const createdAt = new Date().toISOString();

    let data = JSON.stringify({
      "stream": true,
      "message": {
        "role": "user",
        "content": userPrompt,
        "messageId": messageId,
        "createdAt": createdAt,
        "files": []
      },
      "product": "ai-chat",
      "originUrl": "/ai-chat",
      "prompt": {
        "id": "ai_chat"
      },
      "tools": []
    });

    let config = {
      method: 'POST',
      url: 'https://quillbot.com/api/raven/quill-chat/responses',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/event-stream',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        'cache-control': 'max-age=0',
        'sec-ch-ua-platform': '"Android"',
        'platform-type': 'webapp',
        'qb-product': '',
        'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Android WebView";v="140"',
        'sec-ch-ua-mobile': '?1',
        'useridtoken': 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjA1NTc3MjZmYWIxMjMxZmEyZGNjNTcyMWExMDgzZGE2ODBjNGE3M2YiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiUXVpbGxib3QgQWNjb3VudCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQWNIVHRjU2Z6XzhtbWxualBiQm9aOUw3dEpqNFpMLVh0OFVzdVZudnJ5VD1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wYXJhcGhyYXNlci00NzJjMSIsImF1ZCI6InBhcmFwaHJhc2VyLTQ3MmMxIiwiYXV0aF90aW1lIjoxNzU3OTg3NDgwLCJ1c2VyX2lkIjoieGdjdU5UY2IyUWJoa0RDYWtmenBrTWtHdDB6MiIsInN1YiI6InhnY3VOVGNiMlFiaGtEQ2FrZnpwa01rR3QwejIiLCJpYXQiOjE3NTg4NjM5MTQsImV4cCI6MTc1ODg2NzUxNCwiZW1haWwiOiJncmFtbWFybHlwcm1nNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJncmFtbWFybHlwcm1nNUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.D-RuOM2LuamFxnaqYqgT_olRXVdvJP_R_bAJgYV4DlIaOUHFpQ5zxRJpaY4-P-jgmI5z9xwPeYx6GVhkCwjLCID6_pGtD6KcZkRU6MN8sSBFGxaIaHXjqUqFhhaIB_ERgpVxLUKqzr0aQkP9rqOoxoQKVpoG7thiMdmqBc0uEKq43GtivKqDeM9p768rgrnZ4Y29Ns5ymmUmNfIeMNtVYXJV7j82BAGdb2VlRLO6qA6XYIu7IB-Q8ya8e1ig1uhdjZDh7Ydr1SuF4wUgX_t2aSHDb5nh6YUYuhdb8T7_ArWIkJdTDOIpdGTSXmXnbM7jiA4f3GMffgPfGFqWXmPJPw',
        'baggage': 'sentry-environment=prod,sentry-release=v32.10.2,sentry-public_key=5743ef12f4887fc460c7968ebb2de54d,sentry-trace_id=02225163bbaa489ab9bc22cd6995808e,sentry-sampled=false,sentry-sample_rand=0.3007431644723153,sentry-sample_rate=0.01',
        'sentry-trace': '02225163bbaa489ab9bc22cd6995808e-a151de7c51cce1ee-0',
        'webapp-version': '32.10.2',
        'origin': 'https://quillbot.com',
        'x-requested-with': 'mark.via.gp',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://quillbot.com/ai-chat/c/new',
        'accept-language': 'en-US,en;q=0.9',
        'priority': 'u=1, i',
        'Cookie': 'anonID=ba5ff4249a87a673; acceptedPremiumModesTnc=false; qdid=7305311042159227792; AMP_MKTG_6e403e775d=JTdCJTIycmVmZXJyZXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRnd3dy5nb29nbGUuY29tJTJGJTIyJTJDJTIycmVmZXJyaW5nX2RvbWFpbiUyMiUzQSUyMnd3dy5nb29nbGUuY29tJTIyJTdE; qbDeviceId=1bec0185-8c89-4404-b952-8c911a0e519a; ajs_anonymous_id=cc913c91-07c2-405e-a4d8-82d58aa81e9d; g_state={"i_p":1757994650010,"i_l":1}; cl_val=72; _gcl_au=1.1.878446723.1757987451; _ga=GA1.1.936787397.1757987456; qbExtInstSrc=%7B%22utm_medium%22%3A%22login%22%2C%22utm_campaign%22%3A%22footer%22%2C%22utm_source%22%3A%22webapp%22%2C%22utm_content%22%3A%22chrome_ext%22%7D; FPID=FPID2.2.SzlmHprM79M8LtsgNG8qJrwMO9ZUtJrAuwrCcsffEkQ%3D.1757987456; FPAU=1.1.878446723.1757987451; _fbp=fb.1.1757987456891.1632489422; authenticated=true; premium=true; ajs_user_id=xgcuNTcb2QbhkDCakfzpkMkGt0z2; abIDV2=315; __cf_bm=Igl5rXHVFDdFrbGrGFpqKed0FLUlNi9_6tHU2E3Z8s0-1758863876-1.0.1.1-xCVsEZ9Lj4FTL1Yg05uxc._LGhJvWE54iQ2B12ImUWyZLcDbUqcATLepjjhWXfh8Oa.JHRQ_AJkn8HU79ocQJ70oQiFi18OzvPAw1XiZ930; _sp_ses.48cd=*; useridtoken=eyJhbGciOiJSUzI1NiIsImtpZCI6IjA1NTc3MjZmYWIxMjMxZmEyZGNjNTcyMWExMDgzZGE2ODBjNGE3M2YiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiUXVpbGxib3QgQWNjb3VudCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQWNIVHRjU2Z6XzhtbWxualBiQm9aOUw3dEpqNFpMLVh0OFVzdVZudnJ5VD1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wYXJhcGhyYXNlci00NzJjMSIsImF1ZCI6InBhcmFwaHJhc2VyLTQ3MmMxIiwiYXV0aF90aW1lIjoxNzU3OTg3NDgwLCJ1c2VyX2lkIjoieGdjdU5UY2IyUWJoa0RDYWtmenBrTWtHdDB6MiIsInN1YiI6InhnY3VOVGNiMlFiaGtEQ2FrZnpwa01rR3QwejIiLCJpYXQiOjE3NTg4NjM5MTQsImV4cCI6MTc1ODg2NzUxNCwiZW1haWwiOiJncmFtbWFybHlwcm1nNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJncmFtbWFybHlwcm1nNUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.D-RuOM2LuamFxnaqYqgT_olRXVdvJP_R_bAJgYV4DlIaOUHFpQ5zxRJpaY4-P-jgmI5z9xwPeYx6GVhkCwjLCID6_pGtD6KcZkRU6MN8sSBFGxaIaHXjqUqFhhaIB_ERgpVxLUKqzr0aQkP9rqOoxoQKVpoG7thiMdmqBc0uEKq43GtivKqDeM9p768rgrnZ4Y29Ns5ymmUmNfIeMNtVYXJV7j82BAGdb2VlRLO6qA6XYIu7IB-Q8ya8e1ig1uhdjZDh7Ydr1SuF4wUgX_t2aSHDb5nh6YUYuhdb8T7_ArWIkJdTDOIpdGTSXmXnbM7jiA4f3GMffgPfGFqWXmPJPw; connect.sid=s%3A6QuNpJNj9YgCZxQu87cFWJYE1YkWwjTC.0hui3OVlQTt%2Bd1p6yKnV0k%2Frf0VieO7I6S1njlq6U9I; _sp_id.48cd=a0962461-6bea-480d-bfa2-5d98c74ac3ff.1757987443.2.1758863970.1757987481.f1f0578d-87ec-4995-b743-3a26035db826.8dd92c30-a206-4b8c-bd6c-2f4151ece621.b6ea88c9-c164-4ee4-be58-64ce1d886b2c.1758863970011.1; _ga_D39F2PYGLM=GS2.1.s1758863971$o2$g0$t1758863971$j60$l0$h449668305; FPLC=sged5FKU7uDMhCt7E9wUH3V5SrQD8Dotj2l6rafSQpxS3anFhfFV2rfn3Wkh8U3iq%2BvueUFQPZrSi5HxDsTFCTWTbCuAFxeqVGQzCTOwXPOumepcQ4CFl%2ByrvJzlbQ%3D%3D; AMP_6e403e775d=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjIxYmVjMDE4NS04Yzg5LTQ0MDQtYjk1Mi04YzkxMWEwZTUxOWElMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjJncmFtbWFybHlwcm1nNSU0MGdtYWlsLmNvbSUyMiUyQyUyMnNlc3Npb25JZCUyMiUzQTE3NTg4NjM5NjM0MjQlMkMlMjJvcHRPdXQlMjIlM0FmYWxzZSUyQyUyMmxhc3RFdmVudFRpbWUlMjIlM0ExNzU4ODYzOTczMDg5JTJDJTIybGFzdEV2ZW50SWQlMjIlM0EyMyU3RA==; _clck=14prz96%5E2%5Efzn%5E0%5E2085; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Sep+26+2025+13%3A19%3A45+GMT%2B0800+(Philippine+Standard+Time)&version=202505.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1&AwaitingReconsent=false; _clsk=oupc57%5E1758863989004%5E1%5E0%5Eh.clarity.ms%2Fcollect; _uetsid=62c513a09a9811f0886b791decc5b504; _uetvid=964be1b0929f11f0922063985d4b6ca6'
      },
      data: data
    };

    const response = await axios.request(config);
    res.json({
      success: true,
      response: response.data
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch response from Quillbot AI",
      details: error.message
    });
  }
};
