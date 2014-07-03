UPDATE articles_articlepluginmodel
SET raw = replace (raw,'class="prettyprint"', 'class="prettyprint linenums"' )
WHERE raw like '%class="prettyprint"%'