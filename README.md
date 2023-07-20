# FuelPrices

## Projekt Ziele
<ul>
  <li>Einarbeit in Leaflet (https://leafletjs.com/)</li>
  <li>Einarbeit in swagger api (https://api.e-control.at/sprit/1.0/doc/index.html?url=https://api.e-control.at/sprit/1.0/api-docs%3Fgroup%3Dpublic-api#/i) </li>
  <li>Anzeigen der Spritpreise von Tankstellen in der Nähe einer einzugebenden Adresse </li>
</ul>

## Funktionen
### Geocoding Beispiele
Nach Eingabe einer Adresse wird der gefundene Ort und sein Breiten- und Längengrad angezeigt.

### Orte auf Karte markieren
<p>Adresse als Startadresse setzen, Adresse erfassen und Marker setzen klicken. Es wird dann diese Startadresse in der Map gekennzeichnet.</p>
<p>Es können beliebig viele weitere Adressen hinzugefügt werden, wobei der Marker der weiteren Adressen kleiner dargestellt wird als jener der Startadresse.</p>

### Sprit Preise in Tabelle anzeigen
<p>Adresse erfassen und Treibstoffart auswählen zu denen die Tankstellenpreise gesucht werden sollen.
<p>Es werden dann die Tankstellen in der Nähe des Suchortes mittels e-control api ermittelt, wobei Preise von e-control nur in den ersten 5 Tankstellen bereitgestellt werden, damit Tankstellen keine Preisermittlungen durchführen können!</p>
<p>Es werden die Tankstellen mit den Spritpreisen in einer Tabelle angezeigt. Die Tabelle kann sortiert und gefiltert werden.</p>
<p>Wird eine Tabellenzeile markiert, werden alle Detaildaten im JSON Format unterhalb der Tabelle angezeigt.</p>

### Sprit Preise in Map anzeigen
<p>Adresse erfassen zu denen die Tankstellenpreise gesucht werden sollen.</br>
Es muss die Treibstoffart ausgewählt werden, optional können auch geschlossene Tankstellen angezeigt werden. Danach Suchen Button klicken.</p>
<p>Es werden dann die Tankstellen in der Nähe des Suchortes mittels e-control api ermittelt, wobei Preise von e-control nur in den ersten 5 Tankstellen bereitgestellt werden, damit Tankstellen keine Preisermittlungen durchführen können!</p>
<p>Es werden folgende Marker gesetzt:</p>
<ul>
  <li>Normaler Marker für Suchadresse. </br>Marker ist um 50% größer als jene für Tankstellen ohne Preise</li>
  <li>Normale Marker für Tankstellen ohne Preise</li>
  <li>Kreis-Marker für Tankstellen mit Preise, wobei der Kreis umso größer ist je kleiner der Spritpreis ist.</li>
</ul>
<p>Mittels Mouse over und Klick auf Marker werden Tankstellen-Informationen aus dem e-control api angezeigt.</p>

