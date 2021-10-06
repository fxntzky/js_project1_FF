let symbol = "";
const input = document.getElementById("input");
const button = document.getElementById("getButton");
const ContentWrapper = document.getElementById("contentWrapper");
const resultsWrapper = document.createElement("div");

const marquee = document.getElementById("marquee");
const marqueeContainer = document.createElement("div");
marqueeContainer.classList.add("marquee-container");
marquee.append(marqueeContainer);
marqueeContainer.textContent = "Loading...";
fetch(
  `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/stock/list`
)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((element) => {
      const marqueeSymbol = document.createElement("div");
      marqueeSymbol.classList.add("marquee-symbol");
      marqueeSymbol.innerHTML = `${element.symbol}`;

      const marqueePrice = document.createElement("div");
      marqueePrice.classList.add("marquee-price");
      marqueePrice.innerHTML = `($${element.price})`;

      marqueeContainer.append(marqueeSymbol, marqueePrice);
    });
  });

//handle input changes
const inputHandler = (e) => {
  symbol = e.target.value;
  if (e.target.value) {
    // enable button
    button.disabled = false;
  } else {
    // disable button
    button.disabled = true;
    button.textContent = "Search";
  }
};
input.addEventListener("input", inputHandler);

//handle button submit
const getStocks = () => {
  resultsWrapper.innerHTML = null;
  button.disabled = true;
  button.textContent = "Loading...";

  fetch(
    `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${symbol}&limit=10&exchange=NASDAQ`
  )
    .then((response) => response.json())
    .then((data) => {
      const promises = data.map((company) =>
        fetch(
          `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${company.symbol}`
        ).then((response) => response.json())
      );
      Promise.all(promises).then((result) => {
        if (result.length) {
          resultsWrapper.classList.add("results-wrapper");

          for (let i = 0; i <= result.length - 1; i++) {
            const stocksContainer = document.createElement("div");
            stocksContainer.classList.add("stocks-container");

            //create image
            const companyImage = document.createElement("div");
            companyImage.classList.add("stocks-image");
            if (result[i].profile?.image) {
              companyImage.setAttribute(
                "style",
                `background-image: url(${result[i].profile.image})`
              );
            }

            //create name
            const nameStock = document.createElement("a");
            nameStock.href = `./html/company.html?symbol=${result[i].symbol}`;
            nameStock.classList.add("stocks-fetched");
            nameStock.innerHTML = result[i].profile.companyName
              .toLowerCase()
              .replace(
                symbol.toLowerCase(),
                `<span class="highlight">${symbol.toLowerCase()}</span>`
              );

            //create symbol
            const symbolStock = document.createElement("div");
            symbolStock.classList.add("stocks-fetched");
            symbolStock.innerHTML = `(${result[i].symbol})`
              .toUpperCase()
              .replace(
                symbol.toUpperCase(),
                `<span class="highlight">${symbol.toUpperCase()}</span>`
              );

            //create changes
            const stockChanges = document.createElement("div");
            stockChanges.classList.add("stocks-fetched");
            stockChanges.innerHTML = `(${result[i].profile.changesPercentage}%)`;
            //if colors
            if (result[i].profile.changesPercentage >= 0) {
              //show it green
              stockChanges.style.color = "darkcyan";
            } else {
              //show it red
              stockChanges.style.color = "rgb(233, 131, 131)";
            }

            //append
            stocksContainer.append(
              companyImage,
              nameStock,
              symbolStock,
              stockChanges
            );
            resultsWrapper.append(stocksContainer);
            ContentWrapper.append(resultsWrapper);
          }
        }

        history.pushState(null, "", `?symbol=${symbol}`);
        button.textContent = "Done!";
      });
    });
};
button.addEventListener("click", getStocks);
