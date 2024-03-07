document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("saveAccountDataButton").addEventListener("click", function() {
        openConfirmationDialog();
    });
});

function openConfirmationDialog() {
    // WyÅ›wietlamy okienko z zapytaniem
    var confirmation = confirm("Your profile data will be modified. Are you sure you want to proceed?");

    // JeÅ›li uÅ¼ytkownik naciÅ›nie "Cancel", nic siÄ™ nie dzieje
    if (!confirmation) {
        return;
    }

    // JeÅ›li uÅ¼ytkownik naciÅ›nie "Confirm", przechodzimy do strony account.html
    window.location.href = "account.html";
}