const titleText = window.location.search.replace("?symbol=", "");
const title = document.getElementById("title");
title.textContent = titleText;
let urlCompany = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${titleText}`;

//fetch urlCompany
fetch(urlCompany)
  .then((response) => response.json())
  .then((data) => {
    const pageWrapper = document.getElementById("website-wrapper");
    const resultsWrapper = document.createElement("div");
    resultsWrapper.classList.add("results-wrapper");

    //create chart fetch
    const symbol = titleText;
    const urlChart = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;

    //create companyName
    const companyName = document.createElement("div");
    companyName.classList.add("company-name");
    companyName.innerHTML = data["profile"]["companyName"];
    //create companyImage
    const companyImage = document.createElement("div");
    companyImage.classList.add("stocks-image");
    companyImage.setAttribute(
      "style",
      `background-image: url(${data.profile.image})`
    );
    //create companyName + companyImage
    const containerCompany = document.createElement("div");
    containerCompany.classList.add("company-container");
    //create stockPrice
    const stockPrice = document.createElement("div");
    stockPrice.classList.add("stocks-fetched");
    stockPrice.innerHTML = `($${data["profile"]["price"]})`;
    //create stockChange
    const stockChanges = document.createElement("div");
    stockChanges.classList.add("stocks-fetched");
    stockChanges.innerHTML = `(${data["profile"]["changesPercentage"]}%)`;
    //create companyPrice + companyStock
    const priceStock = document.createElement("div");
    priceStock.classList.add("priceStock-container");
    //if colors
    if (data["profile"]["changesPercentage"] >= 0) {
      //show it green
      stockChanges.style.color = "darkcyan";
    } else {
      //show it red
      stockChanges.style.color = "rgb(233, 131, 131)";
    }
    //crete companyDescription
    const companyDescription = document.createElement("div");
    companyDescription.classList.add("company-description");
    companyDescription.innerHTML = data["profile"]["description"];
    //create companyWebsite
    const companyWebsite = document.createElement("a");
    companyWebsite.classList.add("stocks-fetched");
    companyWebsite.innerHTML = data["profile"]["website"];
    companyWebsite.href = data.profile.website;

    resultsWrapper.append(
      companyName,
      companyImage,
      containerCompany,
      priceStock,
      stockPrice,
      stockChanges,
      companyDescription,
      companyWebsite
    );
    containerCompany.append(companyImage, companyName);
    priceStock.append(stockPrice, stockChanges);
    pageWrapper.append(resultsWrapper);

    const getChart = async () => {
      const response = await fetch(urlChart).then((_response) =>
        _response.json()
      );
      const labels = [];
      const data = [];
      response.historical.forEach((element) => {
        labels.push(element.date);
        data.push(element.close);
      });

      var ctx = document.getElementById("myChart");
      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "history of stocks",
              data,
              backgroundColor: ["rgba(255, 99, 132, 0.2)"],
              borderColor: ["rgba(255, 99, 132, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    };
    getChart();
  });
