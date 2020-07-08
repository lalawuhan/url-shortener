module.exports = function renderList(data) {
  return `<body>
    <div>
    <form action="http://localhost:3000/links/" method="POST" style="display:flex; align-items:center; flex-direction:column; text-align:center;" >
    <div class="form-control">
      <h3>New Link</h3>
      <input type="url"  name="url" placeholder="Enter the link here" style="padding:0.5em; border-radius:6px;" />
    </div>
    <input type="submit" class="btn" style="padding:0.5em; margin-top:1em;"></input>
  </form>
      <h3>Links</h3>
    ${data.map((el) => {
      return `
      <div>
      <form action="http://localhost:3000/links/put/${el.id}" method="POST">
      <p> <strong>url:</strong> ${el.url}  <strong>id:</strong> ${el.id}</p>
      <input type="url" " name="url" placeholder="Updated link here" style="padding:0.5em; border-radius:6px; display:block;" />
      <button type="submit" class="btn" style="padding:0.5em; margin-top:1em;">Submit</button>
      </form>
      <form action="http://localhost:3000/links/delete/${el.id}" method="POST">
      <button type="submit" class="btn" name="url" name="delete" style="padding:0.5em; margin-top:1em;">Delete</button>
      </form>
      </div>
      `;
    })}
    </div>
    </body>
    `;
};
