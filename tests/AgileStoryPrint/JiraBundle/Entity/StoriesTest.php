<?php

namespace Tests\AgileStoryPrint\JiraBundle\Entity;

use Symfony\Component\HttpFoundation\File\UploadedFile as UploadedFile;
use AgileStoryPrint\JiraBundle\Entity\Story as Story;
use AgileStoryPrint\JiraBundle\Entity\Stories as Stories;

/**
 * Unit test for the application utils.
 *
 * See http://symfony.com/doc/current/book/testing.html#unit-tests
 *
 * Execute the application tests using this command (requires PHPUnit to be installed):
 *
 *     $ phpunit tests/AgileStoryPrint/JiraBundle/Entity/StoriesTest.php
 */
class StoriesTest extends \PHPUnit_Framework_TestCase
{
    public function testEpic()
    {
        $fixture = new Story();
        $fixture->setKey('str-001');
        $fixture->setProject('<Project Name>');
        $fixture->setSummary('<Story Summary>');
        $fixture->setType('Epic');
        $fixture->setEffort(3);

        $stories = new Stories();
        $this->assertCount(
            0,
            $stories->getStories()
        );

        // Add a Story
        $stories->addStory($fixture);
        $this->assertCount(
            1,
            $stories->getStories()
        );

        // Check the story
        foreach ($stories->getStories() as $key)
        {
            $this->assertEquals(
                $fixture,
                $key
            );
        }


        // Add another time the same Story
        // it should not be added
        $stories->addStory($fixture);
        $this->assertCount(
            1,
            $stories->getStories()
        );

        // Add another Story
        $fixture2 = $fixture;
        $fixture2->setKey('str-002');

        $stories->addStory($fixture2);
        $this->assertCount(
            2,
            $stories->getStories()
        );
        

        // Remove a Story
        $stories->removeStory($fixture);
        $this->assertCount(
            1,
            $stories->getStories()
        );
    }
}
