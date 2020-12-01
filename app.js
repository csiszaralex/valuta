const beLista = document.querySelector("#bevitelvaluta");
const kiLista = document.querySelector("#kivaluta");
const bevitel = document.querySelector("#bevitel")

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
function beValt() {
  document.querySelector("#bevitelertek").innerHTML = this.value;
  valt();
}
function kiValt() {
  document.querySelector("#kiertek").innerHTML = this.value;
  valt();
}
function valt() {
  $.get(
    "https://api.exchangeratesapi.io/latest?base=" +
      beLista[
        beLista.selectedIndex
      ].innerHTML
  )
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
function csere() {
  //! KELL!
}

get();

beLista.addEventListener("change", beValt);
kiLista.addEventListener("change", kiValt);
document.querySelector("#bevitel").addEventListener("keyup", valt);
