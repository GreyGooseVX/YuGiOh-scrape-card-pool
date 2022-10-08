# YuGiOh-scrape-card-db

full card db as of 22.08.2022, scraped from yugipedia.com

https://docs.google.com/spreadsheets/d/15f8dqC8letuw0fDdkL6oBOla0tfTf9nceS8LGPZqXU8/edit#gid=271022656

to use a custom card pool or play with an old banned list, check out my other repo:
[YuGiOh-historic-and-custom-formats](https://github.com/WhiteG00se/YuGiOh-historic-and-custom-formats)

In case you need a more updated card db, here's how I created the one in this repo.
The process is not fully automated, because the data from yugipedia is not consistent and therefor some manual work is required:

install Node.js and npm
clone this repository
delete all the files in the folder 'output' for better readability
install [RBQL](https://rbql.org/) - [I use the VS Code Version](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv) 

'npm install puppeteer'
'node .\main.js'

this will take about 60-120 minutes to run

open 'list0.csv' in RBQL and run the following query:
SELECT * JOIN list1.csv ON a.title == b.title
save the result as output/joinedTables/list0+1.csv

open 'list0+1.csv' in RBQL and run the following query:
SELECT * JOIN ../bannedLists/list2.csv ON a.title == b.title
save the result as output/joinedTables/list0+1+2.csv

delete 'Anotherverse Dragon' from cards.csv (because some card data is missing on the yugipedia.com)
delete 'The Seal of Orichalcos' from cards.csv (there are 2, delete the one with password='none')
change 'Morphing Jar 2' to 'Morphing Jar #2' in list0+1+2.csv (because the title is different than in cards.csv)

open 'cards.csv' in RBQL and run the following query:
SELECT * LEFT JOIN joinedTables/list0+1+2.csv ON a.title == b.title
save the result as output/joinedTables/cards+list0+1+2.csv

open 'cards+list0+1+2.csv' in RBQL and run the following query:
SELECT * LEFT JOIN ../../errataMapping.csv ON a.password == b.password
save the result as output/joinedTables/cards+list0+1+2+errata.csv

search the latest .csv for cards without passwords, following query will help with that:
SELECT * WHERE isNaN(a.password)==true
SELECT * ORDER BY a.password DESC
ignore the illegal cards and manually edit the passwords for playable cards with the passwords in projectIgnis
here is a list of cards I manually edited: legalCardsWithoutPassword.csv
save the result as output/joinedTables/manuallyEdited.csv

open 'manuallyEdited.csv' in RBQL and run the following query:
SELECT * EXCEPT a27, a55, a91, a97, a99 WHERE isNaN(a.password)==false ORDER BY a.title
save the result as output/joinedTables/almostFinal.csv

'node .\finalizeDB\finalizeDB.js'

Google Sheets:
Format 'Plain Text' for all columns
Data -> Split text to columns -> Split by: |
