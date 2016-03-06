# ccms-best-agenda

## Description
Create and manage the agenda pages for the ccms-best.nl site.

## Architecture
This application has 3 components:
* Editor – to add new meetings and edit existing ones. Under construction.
* Viewer – to show the agenda.
* Data – file with all the data of the meetings

## Installation
### Data
1. Download *Data/ccms-agenda.json*.
2. Change the data for the future meetings.
3. Validate JSON file. For example with [http://www.icosaedro.it/phplint/phplint-on-line2.html]
4. Place file on server for public and members site.

### Viewer
1. Download *agenda_en.php*, *agenda_nl.php* and *ledenagenda_nl.php*.
2. Change path in line 18: *$PATHDATAFILE = 'path/to/agenda.json';* for all three files.
3. Place file on server, between (HTML) web pages.
4. Change the properties of the file, so it can be run by the PHP interpreter.
..* PHP version > 5.3

### Editor
Under construction.

## Agenda Data
All the data for the meetings are stored in a JSON file.
The structure of this file is described in the *Documents/Agenda-Data-Format-Design* file.
