const exonymsApiBaseUrl = 'https://hmlendea.go.ro/apis/exonyms-api';
const wikiDataBaseUrl = 'https://www.wikidata.org';
const geoNamesBaseUrl = 'http://api.geonames.org';
const geoNamesUsername = 'geonamesfreeaccountt';

$(document).ready(function() {
    clearPage();
});

function clearPage() {
    $('#wikiDataId').val('Q20717572');
    $('#location').val('');
}

function isSingleElementArray(jsonObject, propertyName) {
    if (jsonObject.hasOwnProperty(propertyName) && Array.isArray(jsonObject[propertyName])) {
        return jsonObject[propertyName].length === 1;
    } else {
        return false;
    }
}

function fetchData(url) {
    console.log('Fetching ' + url + ' ...');
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

function transformNameToId(name) {
    let locationId = '';

    locationId = name.replace(/æ/g, 'ae')
        .replace(/[ČčŠšŽž]/g, '$&h')
        .replace(/[Ǧǧ]/g, 'j')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    locationId = locationId.replace(/ /g, '_')
        .replace(/'/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-')
        .replace(/central/g, 'centre')
        .replace(/(north|west|south|east)ern/g, '$1')
        .replace(/borealis/g, 'north')
        .replace(/occidentalis/g, 'west')
        .replace(/australis/g, 'south')
        .replace(/orientalis/g, 'east');

    for (let i = 1; i <= 2; i++) {
        locationId = locationId.replace(/^(north|west|south|east)_(.*)$/, '$2_$1')
            .replace(/^(lower|upper|inferior|superior)_(.*)$/, '$2_$1')
            .replace(/^(minor|maior|lesser|greater)_(.*)$/, '$2_$1')
            .replace(/^(centre)_(.*)$/, '$2_$1');
    }

    return locationId;
}

function getName(exonymsApiResponse, languageCode) {
    if (exonymsApiResponse.names.hasOwnProperty(languageCode)) {
        return exonymsApiResponse.names[languageCode].value;
    }

    return null;
}

function getNameLine(exonymsApiResponse, languageMcnId, languageCode) {
    var name = getName(exonymsApiResponse, languageCode);

    if (name === null) {
        return null;
    }

    return "      <Name language=\"" + languageMcnId + "\" value=\"" + name + "\" />"
}

function getNameLine2variants(exonymsApiResponse, languageMcnId1, languageCode1, languageMcnId2, languageCode2) {
    let name1 = getName(exonymsApiResponse, languageCode1);
    let name2 = getName(exonymsApiResponse, languageCode2);

    let nameLines = "";

    if (name1 !== null && name1 !== name2) {
        nameLines += getNameLine(exonymsApiResponse, languageMcnId1, languageCode1);
    }

    if (name2 !== null) {
        if (nameLines.length > 0) {
            nameLines += "\n";
        }

        nameLines += getNameLine(exonymsApiResponse, languageMcnId2, languageCode2);
    }

    return nameLines;
}

function getNameLines(exonymsApiResponse) {
    let nameLinesArray = [];
    let nameLines = "";

    for (var languageCode in languages) {
        nameLinesArray.push(getNameLine(exonymsApiResponse, languages[languageCode], languageCode));
    }

    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Belarussian_Before1933", "be-tarask", "Belarussian", "be"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Bosnian", "bs", "SerboCroatian", "sh"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Chinese", "zh-hans", "Chinese", "zh"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Croatian", "hr", "SerboCroatian", "sh"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Kurdish", "ku", "Kurdish", "ckd"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Norwegian_Nynorsk", "nn", "Norwegian", "nb"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Portuguese_Brazilian", "pt-br", "Portuguese", "pt"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Serbian", "sr-el", "SerboCroatian", "sh"));
    nameLinesArray.push(getNameLine2variants(exonymsApiResponse, "Serbian", "sr", "SerboCroatian", "sh"));

    nameLinesArray.sort();

    for (let i = 0; i < nameLinesArray.length; i++) {
        let nameLine = nameLinesArray[i];
        if (nameLine !== null && typeof nameLine !== 'undefined' && !/^\s*$/.test(nameLine) && nameLine.length > 3) {
            nameLines += nameLine + "\n";
        }
    }

    return nameLines;
}

function retrieveExonyms() {
    let wikiDataId = $("#wikiDataId").val();
    let exonymsApiEndpoint = exonymsApiBaseUrl + "/Exonyms?wikiDataId=" + $("#wikiDataId").val();

    let geoNamesId = getGeoNamesId(wikiDataId);

    if (geoNamesId !== null) {
        exonymsApiEndpoint = exonymsApiEndpoint + '&geoNamesId=' + geoNamesId;
    }

    let exonymsApiResponse = fetchData(exonymsApiEndpoint);
    let mainDefaultName = exonymsApiResponse.defaultName;
    let locationId = transformNameToId(mainDefaultName);

    let location =
        "  <LocationEntity>\n" +
        "    <Id>" + locationId + "</Id>\n";
    if (geoNamesId !== null) {
        location += "    <GeoNamesId>" + geoNamesId + "</GeoNamesId>\n";
    }
    location +=
        "    <WikiDataId>" + wikiDataId + "</WikiDataId>\n" +
        "    <GameIds>\n" +
        "    </GameIds>\n" +
        "    <Names>\n";
    location += getNameLines(exonymsApiResponse);
    location +=
        "    </Names>\n" +
        "  </LocationEntity>"

    $("#location").val(location);
}

function copyLocation() {
    const clipboardContent = '\n' + $('#location').val();

    const tempTextarea = $('<textarea>');
    tempTextarea.val(clipboardContent);

    $('body').append(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');

    tempTextarea.remove();
}
