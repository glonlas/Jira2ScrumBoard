Jira2ScrumBoard
===============
[![Build Status](https://travis-ci.org/glonlas/Jira2ScrumBoard.svg?branch=master)](https://travis-ci.org/glonlas/Jira2ScrumBoard) [![Latest Stable Version](https://poser.pugx.org/symfony/symfony/v/stable)](https://packagist.org/packages/symfony/symfony)

We think visual management is essential for your daily meetings. 
This is why we have build a free tool to print Jira Stories 
onto beautiful Story cards.

AgileStoryPrint supports Excel and XML Jira's exports.

Demo on: [www.jira2scrumboard.com](http://www.jira2scrumboard.com/)

Minimum Requirements
===============
To run this project you will need:
* PHP ≥ 5.6
* PHP extension php_zip enabled
* PHP extension php_xml enabled
* PHP extension php_gd2 enabled (if not compiled in)
* [Composer](https://getcomposer.org/)
* [WKHTMLToPDF](http://wkhtmltopdf.org/downloads.html)

The project is based on Symfony 3.2

How to install
===============
1. Create your parameters.yml  
`cp app/config/parameters.yml.dist app/config/parameters.yml`  
`vi app/config/parameters.yml`

2. Install the packages  
`php composer.phar install`

Print Stories from an Excel file
===============
If you are using an Excel file, please be wary to have well-named columns.  
The name of each columns is important, Jira2ScrumBoard requires at least
the following column names:

* Story ID = "Key"
* Issue Type = "Issue Type"
* Story Summary = "Summary"
* Story Effort = "Points"
* Project name = "Project"

Contribution
===============
Feel free to contribute to this project.  
New translations are welcomed. Join us on our 
[Transifex page](https://www.transifex.com/projects/p/agilestoryprint/)


Greetings
===============
Thanks to [Vistaus](https://www.transifex.com/accounts/profile/Vistaus/) for 
the Dutch translation.


Blog posts
===============
### French
* March 2015: [Jira2ScrumBoard l'outil pour imprimer vos Stories Scrum](http://blog.dreaminvasion.com/2015/03/jira2scrumboard-l-outil-pour-imprimer-vos-stories-scrum.html)

