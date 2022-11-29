chrome.webRequest.onBeforeRequest.addListener(
  zetaLogCallback,
  { urls: ["https://arithmetic.zetamac.com/log"] },
  ["requestBody"]
);

function displayErrorOnZetaTabs(error) {
  findZetaTabs()
    .then((tabArray) => {
      tabArray.forEach((tab) => {
        displayErrorOnTab(tab.id, error);
      });
    })
    .catch(console.error);
}

function findActiveTab() {
  return chrome.tabs.query({ active: true, currentWindow: true });
}

function findZetaTabs() {
  return chrome.tabs.query({ url: "https://arithmetic.zetamac.com/*" });
}

function displayErrorOnTab(tabId, error) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      func: displayError,
      args: [error],
    },
    () => {
      console.log("Displayed Error");
    }
  );
}

function displayError(error) {
  var div = document.createElement("div");
  // div.style.height = "100px";
  // div.style.minWidth = "100px";
  div.style.display = "inline-block";
  div.style.backgroundColor = "red";
  div.style.color = "white";
  div.style.fontSize = "15px";
  div.style.borderRadius = "10px";
  div.style.position = "absolute";
  div.style.bottom = "20px";
  div.style.left = "20px";
  div.style.fontWeight = "bold";

  div.style.paddingLeft = "10px";
  div.style.paddingRight = "10px";
  div.style.paddingTop = "10px";
  div.style.paddingBottom = "10px";

  div.innerText = error;

  document.body.appendChild(div);
  setTimeout(() => {
    div.remove();
  }, 5000);
}

function zetaLogCallback(logDetails) {
  console.log("zetalog request detected");

  key = logDetails.requestBody.formData.key[0];
  if (key == "a7220a92") {
    score = JSON.parse(logDetails.requestBody.formData.problems[0]).length - 1;
    console.log(`Zetalog: ${score}`);

    var values = [[Date.now(), score]];
    var token;

    authorize()
      .then((TOKEN) => {
        console.log(`got token: ${TOKEN}`);
        token = TOKEN;
        return getSheetId();
      })
      .then((SHEET_ID) => {
        console.log(`got sheet id: ${SHEET_ID}`);
        return addValuesToSheet(token, SHEET_ID, values);
      })
      .then((response) => {
        console.log("sheets api response: (below)");
        console.log(response); // check to get the status
      })
      .catch((error) => {
        console.error(error);
        displayErrorOnZetaTabs(error);
      });
  }
}

function getSheetId() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["zetatrackSheetId"], (result) => {
      var value = Object.values(result)[0];
      if (value) {
        resolve(value);
      } else {
        reject("Error: No SheetID Found");
      }
    });
  });
}

function authorize() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, resolve);
  });
}

function addValuesToSheet(ACCESS_TOKEN, SHEET_ID, VALUES) {
  const RANGE = "A1:C1";
  var url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append`
  );
  var params = {
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  return new Promise((resolve, reject) => {
    fetch(url.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        values: VALUES,
      }),
    }).then((response) => {
      if (response.status == 200) {
        resolve(response);
      } else {
        reject(
          `Error: Could not add values to sheet, request returned status ${response.status}`
        );
      }
    });
  });
}
