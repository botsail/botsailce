$(function () {
    //load JSON file
    $.getJSON('/json', function (data) {
        //build menu
        
        var builddata = function () {
            var source = [];
            var items = [];

            for (i = 0; i < data.length; i++) {
                var item = data[i];

                var label = item["name"];
                var parentid = item["parent_id"];
                var id = item["id"];
                var url = item["url"];
                var css_class = item["css_class"];

                if (items[parentid]) {
                    var item = {
                        parentid: parentid,
                        label: label,
                        url: url,
                        css_class: css_class,
                        item: item
                    };
                    if (!items[parentid].items) {
                        items[parentid].items = [];
                    }
                    items[parentid].items[items[parentid].items.length] = item;
                    items[id] = item;
                } else {
                    items[id] = {
                        parentid: parentid,
                        label: label,
                        url: url,
                        css_class: css_class,
                        item: item
                    };
                    source[id] = items[id];
                }
            }
            return source;
        }

        var buildSubUL = function (parent, items) {
            $.each(items, function () {
                if (this.label) {
                    // var li = $("<li>" + "<a class='fa fa-area-chart' href='" + this.url + "'>" + this.label + "</a></li>");
                    var li = $("<li><a href='" + this.url + "'  class=\"nav-link\"><i class='fa fa-circle-o'></i> " + this.label + "</a></li>");
                    li.appendTo(parent);
                }
            });
        }

        var buildUL = function (parent, items) {
            $.each(items, function () {
                if (this.label) {

                    str = '<li  class="nav-item"> ' +
                        '<a href="' + this.url + '"  class="nav-link"> ' +
                        '   <i class="' + this.css_class + '"></i> <span>' + this.label + '</span>' +
                        '</a>' +
                        '</li>';
                    var li = $(str);

                    if (this.items && this.items.length > 0) {
                        str = '<li class="nav-item has-treeview">' +
                            
							
							
							'<a href="#" class="nav-link">'+
							  '<i class="nav-icon ' + this.css_class + '"></i>'+
							  '<p>' + this.label + 
								'<i class="right fa fa-angle-left"></i>'+
							  '</p>'+
							'</a>'+
			
			
                            '</li>';
                        li = $(str);
                    }

                    li.appendTo(parent);
                    
                    if (this.items && this.items.length > 0) {
                        var ul = $("<ul class='nav nav-treeview'></ul>");
                        ul.appendTo(li);
                        buildSubUL(ul, this.items);
                    }
                }
            });
        }

        var source = builddata();
        var ul = $("#sidebar-menu");
        // ul.appendTo(".sidebar-menu");
        buildUL(ul, source);
        getActiveItem();
    });
});

function getActiveItem(){
    Array.from($(".sidebar-menu").find('a')).forEach(a => {
        if($(a).attr('href') == location.pathname){
            if($(a).parent('li').parent('ul').hasClass('sidebar-menu')){
                $(a).css({
                    'color': "white",
                })
                $(a).parent('li').css({
                    'background-color': '#1E282C',
                    'border-left':'3px solid #3C8DBC'
                })
            }else{
                $(a).css({
                    'color': "white",
                })
                
                $(a).parent('li').parents('ul').css({
                    'display':'block'
                })

                $(a).parent('li').parents('li').css({
                    'background-color': '#1E282C',
                    'border-left':'3px solid #3C8DBC',
                })
                $(a).parent('li').parents('li').children('a').first().css({
                    'color':'white'
                })
            }
        }
    })
}
