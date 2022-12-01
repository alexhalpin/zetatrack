document.addEventListener("DOMContentLoaded", afterLoaded);
function afterLoaded() {
  var button = document.getElementById("saveButton");
  var inputField = document.getElementById("sheetIdInput");
  var debugBox = document.getElementById("debugBox");

  chrome.storage.sync.get(["zetatrackSheetId"], (result) => {
    var value = Object.values(result)[0];
    inputField.value = value;
  });

  button.addEventListener("click", () => {
    console.log("SheetID Saved as: ", inputField.value);

    chrome.storage.sync.set({ zetatrackSheetId: inputField.value }, () => {
      debugBox.innerText = "SheetID Saved";
    });
  });
}
