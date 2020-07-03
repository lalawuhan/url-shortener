module.exports = function renderList(data) {
  return `<body>
    <ul>
    ${data.map((el) => {
      return `
      <li> <strong>url:</strong> ${el.url}</li>
      <li> <strong>id:</strong> ${el.id}</li>
      `;
    })}
    </ul>
    </body>
    `;
};
