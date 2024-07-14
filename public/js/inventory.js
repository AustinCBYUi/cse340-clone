'use strict'

//TODO: Something here is broken, it's not reading JSON.
let classificationList = document.querySelector("#classificationList")
classificationList.addEventListener("change", function () {
    let classification_id = classificationList.value;
    console.log(`classification_id is: ${classification_id}`)
    let classIdURL = "/inventory/getInventory/" + classification_id
    fetch(classIdURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Network response was not OK");
        })
        .then(function (data) {
            console.log(data);
            buildInventoryList(data);
        })
        .catch(function (error) {
            console.log("There was a problem: ", error.message);
        })
})

//Build inventory items into HTML table
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay");
    //Set up table labels
    let dataTable = '<thead>';
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
    dataTable += '</thead>';
    //Set up body
    dataTable += '<tbody>';
    //Iterate over all vehicles in the array
    data.forEach(function (element) {
        console.log(element.inv_id + ", " + element.inv_model);
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
        dataTable += `<td><a href="/inv/edit/${element.inv_id}" title="Click to update">Edit</a></td>`;
        dataTable += `<td><a href="/inv/delete/${element.inv_id}" title="Click to delete">Delete</a></td></tr>`;
    })
    dataTable += '</tbody>';
    //Display the contents in the Inventory Manager
    inventoryDisplay.innerHTML = dataTable;
}