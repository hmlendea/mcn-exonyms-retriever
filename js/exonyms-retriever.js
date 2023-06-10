const exonymsApiBaseUrl = 'http://hmlendea-exonyms.duckdns.org:8263/Exonyms';
const wikiDataBaseUrl = 'https://www.wikidata.org';
const geoNamesBaseUrl = 'http://api.geonames.org';
const geoNamesUsername = 'geonamesfreeaccountt';

function isSingleElementArray(jsonObject, propertyName) {
    if (jsonObject.hasOwnProperty(propertyName) && Array.isArray(jsonObject[propertyName])) {
        return jsonObject[propertyName].length === 1;
    } else {
        return false;
    }
}

function fetchData(url) {
    console.log('Fetching ' + url + '...');
    const request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send();

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        throw new Error(`Request failed with status ${request.status}`);
    }
}

function getGeoNamesId(wikiDataId) {
    try {
        var wikiDataEndpoint = wikiDataBaseUrl + '/wiki/Special:EntityData/' + wikiDataId + '.json';
        var wikiDataResponse = fetchData(wikiDataEndpoint);
        var claims = wikiDataResponse.entities[wikiDataId].claims;

        if (isSingleElementArray(claims, 'P1566')) {
            var geoNamesId = claims['P1566'][0].mainsnak.datavalue.value;

            console.log('Found GeoNames ID by searching on WikiData: ' + geoNamesId);
            return geoNamesId;
        } else {
            var geoNamesEndpoint = geoNamesBaseUrl + '/searchJSON?username=' + geoNamesUsername + '&q=' + wikiDataId;
            var geoNamesResponse = fetchData(geoNamesEndpoint);

            if (geoNamesResponse.totalResultsCount.value === 1) {
                var geoNamesId = geoNamesResponse.geonames[0].geonameId;

                console.log('Found GeoNames ID by searching on GeoNames: ' + geoNamesId);
                return geoNamesId;
            }
        }

        return null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function retrieveExonyms() {
    var wikiDataId = $("#wikiDataId").val();
    var exonymsApiEndpoint = exonymsApiBaseUrl + "?wikiDataId=" + $("#wikiDataId").val();

    try {
        var geoNamesId = getGeoNamesId(wikiDataId);

        if (geoNamesId != null) {
            exonymsApiEndpoint = exonymsApiEndpoint + '&geoNamesId=' + geoNamesId;
        }

        const response = fetchData(exonymsApiEndpoint);
        $("#location").val(JSON.stringify(response));
    } catch (error) {
        console.error('Error:', error);
    }
}

function copyLocation() {
    var copyText = document.getElementById("location");
    copyText.select();
    copyText.setSelectionRange(0, 99999);

    document.execCommand("copy");
}
