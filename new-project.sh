#!/usr/bin/zsh

echo -n "Enter Project Name: "
read ProjectName
count=$(ls -la projects | grep $ProjectName | wc -l)
if (( count != 0 )); then
  echo -e "Project already exists\nExitting"
  exit
else
  mkdir "projects/$ProjectName"
  cp templates/project-index.html projects/$ProjectName/index.html
  echo "Created Project Files"
fi

read "a?Add images? (y/n): "
while [[ $a == [yY] ]]; do
  ranger --choosefile=/tmp/ranger ~/Pictures/screenshots
  img_file=$(cat /tmp/ranger 2>/dev/null)
  [[ -z "$img_file" ]] && continue
  cp "$img_file projects/$ProjectName"
  echo "Added image $img_file to $ProjectName"

  read "a?Add more images? (y/n): "
done

last_project=$(grep -n project-header projects.html | tail -n 1 | awk -F ":" '{print $1}')
current_project=$(( $last_project + 11 ))

add2main=$(cat ./templates/project-add2main.html)

sed -i '${current_project}a\\$(add2main)' projects.html
