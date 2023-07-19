# FuelPrices

## Projekt Ziele
<ul>
  <li>Einarbeit in Leaflet (https://leafletjs.com/)</li>
  <li>Einarbeit in swagger api (https://api.e-control.at/sprit/1.0/doc/index.html?url=https://api.e-control.at/sprit/1.0/api-docs%3Fgroup%3Dpublic-api#/i) </li>
  <li>Anzeigen der Spritpreise von Tankstellen in der Nähe einer einzugebenden Adresse </li>
</ul>

## UI
<ul>
  <li>Aufrufen der Programme aus dem Menü</br>Durch Klick außerhalb des Menüs wird Menü wieder geschlossen.</li>
  <li>TODO-Liste</li>
  <li>Hilfe & Erklärungen</li>
</ul>

## Funktionen
<ul>
  <li>Geocoding Beispiele</li>
  <li>Orte auf Karte markieren</li>
  <li>e-control API Beispiel</li>
  <li>Tankstellenpreise in Map</li>
</ul>

### Geocoding Beispiele
Nach Eingabe einer Adresse wird der gefundene Ort und sein Breiten- und Längengrad angezeigt.

### Orte auf Karte markieren
<p>Adresse als Startadresse setzen, Adresse erfassen und Marker setzen klicken. Es wird dann diese Startadresse in der Map gekennzeichnet.</p>
<p>Es können beliebig viele weitere Adressen hinzugefügt werden, wobei der Marker der weiteren Adressen kleiner dargestellt wird als jener der Startadresse.</p>

### e-control API Beispiel
<p>Adresse erfassen zu denen die Tankstellenpreise gesucht werden sollen.
Es muss die Treibstoffart ausgewählt werden, optional können auch geschlossene Tankstellen angezeigt werden. Danach Suchen Button klicken.</p>
<p>Es werden die Tankstellen mit den Spritpreisen in einer Tabelle angezeigt. Die Tabelle kann sortiert und gefiltert werden.</p>
<p>Wird eine Tabellenzeile markiert, werden alle Detaildaten im JSON Format unterhalb der Tabelle angezeigt.</p>

### Tankstellenpreise in Map
<p>Datenerfassung wie bei vorigem e-control API Beispiel,</p>
<p>Der Suchort und die gefundenen Tankstellen werden in der Map als Marker gesetzt.</p>
<p>Der Suchort ist um 50% größer als die Marker für Tankstellen ohne Preise und die Tankstellen mit Preis werden in der Map als Kreis-Marker gesetzt, wobei der Kreis umso größer ist je kleiner der Spritpreis ist.</p>
<p>Mittels Mouse over und Klick auf Marker werden Informationen angezeigt.</p>

