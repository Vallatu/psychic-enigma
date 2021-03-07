// ==UserScript==
// @name         Laoseisu muutus tabelisse
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       Jürgen
// @match        https://*/wp-admin/post.php?post=*&action=edit
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var list = document.getElementsByClassName('note_content');
    var table = document.getElementById('order_line_items');
    var rows = table.rows;
    var keyword = "Laojääki vähendati: ";
    var content;

    for (var a = 0; a < (list.length); a++) // leiab kommentaaridest laoseisude muutuse teksti
    {
        content = list[a].getElementsByTagName('p')[0].innerText;
        if (content.includes(keyword)) {
            break;
        }
    }

    var changes = GetChanges(content, keyword, rows.length);
    console.log(changes);

    var skus = new Array();
    var nums = new Array();
    for (var i = 0; i < changes.length; i++)
    {
        skus.push(changes[i].slice(changes[i].indexOf('(') + 1, changes[i].indexOf(')')));
        nums.push(changes[i].slice(changes[i].indexOf(')') + 2, changes[i].length));

    }
    console.log(skus);
    console.log(nums);

    // at this point on kaks arrayd: ühes SKU'd, teises laoseisu muutused

    
    for (var b = 0; b < rows.length; b++)
    {
        var sku = rows[b].cells[1].getElementsByClassName('wc-order-item-sku')[0].innerText;
        sku = sku.slice(11, sku.length); // vaja muuta vastavalt keelele

        var index = skus.indexOf(sku);
        var num = nums[index];

        var cell = rows[b].cells[3];
        var div = document.createElement("DIV");
        div.setAttribute("class", "stockchange");
        div.setAttribute("style", "color: lightgrey;");
        var txt = document.createTextNode(num);
        div.appendChild(txt);

        cell.appendChild(div);
    }




})();


function GetChanges(content, keyword, rowsLength)
{
    var changes = new Array();
    while (content.indexOf("→") != -1)// looping kuniks content väärtuselt on kõik nooled eemaldatud
    {
        var commaIndex;
        var arrowIndex = content.indexOf("→");

        if (content.charAt(arrowIndex + 3) == ',') { // kui on kahekohaline number peale noolt
            commaIndex = arrowIndex + 3;
        } else if (content.charAt(arrowIndex + 2) == ',') { // kui on ühekohaline number peale noolt
            commaIndex = arrowIndex + 2;
        }
        var change = content.slice(0, commaIndex);

        if (change.includes(keyword)) { // kui on esimene nimekirjas
            change = change.slice(keyword.length, change.length);
        } else if (content.charAt(commaIndex) != ',') { // kui on viimane nimekirjas
            change = content.slice(0, content.length);
        }

        changes.push(change); // lisa muudatus muudatuste nimekirja

        if (rowsLength == 1) { // kui ainult üks rida tabelis, tühjenda "content" sisu
            content = "";
        } else {
            content = content.slice(commaIndex + 2, content.length); // lõika lisatud muudatust contentist välja
        }
    }
    return changes;
}
