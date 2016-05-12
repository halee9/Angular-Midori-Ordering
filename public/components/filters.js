'use strict';

angular.module('hs.filters', ['hs.services'])

.filter('displayModifiers', function() {
    return function(modifiers) {
        if (modifiers) {
            var texts = [];
            for (var i=0; i<modifiers.length; i++) {
                var modifier = modifiers[i];
                if (modifier.type == 'A') {
                    texts.push(modifier.selects[modifier.selected].name);
                }
                else {
                    var selects = modifier.selects;
                    for (var j=0; j<selects.length; j++){
                        if (selects[j].qty > 0) {
                            var qty = (selects[j].qty == 1) ? "" : selects[j].qty + " ";
                            texts.push(qty + selects[j].name);
                        }
                    }
                }
            }
            return texts.join(", ");
        }
    };
})

.filter('showItemDetail', function($sce) {
    return function(item) {
        if (item) {
            var modifiers = item.modifiers;
            var texts = [
                { name: item.name, price: item.basePrice }
            ];
            for (var i=0; i<modifiers.length; i++) {
                var modifier = modifiers[i];
                if (modifier.type == 'A') {
                    texts.push({ name: modifier.selects[modifier.selected].name,
                        price: modifier.selects[modifier.selected].price});
                }
                else {
                    var selects = modifier.selects;
                    for (var j=0; j<selects.length; j++){
                        if (selects[j].qty > 0) {
                            var qtyText = (selects[j].qty == 1) ? "" : " X " + selects[j].qty;
                            texts.push({ name: (selects[j].name + qtyText),
                                price: (selects[j].price * selects[j].qty)});
                        }
                    }
                }
            }
            var html = "<table class='table table-condensed'>";
            for (var i=0; i<texts.length; i++){
                var text = texts[i];
                var indent = (i!=0) ? "style='padding-left:10%'" : "";
                html += "<tr><td class='text-left' " + indent + ">" + text.name + "</td>" +
                "<td class='text-right' style='width: 5em'>" + text.price.toFixed(2) + "</td></tr>";
            }
            html += "</table>"
            return $sce.trustAsHtml(html);
        }
    };
})


.filter('itemsByCategory', function(){
    return function(items, category){
        var filtered = [];
        for (var i=0; i<items.length; i++){
            var categories = items[i].categories;
            for (var j=0; j<categories.length; j++) {
                if (categories[j] == category) {
                    filtered.push(items[i]);
                }
            }
        }
        return filtered;
    }
})

;
