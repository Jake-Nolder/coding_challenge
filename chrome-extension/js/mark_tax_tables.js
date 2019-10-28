if($ === undefined) {
    let $ = jQuery;
}

let button = $('<div />', {
    "class": "myob-button",
    "html": $('<a />', {
        "href": "#",
        "html": $('<span />', {
            "text": "Download"
        })
    })
})//.on("click", download);

$(document).ready(() => {
    $('table').prepend(button);

    $(document).find(".myob-button").each((index, dom) => {
        let filename = $(dom).parents("table").find("caption").text().replace(/[^0-9\–\-]+/g, '');
        $(dom).children("a").attr({
            "download": filename + ".json",
            "href": download($(dom))
        });
    });
});

function download(e) {
    let table = e.parents("table");

    let income_thresholds = [];

    $.each(table.find('tr'), (index, row) => {
        let rules = $(row).children('td:nth-child(2)').text();
        let rule_stops = ["Nil", "plus", "for each", "over", "\n"]; // In order they will appear in

        let string_remains = rules;
        mapped_rules = rule_stops.map((stop) => {
            let rule = string_remains;

            if(rule.indexOf(stop) == -1 || stop == "Nil") {
                return 0;
            }

            let return_string = rule.substring(0, rule.indexOf(stop));
            if(return_string.indexOf("cents") > -1 || return_string.indexOf("cent") > -1 || return_string.indexOf("c") > -1) {
                return_string = convertToCents(return_string);
            } else {
                return_string = parseFloat( return_string.replace(/[^0-9]+/g, '') );
            }

            string_remains = rule.substring(rule.indexOf(stop)+(stop.length)+1, rule.length);

            if(typeof return_string !== "number") {
                return 0;
            }

            return return_string;
        });

        let mapped_thresholds = $(row).children('td:nth-child(1)').text().replace(/[^0-9\–]+/g, '').split("–")
            .map((item) => {
                if(typeof parseFloat(item) !== "number") {
                    return 0;
                } else {
                    return parseFloat(item);
                }
            });

        income_thresholds.push({
            "threshold": mapped_thresholds,
            "rules": mapped_rules
        });
    });

    let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(income_thresholds, null, 4));

    return data
}

function convertToCents(value) {
    let cents = "0." + value.replace(/[^0-9]+/g, '').padStart(2, '0');
    return parseFloat(cents);
}