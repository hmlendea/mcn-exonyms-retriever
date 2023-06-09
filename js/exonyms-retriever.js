const exonymsApiBaseUrl = 'http://hmlendea-exonyms.duckdns.org:8263/Exonyms';

function retrieveExonyms() {
    var url = exonymsApiBaseUrl + "?wikiDataId=" + $("#wikiDataId").val();

    console.log("Fetching " + url + "...");
    fetch(exonymsApiBaseUrl + "?wikiDataId=" + $("#wikiDataId").val(), { method: 'GET', })
        .then(response => response.json())
        .then(data => {
            var jsonContent = JSON.stringify(data);
            $("#location").val(jsonContent);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function copyLocation() {
    var copyText = document.getElementById("location");
    copyText.select();
    copyText.setSelectionRange(0, 99999);

    document.execCommand("copy");
}
