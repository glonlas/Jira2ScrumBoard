# Jira2ScrumBoard
[![Build Status](https://travis-ci.org/glonlas/Jira2ScrumBoard.svg?branch=master)](https://travis-ci.org/glonlas/Jira2ScrumBoard) [![Latest Stable Version](https://poser.pugx.org/symfony/symfony/v/stable)](https://packagist.org/packages/symfony/symfony)

We think visual management is essential for your daily meetings. 
This is why we have build a free tool to print Jira Stories 
onto beautiful Story cards.

AgileStoryPrint supports Excel and XML Jira's exports.

Demo on: [www.jira2scrumboard.com](http://www.jira2scrumboard.com/)

## Minimum Requirements
The project is based on Symfony 3.2. To run this project you will need:
* Apache or Nginx
* PHP ≥ 5.6 or PHP ≥7
* PHP extension php_zip enabled
* PHP extension php_xml enabled
* PHP extension php_gd2 enabled (if not compiled in)
* [Composer](https://getcomposer.org/)
* [WKHTMLToPDF](http://wkhtmltopdf.org/downloads.html)
* Chinese font installed

## How to install the project
1. Create your parameters.yml  
`cp app/config/parameters.yml.dist app/config/parameters.yml`  
`vi app/config/parameters.yml`

2. Install the packages  
`php composer.phar install`


## Troubleshoot

### How to install Chinese fonts on Ubuntu 14.04?
`apt-get install fonts-wqy-zenhei`

### Which Excel fields are mandatory?
The name of each columns in your Excel file is important. Jira2ScrumBoard requires at least
the following column names:

Mandatory fields:
* Story ID = "Key"
* Issue Type = "Issue Type"
* Story Summary = "Summary"

Optional fields:
* Story Effort = "Points"
* Project name = "Project"
* Version name = "Version" or "Fix Version/s"
* Epic name = "Epic Link"

The order doesn't matter.

**Example:**

| Key | Issue Type | Summary | Points | Project | Version | Epic Link |
| --- | --- | --- | --- | --- | --- | --- |
| ID-3604 | Story | Add a contact form | 5 | A great project | Proof of concept | ID-3600 |
| ID-3605 | Story | Unsubscribe from the mailing list | 8 | A great project | Proof of concept | ID-3600 |

**File sample:** [XLSX file with 2 stories](https://github.com/glonlas/Jira2ScrumBoard/blob/master/tests/AgileStoryPrint/JiraBundle/Resources/Fixtures/xls-html/excel-all-fields.xlsx)

### What XML structure should be used for your file?

At least the following structure.
```XML
<rss version="0.92">
<channel>
    <item>
            <title>[ID-3604] Add a contact form</title>
            <link>https://jira.yourdomain.tld/browse/ID-3604</link>
            <project key="ID">A great project</project>
            <key>ID-3604</key>
            <fixVersion>Proof of concept</fixVersion>
            <summary>Add a contact form</summary>
            <type>Story</type>
            <customfields>
                <customfield>
                    <customfieldname>Epic Link</customfieldname>
                    <customfieldvalues>
                        <customfieldvalue>ID-3603</customfieldvalue>
                    </customfieldvalues>
                </customfield>
                <customfield>
                    <customfieldname>Story Points</customfieldname>
                    <customfieldvalues>
                        <customfieldvalue>5</customfieldvalue>
                    </customfieldvalues>
                </customfield>
            </customfields>
    </item>
</channel>
</rss>
```

**File sample:** [XML file with 2 stories](https://github.com/glonlas/Jira2ScrumBoard/blob/master/tests/AgileStoryPrint/JiraBundle/Resources/Fixtures/xml/fixture-success-2-stories.xml)

## Contribution
Feel free to contribute to this project and submit your pull-requests.  
New translations are welcomed. Join us on our 
[Transifex page](https://www.transifex.com/projects/p/agilestoryprint/)


### Greetings
Many Thanks to our contributors:
#### Translations
* [Selynchen](https://www.transifex.com/user/profile/Selynchen/) for 
the [Mandarin Chinese](http://www.jira2scrumboard.com/zh/) translation.
* [Vistaus](https://www.transifex.com/accounts/profile/Vistaus/) for 
the [Dutch](http://www.jira2scrumboard.com/nl/) translation.

## Blog posts
### French
* March 2015: [Jira2ScrumBoard l'outil pour imprimer vos Stories Scrum](http://blog.dreaminvasion.com/2015/03/jira2scrumboard-l-outil-pour-imprimer-vos-stories-scrum.html)

