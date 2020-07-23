const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter username</title></head>");
    res.write(
      '<body><form action="/create-user" method="POST"><input type="text" name="user"><button type="submit">Send</button></form></body>'
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/users") {
    res.write("<html>");
    res.write("<head><title>Users</title></head>");
    res.write("<body>");
    res.write("<ul><li>User 1</li><li> User2 </li></ul>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", chunk => {
      body.push(chunk);
    });

    req.on("end", () => {
        const username = Buffer.concat(body).toString().split('=')[1]
        console.log(`username: ${username}`)
        res.writeHead(302, { Location: "/"})
        res.end()
    })
  }
};

module.exports = {
  handler: requestHandler
};
