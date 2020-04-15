# ROBOCHRIS

## What

[Robochris](https://twitter.com/yukinebotine) is a twitter bot, it will post a random screenshot from the animated series [Senki Zesshou Symphogear](https://www.symphogear.com/) at set intervals.

## How
1. Randomly fetches an image from the database (mLab)
2. Writes it in the file system
3. Encodes the file in base64 and posts it on twitter

I did include `encode.js`, which I only ran once locally, in order to store the files to mLab beforehand.

## Why
It's mostly a learning experience, as well something I wanted that didn't exist yet (to my knowledge).
