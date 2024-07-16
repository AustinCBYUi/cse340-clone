'use strict'

document.addEventListener("DOMContentLoaded", function() {
    let accountIdURL = "/account/admin/getAccounts"
    fetch(accountIdURL)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Network response was not OK");
        })
        .then(function (data) {
            buildAccountsList(data);
        })
        .catch(function (error) {
            console.log("There was a problem: ", error.message);
        })
})

function buildAccountsList(data) {
    let accountDisplay = document.getElementById("usersDisplay");
    let dataTable = '<thead>';
    dataTable += '<tr><th>Accounts</th></tr>';
    dataTable += '</thead>';
    dataTable += '<tbody>';
    data.forEach(function (element) {
        dataTable += `<tr><td>${element.account_firstname} </td><td>${element.account_lastname}</td><td>${element.account_email}</td><td>${element.account_type}</td>`;
        dataTable += `<td><a href="/admin/edit/${element.account_id}" title="Click to update">Edit</a></td>`;
        dataTable += `<td><a href="/admin/delete/${element.account_id}" title="Click to delete">Delete</a></td></tr>`;
    })
    dataTable += '</tbody>';
    accountDisplay.innerHTML = dataTable;
}