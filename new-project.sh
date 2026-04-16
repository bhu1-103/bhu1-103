#!/usr/bin/zsh

echo -n "Enter Project Name: "
read ProjectName
if [[ lsa projects | $ProjectName | wc -l ]]; then
  echo "Project already exists"
else
  mkdir $ProjectName
  cp templates/project-template.html $ProjectName/index.html
fi

read "a?Add images? (y/n): "
while [[ $a == [yY] ]]; do
  ranger --choosefile=/tmp/ranger ~/Pictures/screenshots
  img_file=$(cat /tmp/ranger)
  echo "copied image $img_file to $ProjectName"

  read "a?Continue? (y/n): "
done

last_project=$(cat projects.html | grep -n project-header | tail -n 1 | awk -F ":" '{print $1}')
current_project=$(( $last_project + 11 ))

sed '"$current_project"a\test' index.html
