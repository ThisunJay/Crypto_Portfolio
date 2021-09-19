
const binance = document.getElementById("binancecard");
const coinbase = document.getElementById("coinbasecard");
const apitype = document.getElementById("apitype");


binance.addEventListener("click", function () {
    binance.classList.add('active');
    coinbase.classList.remove('active');
    apitype.value = "BINANCE";
});

coinbase.addEventListener("click", function () {
    coinbase.classList.add('active');
    binance.classList.remove('active');
    apitype.value = "COINBASE";
});
