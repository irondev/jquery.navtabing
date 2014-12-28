navtabing
==========

jQuery pluging to manage navigation with tabs.

## Basics

```
<div class="js-tabs">
    <ul>
        <li class="js-tabs-item"><a href="#">item 1</a></li>
        <li class="js-tabs-item"><a href="#">item 2</a></li>
    </ul>
    <div class="js-tabs-content">
        content 1
    </div>
    <div class="js-tabs-content">
        content 2
    </div>
</div>

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script>
$(function() {
    $(".js-tabs").navtabing();
});
</script>
```
Demo : https://rawgit.com/rdardeau/navtabbing/master/demos/simple-tabs.html

When a tab is actived, the item has the class ```is-active``` by default. You can custom this class name :
```
$(".js-tabs").navtabing({
  tabClass: "selected",
});
```

You can custom the order of your contents with the ```data-tabs-eq``` attribute :
```
<div class="js-tabs">
    <ul>
        <li class="js-tabs-item"><a href="#">item 1</a></li>
        <li class="js-tabs-item"><a href="#">item 2</a></li>
    </ul>
    <div class="js-tabs-content" data-tabs-eq="1">
        content 2
    </div>
    <div class="js-tabs-content" data-tabs-eq="0">
        content 1
    </div>
</div>
```

You can custom the class names of the ```js-*``` markers :
```
$(".onglets").navtabing({
  tabElements: ".onglet", // default js-tabs-item
  tabContentElements: ".contenu-onglet" // default js-tabs-content
});
```

## URL History

You can give a specific URL to each tabs without reload the page :
```
<li class="js-tabs-item"><a href="/item-1/">item 1</a></li>
<li class="js-tabs-item"><a href="/item-2/">item 2</a></li>
```
Demo : https://rawgit.com/rdardeau/navtabbing/master/demos/push-tabs.html

You can also use hash : https://rawgit.com/rdardeau/navtabbing/master/demos/hash-tabs.html

### Ajax Loading

You can load a tab content only if needed with Ajax using the ```data-tabs-load``` attribute and specifying a container (```js-tabs-container``` by default) :
```
<div class="js-tabs">
    <ul>
        <li class="js-tabs-item" data-tabs-load="content-1.html"><a href="#">item 1</a></li>
        <li class="js-tabs-item" data-tabs-load="content-2.html"><a href="#">item 2</a></li>
    </ul>
    <div class="js-tabs-container"></div>
</div>
```
Demo : https://rawgit.com/rdardeau/navtabbing/master/demos/ajax-tabs.html

You can custom the class names of the container :
```
$(".js-tabs").navtabing({
  tabContentBloc: ".conteneur", // default js-tabs-container
});
```

You can add a live reload on a specific tab to refresh it each x seconds, using the ```data-tabs-refresh``` attribute :
```
<li class="js-tabs-item" data-tabs-load="content-2.html" data-tabs-refresh="10"><a href="#">item 2</a></li>
```

You can add a condition for the live reload, using the ```data-tabs-refresh-condition``` attribute :
```
<li class="js-tabs-item" data-tabs-load="content-2.html" data-tabs-refresh="10" data-tabs-refresh-condition=".js-isLive"><a href="#">item 2</a></li>
```
