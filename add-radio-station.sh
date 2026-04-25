#!/usr/bin/zsh

set -e

PLAYLIST="./projects/web_radio_library/playlist.m3u"
HTML_FILE="./projects/web_radio_library/index.html"

trap 'echo "\nError Occured. Restoring backups..."; mv "${PLAYLIST}.bak" "$PLAYLIST" 2>/dev/null; mv "${HTML_FILE}.bak" "$HTML_FILE" 2>/dev/null' ERR

cp "$PLAYLIST" "${PLAYLIST}.bak"
cp "$HTML_FILE" "${HTML_FILE}.bak"

while true; do
  echo -n "\nEnter Station Name: "
  read StationName
  
  if [[ -z "$StationName" ]]; then
    echo "Station name cannot be empty. Try again."
    continue
  fi

  echo -n "Enter Group Title/Genre (Optional): "
  read GroupTitle

  echo -n "Enter Stream URL: "
  read StreamUrl
  
  if [[ -z "$StreamUrl" ]]; then
    echo "Stream URL cannot be empty. Try again."
    continue
  fi

  echo "" >> "$PLAYLIST"
  if [[ -n "$GroupTitle" ]]; then
    echo "#EXTINF:-1 group-title=\"$GroupTitle\", $StationName" >> "$PLAYLIST"
  else
    echo "#EXTINF:-1, $StationName" >> "$PLAYLIST"
  fi
  echo "$StreamUrl" >> "$PLAYLIST"

  awk -v name="$StationName" -v url="$StreamUrl" '/<\/ol>/ { print "<li><mark>" name "</mark><br><code>" url "</code></li>" } 1' "$HTML_FILE" > tmp_html && mv tmp_html "$HTML_FILE"
  
  echo "Added '$StationName' to repository!!"

  read "a?Add another radio station? (y/n): "
  if [[ -z "$a" || $a != [yY] ]]; then
    break
  fi
done

echo "またあした"
