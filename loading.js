function showLoading() {
  const div = document.createElement("div");
  div.classList.add("loading");
  //   document.body.appendChild(div);

  const label = document.createElement("label");
  label.innerText = "Aguarde...";
  div.appendChild(label);
  document.body.insertBefore(div, document.body.firstChild);

//   setTimeout(() => hideLoading(), 2000);
}

function hideLoading() {
  //   alert("hide");
  const loadings = document.getElementsByClassName("loading");

  if (loadings.length) {
    loadings[0].remove();
  }
}
