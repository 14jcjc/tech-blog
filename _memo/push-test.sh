#!/bin/bash

git remote set-url origin git@github.com-14jcjc:14jcjc/tech-blog.git
git remote -v
git add -A
git commit -m "commit"
git branch -M main
git push -u origin main

git remote set-url origin git@github.com-14jcjc:14jcjc/tech.git
