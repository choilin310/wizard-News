const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");

const app = express();
app.use(express.static("public"));
app.use(morgan("dev"));

// Route to display the list of posts
app.get("/", (req, res) => {
  const posts = postBank.list();

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
    <header><img src="/logo.png"/>Wizard News</header>
    ${posts
      .map(
        (post) => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            <a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      )
      .join("")}
    </div>
  </body>
  </html>`;

  res.send(html);
});

// Route to display a single post
app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);

  if (!post.id) {
    res.status(404);
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>404: Page Not Found</p>
      </div>
    </body>
    </html>`;
    res.send(html);
  } else {
    const html = `<!DOCTYPE html>
      <html>
      <head>
        <title>${post.title}</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <div class="news-item">
          <header><img src="/logo.png"/>Wizard News</header>
          <h2>${post.title}</h2>
          <div>${post.content}</div>
          <small>Posted by ${post.name} on ${post.date}</small>
        </div>
      </body>
      </html>`;

    res.send(html);
  }
});

const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
