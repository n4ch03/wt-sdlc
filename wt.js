'use latest'
const request = require("request");
const meta = {
  "title": "Social Github Webhook es6 Sample",
  "name": "social-github-es6-sample",
  "version": "1.0.0",
  "author": "auth0",
  "description": "Social Github Webhook ES6 sample for Webtask IO.",
  "type": "application",
  "keywords": [
    "auth0",
    "es6"
  ],
  "secrets": {
    "GITHUB_TOKEN": {
      "description": "Github Token",
      "required": true,
      "default": "TOKEN_INCORRECT"
    }
  }
};

module.exports =  (ctx, req, res) => {
  if (hasMetadataHeader(req)) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(meta));
    return;
  } else if (req.method !== 'GET') {
    res.writeHead(400, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({"result": "Bad Request"}));
    return;
  }

  const options = {
    url: 'https://api.github.com/user/repos?access_token=' + ctx.data.GITHUB_TOKEN + '&affiliation=owner&visibility=private',
    method: "GET",
    headers: {
      'User-Agent': 'WT IO'
    }
  }

  request(options, (error, response, body) => {
    if (error) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({"result": error}));
    } else {
      body = JSON.parse(body);
      let result = ['private owned repos'];
      body.forEach(item => result.push(item.name));
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(result));
    }
  });
}

function hasMetadataHeader(request) {
  const accept = request.headers['accept'] || request.headers['Accept'];
  if (accept === 'application/wt-metadata') {
    return true;
  }
  return false;
}
