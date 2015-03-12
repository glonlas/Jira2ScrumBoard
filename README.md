AgileStoryPrint
===============
Because we think visual management is essential in you daily team management, 
we develop a tool to allow you printing Jira Story to beautiful formated Story
cards.

Demo on: [www.jira2scrumboard.com](http://www.jira2scrumboard.com/)

Minimum Requirements
===============
To run this project you need:
* PHP 5.6
* PHP extension php_zip enabled
* PHP extension php_xml enabled
* PHP extension php_gd2 enabled (if not compiled in)
* [Composer](https://getcomposer.org/)
* [WKHTMLToPDF](http://wkhtmltopdf.org/downloads.html)


The project is based on Symfony 2.6

Convert Stories with Excel files
===============
If you convert Stories from an Excel becareful to have column well named.  
This app will look for the following column inside your Excel file, to determinate
in which fields your data are.

* Story ID = "Key"
* Issuer Type = "Issue Type"
* Story Summary = "Summary"
* Story Effort = "Points"
* Project name = "Project"

Contribution
===============
Feel free to contribute to this project and improve it.  
Any new translation is welcomed.
