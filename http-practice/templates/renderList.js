module.exports = function renderList(data) {
  return `<body>
    <div>
    <form action="http://localhost:3000/api/links/" method="POST">
    <div class="form-control">
      <label for="">New Link</label>
      <input type="url" " name="url" placeholder="Enter the link here" />
    </div>
    <input  type="submit" class="btn"></input>
  </form>
      <h3>Links</h3>
    ${data.map((el) => {
      return `
      <div>
      <form action="http://localhost:3000/api/links/put/${el.id}" method="POST">
      <p> <strong>url:</strong> ${el.url}  <strong>id:</strong> ${el.id}</p>
      <input type="url" " name="url" placeholder="Updated link here" />
      <button  type="submit" class="btn">Submit</button>
      </form>
      <form action="http://localhost:3000/api/links/delete/${el.id}" method="POST">
      <button type="submit" class="btn" name="url" name="delete">Delete</button>
      </form>
      </div>
      `;
    })}
    </div>
    </body>
    `;
};
