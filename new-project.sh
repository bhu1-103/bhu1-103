#!/usr/bin/zsh

cp ./projects.html projects.html.bak

echo -n "Enter Project Name: "
read ProjectName
ProjectNameUS=${ProjectName// /_}

echo -n "Enter Project Summary: "
read ProjectSummary

if [[ -e "projects/$ProjectNameUS" ]]; then
  echo -e "Project already exists\nExiting"
  exit 1
else
  mkdir "projects/$ProjectNameUS"
  cp ./.templates/project-index.html projects/$ProjectNameUS/index.html
  echo "Created Project Files"
fi

i=$(find "projects/$ProjectNameUS" -maxdepth 1 -type f -regex '.*/[0-9]+\..*' | wc -l)

read "a?Add images? (y/n): "
while [[ $a == [yY] ]]; do
  ranger --choosefile=/tmp/ranger ~/Pictures/screenshots
  img_file=$(cat /tmp/ranger 2>/dev/null)
  [[ -z "$img_file" ]] && continue

  ext="${img_file##*.}"
  ((i++))
  new_name="$i.$ext"

  cp "$img_file" "projects/$ProjectNameUS/$new_name"
  echo "Added image $img_file to $ProjectName"
  read "a?Add more images? (y/n): "
done

last_project=$(grep -n project-header projects.html | tail -n 1 | awk -F ":" '{print $1}')
current_project=$(( last_project + 8 ))

add2main=$(cat ./.templates/project-add2main.html)

awk -v line="$current_project" -v content="$add2main" '
NR == line { print; print content; next }
1
' projects.html > tmp && mv tmp projects.html

echo "Referenced project to projects.html"

sed -i "s|--PROJECTNAMEHERE--|$ProjectNameUS|g" ./projects.html
sed -i "s|--PROJECTNAMEHERESPACES--|$ProjectName|g" ./projects.html
sed -i "s|--PROJECTQUICKSUMMARYHERE--|$ProjectSummary|g" ./projects.html
sed -i "s|--PROJECTNAMEHERE--|$ProjectNameUS|g" ./projects/$ProjectNameUS/index.html
sed -i "s|--PROJECTNAMEHERESPACES--|$ProjectName|g" ./projects/$ProjectNameUS/index.html
sed -i "s|--PROJECTQUICKSUMMARYHERE--|$ProjectSummary|g" ./projects/$ProjectNameUS/index.html
