<?php

namespace Tests\AgileStoryPrint\JiraBundle\Mailer;

use AgileStoryPrint\JiraBundle\Mailer\Email;

/**
 * Unit test for the application utils.
 *
 * See http://symfony.com/doc/current/book/testing.html#unit-tests
 *
 * Execute the application tests using this command (requires PHPUnit to be installed):
 *
 *     $ phpunit tests/AgileStoryPrint/JiraBundle/Mailer/EmailTest.php
 */
class EmailTest extends \PHPUnit_Framework_TestCase
{
    public function testSender()
    {
        $fixture = 'you@domain.com';

        $email = new Email();
        $email->setSender($fixture);
        $result = $email->getSender();

        $this->assertEquals($fixture, $result);
    }

    public function testRecipient()
    {
        $fixture = 'you@domain.com';

        $email = new Email();
        $email->setRecipient($fixture);
        $result = $email->getRecipient();

        $this->assertEquals($fixture, $result);
    }

    public function testReplyTo()
    {
        $fixture = 'you@domain.com';

        $email = new Email();
        $email->setReplyTo($fixture);
        $result = $email->getReplyTo();

        $this->assertEquals($fixture, $result);
    }

    public function testSubject()
    {
        $fixture = 'Email subject';

        $email = new Email();
        $email->setSubject($fixture);
        $result = $email->getSubject();

        $this->assertEquals($fixture, $result);
    }

    public function testTemplate()
    {
        $fixture = 'AgileStoryPrintJiraBundle:Emails:contact.html.twig';

        $email = new Email();
        $email->setTemplate($fixture);
        $result = $email->getTemplate();

        $this->assertEquals($fixture, $result);
    }

    public function testLocale()
    {
        $fixture = 'fr';

        $email = new Email();

        // Test the default locale code
        $result = $email->getLocale();

        $this->assertEquals('en', $result);

        // Test another locale code
        $email->setLocale($fixture);
        $result = $email->getLocale();

        $this->assertEquals($fixture, $result);
    }

    public function testParams()
    {
        $fixture =  array(
            'name'      => 'John Doe',
            'email'     => 'john@doe.com',
            'phone'     => '+1 234 456-7890',
            'message'   => 'Hello World!',
            'ip'        => '127.0.0.1'
        );

        $email = new Email();
        $email->setParams($fixture);
        $result = $email->getParams();

        $this->assertEquals($fixture, $result);
    }
}
