const beLista = document.querySelector("#bevitelvaluta");
const kiLista = document.querySelector("#kivaluta");
const bevitel = document.querySelector("#bevitel");
const tabla = document.querySelector("#tableall");

let updates = [];
let date = new Date();

function get() {
  $.get("http://localhost:3000/country")
    .done((adat) => {
      adat.forEach((x, i) => {
        let sor = document.createElement("option");
        let sor2 = document.createElement("option");
        if (i === 0) {
          sor.setAttribute("selected", true);
          sor2.setAttribute("selected", true);
          document.querySelector("#bevitelertek").innerHTML = x.symbol;
          document.querySelector("#kiertek").innerHTML = x.symbol;
        }
        sor.value = x.symbol;
        sor2.value = x.symbol;
        sor.innerHTML = x.cc;
        sor2.innerHTML = x.cc;
        beLista.appendChild(sor);
        kiLista.appendChild(sor2);
      });
    })
    .fail(console.error);
}
function getAll() {
  $.get("http://localhost:3000/country")
    .done((adat) => {
      console.log(updates);
      adat.forEach((x, i) => {
        let sor = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");
        let td5 = document.createElement("td");
        td1.innerHTML = i + 1;
        td2.innerHTML = x.cc;
        td3.innerHTML = x.name;
        td4.innerHTML = x.country;
        td5.innerHTML = x.cc === "EUR" ? "Base" : updates[x.cc];
        sor.appendChild(td1);
        sor.appendChild(td2);
        sor.appendChild(td3);
        sor.appendChild(td4);
        sor.appendChild(td5);
        tabla.appendChild(sor);
      });
    })
    .fail(console.error);
}
function lastUpdate() {
  $.get("https://api.exchangeratesapi.io/latest")
    .done((adat) => {
      date = adat.date;
      document.querySelector("#last").innerHTML = "Last update: " + adat.date;
    })
    .fail(console.error)
    .always(moveUpdate);
}
function moveUpdate() {
  let tegnap = new Date(date);
  tegnap.setDate(tegnap.getDate() - 1);
  $.get(
    `https://api.exchangeratesapi.io/${tegnap.getFullYear()}-${
      tegnap.getMonth() + 1
    }-${tegnap.getDay()}`
  )
    .done((adat) => {
      updates = Object.keys(adat.rates).map((key) => key + ";" + adat.rates[key]);
      $.get("https://api.exchangeratesapi.io/latest")
        .done((a2) => {
          let u = Object.keys(a2.rates).map((key) => key + ";" + a2.rates[key]);
          for (let i = 0; i < 32; i++) {
            let data1 = parseFloat(updates[i].split(";")[1]);
            let data2 = parseFloat(u[i].split(";")[1]);
            if (data1 > data2) updates[updates[i].split(";")[0]] = "↓";
            else if (data1 === data2) updates[updates[i].split(";")[0]] = "=";
            else updates[updates[i].split(";")[0]] = "↑";
          }
        })
        .fail(console.error).always(getAll);
    })
    .fail(console.error);
}
function beValt() {
  document.querySelector("#bevitelertek").innerHTML = this.value;
  valt();
}
function kiValt() {
  document.querySelector("#kiertek").innerHTML = this.value;
  valt();
}
function valt() {
  $.get("https://api.exchangeratesapi.io/latest?base=" + beLista[beLista.selectedIndex].innerHTML)
    .done((adat) => {
      const mibe = document.querySelector("#kivaluta")[
        document.querySelector("#kivaluta").selectedIndex
      ].innerHTML;
      document.querySelector("#ki").value =
        adat.rates[mibe] * parseInt(document.querySelector("#bevitel").value);
    })
    .fail(console.error);
  console.log();
}
function details() {
  document.querySelector("#table").classList.toggle("d-none");
  document.querySelector("#valt").classList.toggle("d-none");
}
function csere() {
  let help = $("#bevitel").val();
  $("#bevitel").val($("#ki").val());
  $("#ki").val(help);
  help = beLista.selectedIndex;
  beLista.selectedIndex = kiLista.selectedIndex;
  kiLista.selectedIndex = help;
}

get();
lastUpdate();

beLista.addEventListener("change", beValt);
kiLista.addEventListener("change", kiValt);
document.querySelector("#bevitel").addEventListener("keyup", valt);
document.querySelector("#details").addEventListener("click", details);
document.querySelector("#csere").addEventListener("click", csere);
