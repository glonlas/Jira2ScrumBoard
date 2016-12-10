<?php

namespace Tests\AgileStoryPrint\JiraBundle\Entity;

use AgileStoryPrint\JiraBundle\Entity\Story as Story;

/**
 * Unit test for the application utils.
 *
 * See http://symfony.com/doc/current/book/testing.html#unit-tests
 *
 * Execute the application tests using this command (requires PHPUnit to be installed):
 *
 *     $ phpunit tests/AgileStoryPrint/JiraBundle/Entity/StoryTest.php
 */
class StoryTest extends \PHPUnit_Framework_TestCase
{
    public function testKey()
    {
        $fixture = 'str-001';

        $story = new Story();
        $story->setKey($fixture);
        $result = $story->getKey();

        $this->assertEquals($fixture, $result);
    }

    public function testProject()
    {
        $fixture = '<INSERT Name here ie. "étoile">';
        $fixture_html_encoded = htmlentities($fixture);

        $story = new Story();
        $story->setProject($fixture_html_encoded);
        $result = $story->getProject();

        $this->assertEquals($fixture, $result);
    }

    public function testSummary()
    {
        $fixture = '<INSERT Name here ex: "étoile">';
        $fixture_html_encoded = htmlentities($fixture);

        $story = new Story();
        $story->setSummary($fixture_html_encoded);
        $result = $story->getSummary();

        $this->assertEquals($fixture, $result);
    }

    public function testType()
    {
        $fixture = '<Type ex: Epic>';
        $fixture_html_encoded = htmlentities($fixture);

        $story = new Story();
        $story->setType($fixture_html_encoded);
        $result = $story->getType();

        $this->assertEquals($fixture, $result);
    }

    public function testEffort()
    {
        $story = new Story();

        $fixturesTrue = array(
            0   => 0,
            0.0 => 0,
            1.0 => 1,
            8   => 8,
            8.8 => 8
        );

        foreach ($fixturesTrue as $key => $value)
        {
            $story->setEffort($key);

            $this->assertEquals(
                $value,
                $story->getEffort()
            );
        }


        $fixturesFalse = array(
            0   => 1,
            8.8 => 8.8
        );

        foreach ($fixturesFalse as $key => $value)
        {
            $story->setEffort($key);

            $this->assertNotEquals(
                $value,
                $story->getEffort()
            );
        }
    }

    public function testLink()
    {
        $fixture = 'http://abc.def';

        $story = new Story();
        $story->setLink($fixture);
        $result = $story->getLink();

        $this->assertEquals($fixture, $result);
    }

    public function testVersion()
    {
        $fixture = '<Version ex: 1.0.2>';
        $fixture_html_encoded = htmlentities($fixture);

        $story = new Story();
        $story->setVersion($fixture_html_encoded);
        $result = $story->getVersion();

        $this->assertEquals($fixture, $result);
    }

    public function testEpic()
    {
        $fixture = '<Epic>';
        $fixture_html_encoded = htmlentities($fixture);

        $story = new Story();
        $story->setEpic($fixture_html_encoded);
        $result = $story->getEpic();

        $this->assertEquals($fixture, $result);
    }

    public function testConstructWithParams()
    {
        $params = array(
            'key'       => 'str-001',
            'project'   => '<Project Name>',
            'summary'   => '<Story Summary>',
            'type'      => '<Type>',
            'effort'    =>  5,
            'link'      =>  'http://abc.def',
            'version'   =>  '<Version>',
            'epic'      =>  '<Epic>'
        );

        $story = new Story($params);

        $this->assertEquals(
            $params['key'],
            $story->getKey()
        );

        $this->assertEquals(
            $params['project'],
            $story->getProject()
        );

        $this->assertEquals(
            $params['summary'],
            $story->getSummary()
        );

        $this->assertEquals(
            $params['type'],
            $story->getType()
        );

        $this->assertEquals(
            $params['effort'],
            $story->getEffort()
        );

        $this->assertEquals(
            $params['link'],
            $story->getLink()
        );

        $this->assertEquals(
            $params['version'],
            $story->getVersion()
        );

        $this->assertEquals(
            $params['epic'],
            $story->getEpic()
        );
    }
}
