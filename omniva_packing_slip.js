// ==UserScript==
// @name         Tellimuse ridade sroteerimine
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       Jürgen
// @match        https://*/wp-admin/post.php?post=*&action=edit
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById('order_line_items');
    var patt = /\d{4}/;
    switching = true;
    /* Make a loop that will continue until no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the first, which contains table headers): */
        for (i = 0; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare, one from current row and one from the next: */
            x = patt.exec(rows[i].cells[1].getElementsByClassName('wc-order-item-sku')[0].innerText)[0];
            y = patt.exec(rows[i + 1].cells[1].getElementsByClassName('wc-order-item-sku')[0].innerText)[0];
            // Check if the two rows should switch place:
            if (x > y) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }

    for (var j = 0, row; row = table.rows[j]; j++) {

        if (row.cells[3].childNodes[1].innerText != "× 1")
        {
            row.classList.add("more_than_one");
        }
}
})();
